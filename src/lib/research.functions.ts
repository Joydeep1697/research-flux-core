import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const PLAN_QUOTAS: Record<string, number> = {
  free: 5,
  pro: 100,
  enterprise: 10000,
};

type Depth = "quick" | "standard" | "deep";

type DepthConfig = {
  initialSubQueries: number;
  resultsPerQuery: number;
  followupRounds: number;
  followupQueries: number;
  maxSources: number;
  excerptChars: number;
  plannerModel: string;
  synthesisModel: string;
  minWords: number;
  targetWords: number;
};

const DEPTH_CONFIG: Record<Depth, DepthConfig> = {
  quick: {
    initialSubQueries: 3,
    resultsPerQuery: 5,
    followupRounds: 0,
    followupQueries: 0,
    maxSources: 12,
    excerptChars: 1500,
    plannerModel: "google/gemini-2.5-flash",
    synthesisModel: "google/gemini-2.5-flash",
    minWords: 600,
    targetWords: 900,
  },
  standard: {
    initialSubQueries: 5,
    resultsPerQuery: 6,
    followupRounds: 1,
    followupQueries: 3,
    maxSources: 22,
    excerptChars: 2200,
    plannerModel: "google/gemini-2.5-flash",
    synthesisModel: "google/gemini-2.5-pro",
    minWords: 1400,
    targetWords: 1800,
  },
  deep: {
    initialSubQueries: 7,
    resultsPerQuery: 8,
    followupRounds: 2,
    followupQueries: 4,
    maxSources: 35,
    excerptChars: 2800,
    plannerModel: "google/gemini-2.5-pro",
    synthesisModel: "google/gemini-2.5-pro",
    minWords: 2200,
    targetWords: 2800,
  },
};

type TavilyResult = {
  title: string;
  url: string;
  content: string;
  score?: number;
};

async function tavilySearch(
  query: string,
  apiKey: string,
  maxResults: number,
): Promise<TavilyResult[]> {
  const res = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: apiKey,
      query,
      search_depth: "advanced",
      max_results: maxResults,
      include_answer: false,
      include_raw_content: false,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Tavily search failed (${res.status}): ${text.slice(0, 200)}`);
  }
  const data = await res.json();
  return (data.results ?? []) as TavilyResult[];
}

async function callAI(
  messages: Array<{ role: string; content: string }>,
  apiKey: string,
  model: string,
): Promise<string> {
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model, messages }),
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

function parseJsonArray(raw: string): string[] {
  const cleaned = raw.replace(/```json\s*|```/g, "").trim();
  // Try direct parse first, then locate first JSON array.
  try {
    const arr = JSON.parse(cleaned);
    if (Array.isArray(arr)) return arr.filter((s) => typeof s === "string");
  } catch {
    // fall through
  }
  const match = cleaned.match(/\[[\s\S]*\]/);
  if (match) {
    try {
      const arr = JSON.parse(match[0]);
      if (Array.isArray(arr)) return arr.filter((s) => typeof s === "string");
    } catch {
      // fall through
    }
  }
  return [];
}

async function planInitialQueries(
  question: string,
  apiKey: string,
  cfg: DepthConfig,
): Promise<string[]> {
  const out = await callAI(
    [
      {
        role: "system",
        content: `You are a senior research planner. Decompose the user's question into ${cfg.initialSubQueries} diverse, focused web search queries that together provide BROAD COVERAGE: definitions, key entities, recent developments, opposing viewpoints, quantitative data, and credible sources. Return ONLY a JSON array of strings.`,
      },
      { role: "user", content: question },
    ],
    apiKey,
    cfg.plannerModel,
  );
  const arr = parseJsonArray(out);
  return (arr.length > 0 ? arr : [question]).slice(0, cfg.initialSubQueries);
}

