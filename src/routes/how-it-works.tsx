import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Search, Sparkles, FileText, ShieldCheck, RefreshCw, Database } from "lucide-react";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How Lumen Research Works — Pipeline & Methodology" },
      { name: "description", content: "Lumen runs a structured 4-stage research pipeline: plan, search, read, synthesize. See exactly how every report is built and cited." },
      { property: "og:title", content: "How Lumen Research Works" },
      { property: "og:description", content: "A structured 4-stage pipeline: plan, search, read, synthesize — with every claim cited." },
      { property: "og:url", content: "https://research-flux-core.lovable.app/how-it-works" },
    ],
    links: [{ rel: "canonical", href: "https://research-flux-core.lovable.app/how-it-works" }],
  }),
  component: HowItWorksPage,
});

const STAGES = [
  {
    icon: Sparkles,
    name: "1. Plan",
    eta: "~5s",
    body: "A planner model decomposes your question into 3-7 targeted sub-queries covering definitions, key entities, recent developments, opposing viewpoints, and quantitative data.",
  },
  {
    icon: Search,
    name: "2. Search",
    eta: "20-40s",
    body: "Each sub-query fans out into a live web search via Tavily's advanced search. Results are deduplicated by URL and ranked by relevance signals.",
  },
  {
    icon: RefreshCw,
    name: "3. Gap-fill (Standard & Deep)",
    eta: "20-40s",
    body: "An audit pass identifies missing sub-topics, conflicting claims, and unexamined angles, then runs additional follow-up searches to fill the gaps.",
  },
  {
    icon: FileText,
    name: "4. Synthesize",
    eta: "30-60s",
    body: "A frontier model reads the full source set and writes a structured report with inline citations. Every non-trivial claim maps back to a numbered source.",
  },
];

const DEPTHS = [
  { name: "Quick", time: "~45s", sources: "up to 12", model: "Gemini 2.5 Flash", words: "~900" },
  { name: "Standard", time: "~90s", sources: "up to 22", model: "Gemini 2.5 Pro", words: "~1,800" },
  { name: "Deep", time: "~2-3 min", sources: "up to 35", model: "Gemini 2.5 Pro", words: "~2,800" },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-16">
        <div className="text-center">
          <Badge variant="secondary" className="mb-4">Methodology</Badge>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            How Lumen Research works
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Lumen isn't a chatbot. It's a structured pipeline that plans, searches the live web,
            reads sources, and synthesizes a cited report — in that exact order, every time.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {STAGES.map((s) => (
            <div key={s.name} className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between">
                <s.icon className="h-6 w-6 text-primary" />
                <Badge variant="outline" className="text-xs">{s.eta}</Badge>
              </div>
              <h2 className="mt-3 font-semibold text-card-foreground">{s.name}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>

        <section className="mt-16">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Research depths</h2>
          <p className="mt-2 text-muted-foreground">Pick the right tradeoff between speed and coverage.</p>
          <div className="mt-6 overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Mode</th>
                  <th className="px-4 py-3">Est. time</th>
                  <th className="px-4 py-3">Sources</th>
                  <th className="px-4 py-3">Synthesis model</th>
                  <th className="px-4 py-3">Avg. length</th>
                </tr>
              </thead>
              <tbody>
                {DEPTHS.map((d, i) => (
                  <tr key={d.name} className={i % 2 ? "bg-muted/20" : ""}>
                    <td className="px-4 py-3 font-medium text-foreground">{d.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{d.time}</td>
                    <td className="px-4 py-3 text-muted-foreground">{d.sources}</td>
                    <td className="px-4 py-3 text-muted-foreground">{d.model}</td>
                    <td className="px-4 py-3 text-muted-foreground">{d.words} words</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-16 grid gap-4 sm:grid-cols-3">
          {[
            { icon: ShieldCheck, title: "Verifiable citations", body: "Every numbered citation links to the real source URL. No hallucinated references." },
            { icon: Database, title: "Live data", body: "Lumen searches the live web at runtime — not stale training data from years ago." },
            { icon: RefreshCw, title: "Iterative coverage", body: "Standard and Deep modes run gap-filling rounds to surface conflicting and missing data." },
          ].map((f) => (
            <div key={f.title} className="rounded-xl border border-border bg-card p-6">
              <f.icon className="h-6 w-6 text-primary" />
              <h3 className="mt-3 font-semibold text-card-foreground">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </section>

        <section className="mt-16 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            See it in action
          </h2>
          <p className="mt-2 text-muted-foreground">Browse example reports or run your own question.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild><Link to="/signup">Start free <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
            <Button asChild variant="outline"><Link to="/examples">See example reports</Link></Button>
          </div>
        </section>
      </main>
    </div>
  );
}
