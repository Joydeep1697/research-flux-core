import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const PLAN_QUOTAS: Record<string, number> = {
  free: 5,
  pro: 100,
  enterprise: 10000,
};

type TavilyResult = {
  title: string;
  url: string;
  content: string;
  score?: number;
};

async function tavilySearch(query: string, apiKey: string): Promise<TavilyResult[]> {
  const res = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: apiKey,
      query,
      search_depth: "advanced",
      max_results: 6,
      include_answer: false,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Tavily search failed (${res.status}): ${text.slice(0, 200)}`);
  }
  const data = await res.json();
  return (data.results ?? []) as TavilyResult[];
}

async function callAI(messages: Array<{ role: string; content: string }>, apiKey: string): Promise<string> {
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    if (res.status === 429) throw new Error("AI rate limit reached. Please try again in a moment.");
    if (res.status === 402) throw new Error("AI credits exhausted. Please add credits in workspace settings.");
    throw new Error(`AI call failed (${res.status}): ${text.slice(0, 200)}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

async function generateSubQueries(question: string, apiKey: string): Promise<string[]> {
  const out = await callAI(
    [
      {
        role: "system",
        content:
          "You break a research question into 3-5 focused web search queries. Return ONLY a JSON array of strings, no prose.",
      },
      { role: "user", content: question },
    ],
    apiKey,
  );
  try {
    const cleaned = out.replace(/```json\s*|```/g, "").trim();
    const arr = JSON.parse(cleaned);
    if (Array.isArray(arr)) return arr.filter((s) => typeof s === "string").slice(0, 5);
  } catch {
    // fall through
  }
  return [question];
}

export const startResearch = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({
      query: z.string().min(8, "Question is too short").max(500, "Question is too long"),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const tavilyKey = process.env.TAVILY_API_KEY;
    const lovableKey = process.env.LOVABLE_API_KEY;
    if (!tavilyKey) throw new Error("Search provider is not configured.");
    if (!lovableKey) throw new Error("AI provider is not configured.");

    // Quota check
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("plan, status")
      .eq("user_id", userId)
      .maybeSingle();
    const plan = sub?.plan ?? "free";
    const quota = PLAN_QUOTAS[plan] ?? 5;

    const monthStart = new Date();
    monthStart.setUTCDate(1);
    monthStart.setUTCHours(0, 0, 0, 0);
    const { count } = await supabase
      .from("research_reports")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("created_at", monthStart.toISOString());

    if ((count ?? 0) >= quota) {
      throw new Error(`Monthly quota of ${quota} reports reached on the ${plan} plan. Upgrade for more.`);
    }

    // Create pending report
    const { data: report, error: insertErr } = await supabase
      .from("research_reports")
      .insert({ user_id: userId, query: data.query, status: "researching" })
      .select("id")
      .single();
    if (insertErr || !report) throw new Error(insertErr?.message ?? "Failed to create report");

    const reportId = report.id as string;

    // Fire and forget the long-running work via a deferred promise; but server fns must complete.
    // Run synchronously and return when done so the UI can poll/refetch.
    try {
      const subQueries = await generateSubQueries(data.query, lovableKey);

      // Fan out searches
      const searchResults = await Promise.all(subQueries.map((q) => tavilySearch(q, tavilyKey).catch(() => [])));
      const merged = new Map<string, TavilyResult>();
      for (const list of searchResults) {
        for (const r of list) {
          if (!merged.has(r.url)) merged.set(r.url, r);
        }
      }
      const sources = Array.from(merged.values()).slice(0, 20);

      if (sources.length === 0) {
        await supabase
          .from("research_reports")
          .update({ status: "failed", error: "No sources found for this query.", completed_at: new Date().toISOString() })
          .eq("id", reportId);
        throw new Error("No sources found for this query.");
      }

      await supabase.from("research_reports").update({ status: "synthesizing" }).eq("id", reportId);

      // Build context
      const contextText = sources
        .map(
          (s, i) =>
            `[${i + 1}] ${s.title}\nURL: ${s.url}\n${s.content.slice(0, 1500)}`,
        )
        .join("\n\n---\n\n");

      const synthesis = await callAI(
        [
          {
            role: "system",
            content: `You are a meticulous research analyst. Write a structured, in-depth report in Markdown.

REQUIRED STRUCTURE:
# Title
## Executive Summary (3-5 sentences)
## Key Findings (bulleted)
## Detailed Analysis (multiple sub-sections with ## headings)
## Conclusions
## Sources

RULES:
- Cite sources inline using bracketed numbers like [1], [2] that map to the numbered source list provided.
- Be specific and quantitative where the sources allow.
- Do NOT invent facts or sources beyond what is provided.
- The "Sources" section should be a numbered list of all sources you cited, with their URLs.`,
          },
          {
            role: "user",
            content: `Research question: ${data.query}\n\nSources:\n\n${contextText}\n\nWrite the full report now.`,
          },
        ],
        lovableKey,
      );

      const sourcesJson = sources.map((s, i) => ({
        index: i + 1,
        title: s.title,
        url: s.url,
      }));

      await supabase
        .from("research_reports")
        .update({
          status: "completed",
          content: synthesis,
          sources: sourcesJson,
          completed_at: new Date().toISOString(),
        })
        .eq("id", reportId);

      return { id: reportId };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Research failed";
      await supabase
        .from("research_reports")
        .update({ status: "failed", error: message, completed_at: new Date().toISOString() })
        .eq("id", reportId);
      throw err;
    }
  });

export const deleteReport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { error } = await supabase.from("research_reports").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