async function planFollowupQueries(
  question: string,
  knownSources: TavilyResult[],
  apiKey: string,
  cfg: DepthConfig,
): Promise<string[]> {
  const digest = knownSources
    .slice(0, 15)
    .map((s, i) => `[${i + 1}] ${s.title}\n${s.content.slice(0, 400)}`)
    .join("\n\n");
  const out = await callAI(
    [
      {
        role: "system",
        content: `You audit research coverage. Given the user's question and a digest of sources already gathered, identify GAPS, contradictions, missing recent data, and unexamined sub-topics. Return ONLY a JSON array of ${cfg.followupQueries} new web search queries that fill those gaps. The queries must be different from anything obviously already covered.`,
      },
      {
        role: "user",
        content: `Research question:\n${question}\n\nExisting source digest:\n${digest}\n\nReturn the ${cfg.followupQueries} most valuable follow-up queries.`,
      },
    ],
    apiKey,
    cfg.plannerModel,
  );
  return parseJsonArray(out).slice(0, cfg.followupQueries);
}

async function runSearchRound(
  queries: string[],
  tavilyKey: string,
  cfg: DepthConfig,
  existing: Map<string, TavilyResult>,
): Promise<void> {
  const results = await Promise.all(
    queries.map((q) => tavilySearch(q, tavilyKey, cfg.resultsPerQuery).catch(() => [])),
  );
  for (const list of results) {
    for (const r of list) {
      if (!existing.has(r.url) && existing.size < cfg.maxSources) {
        existing.set(r.url, r);
      }
    }
  }
}

export const startResearch = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        query: z.string().min(8, "Question is too short").max(500, "Question is too long"),
        depth: z.enum(["quick", "standard", "deep"]).default("standard"),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const tavilyKey = process.env.TAVILY_API_KEY;
    const lovableKey = process.env.LOVABLE_API_KEY;
    if (!tavilyKey) throw new Error("Search provider is not configured.");
    if (!lovableKey) throw new Error("AI provider is not configured.");

    const cfg = DEPTH_CONFIG[data.depth];

    // Quota check
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("plan, status")
      .eq("user_id", userId)
      .maybeSingle();
    const plan = sub?.plan ?? "free";
    const quota = PLAN_QUOTAS[plan] ?? 5;

    // Restrict deep mode to paid plans to keep free tier costs bounded.
    if (data.depth === "deep" && plan === "free") {
      throw new Error("Deep research is available on the Pro plan. Upgrade to unlock.");
    }

    // Free plan: daily quota. Paid plans: monthly quota.
    const windowStart = new Date();
    if (plan === "free") {
      windowStart.setUTCHours(0, 0, 0, 0);
    } else {
      windowStart.setUTCDate(1);
      windowStart.setUTCHours(0, 0, 0, 0);
    }
    const { count } = await supabase
      .from("research_reports")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("created_at", windowStart.toISOString());

    if ((count ?? 0) >= quota) {
      const period = plan === "free" ? "Daily" : "Monthly";
      throw new Error(`${period} quota of ${quota} reports reached on the ${plan} plan. Upgrade for more.`);
    }

    // Create pending report
    const { data: report, error: insertErr } = await supabase
      .from("research_reports")
      .insert({ user_id: userId, query: data.query, status: "researching" })
      .select("id")
      .single();
    if (insertErr || !report) throw new Error(insertErr?.message ?? "Failed to create report");

    const reportId = report.id as string;

    try {
      // Round 1: initial plan + fan-out search
      const initialQueries = await planInitialQueries(data.query, lovableKey, cfg);
      const merged = new Map<string, TavilyResult>();
      await runSearchRound(initialQueries, tavilyKey, cfg, merged);

      // Iterative gap-filling rounds
      for (let round = 0; round < cfg.followupRounds; round++) {
        if (merged.size >= cfg.maxSources) break;
        const followups = await planFollowupQueries(
          data.query,
          Array.from(merged.values()),
          lovableKey,
          cfg,
        );
        if (followups.length === 0) break;
        await runSearchRound(followups, tavilyKey, cfg, merged);
      }

      const sources = Array.from(merged.values()).slice(0, cfg.maxSources);

      if (sources.length === 0) {
        await supabase
          .from("research_reports")
          .update({
            status: "failed",
            error: "No sources found for this query.",
            completed_at: new Date().toISOString(),
          })
          .eq("id", reportId);
        throw new Error("No sources found for this query.");
      }

      await supabase.from("research_reports").update({ status: "synthesizing" }).eq("id", reportId);

      const contextText = sources
        .map(
          (s, i) =>
            `[${i + 1}] ${s.title}\nURL: ${s.url}\n${s.content.slice(0, cfg.excerptChars)}`,
        )
        .join("\n\n---\n\n");

      const synthesis = await callAI(
        [
          {
            role: "system",
            content: `You are a meticulous senior research analyst writing a long-form, decision-grade report in Markdown.

REQUIRED STRUCTURE:
# Title
## Executive Summary
- 4-7 sharp bullet points capturing the bottom line.
## Key Findings
- 6-10 bulleted findings, each backed by inline citations.
## Detailed Analysis
- 4-7 sub-sections (## headings) covering distinct themes (e.g. landscape, drivers, risks, players, data, outlook).
- Use sub-bullets, tables, or numbered lists where they improve clarity.
## Contrasting Viewpoints
- Explicitly note disagreements, uncertainty, or competing interpretations across sources.
## Data & Evidence
- Pull out specific numbers, dates, named entities, and quotes when sources allow.
## Conclusions & Implications
- Concrete takeaways and what they mean for a decision-maker.
## Open Questions
- 3-6 unresolved questions worth further investigation.
## Sources
- Numbered list of every cited source with its URL.

RULES:
- TARGET LENGTH: ~${cfg.targetWords} words. MINIMUM: ${cfg.minWords} words. Be substantive — do not pad.
- Cite EVERY non-trivial claim inline with bracketed numbers like [3], [7] that map to the numbered source list.
- Prefer specifics over generalities: numbers, names, dates, mechanisms.
- Where sources conflict, surface the conflict rather than averaging it away.
- Do NOT invent facts, statistics, or sources beyond what is provided.
- Markdown only. Do NOT wrap the entire output in a code block.`,
          },
          {
            role: "user",
            content: `Research question: ${data.query}\n\nDepth mode: ${data.depth}\n\nSources (${sources.length} total):\n\n${contextText}\n\nWrite the full report now.`,
          },
        ],
        lovableKey,
        cfg.synthesisModel,
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
        .update({
          status: "failed",
          error: message,
          completed_at: new Date().toISOString(),
        })
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

function makeSlug() {
  // 16 url-safe chars
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  let s = "";
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  for (const b of bytes) s += alphabet[b % alphabet.length];
  return s;
}

export const toggleReportPublic = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({ id: z.string().uuid(), isPublic: z.boolean() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: existing, error: readErr } = await supabase
      .from("research_reports")
      .select("public_slug")
      .eq("id", data.id)
      .single();
    if (readErr) throw new Error(readErr.message);

    const slug = data.isPublic ? existing?.public_slug ?? makeSlug() : existing?.public_slug;
    const { error } = await supabase
      .from("research_reports")
      .update({ is_public: data.isPublic, public_slug: slug })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { slug: data.isPublic ? slug : null };
  });

export const getReportBySlug = createServerFn({ method: "GET" })
  .inputValidator((input) => z.object({ slug: z.string().min(8).max(64) }).parse(input))
  .handler(async ({ data }) => {
    // Uses the public RLS policy (is_public = true) via the anon-key client.
    const { createClient } = await import("@supabase/supabase-js");
    const url = process.env.SUPABASE_URL!;
    const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
    const anon = createClient(url, key);
    const { data: report, error } = await anon
      .from("research_reports")
      .select("id, query, content, sources, created_at, completed_at, is_public")
      .eq("public_slug", data.slug)
      .eq("is_public", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return report;
  });
