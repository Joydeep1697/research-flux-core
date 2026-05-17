import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SiteHeader } from "@/components/site-header";
import { SampleReportView } from "@/components/sample-report";
import { SAMPLE_REPORTS } from "@/lib/sample-reports";
import {
  ArrowRight,
  FileText,
  Shield,
  Search,
  Sparkles,
  ShieldCheck,
  Check,
  X,
  Briefcase,
  TrendingUp,
  Building2,
  GraduationCap,
  LineChart,
  Clock,
  Link2,
  Layers,
  Download,
  Lock,
  Database,
  Zap,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lumen Research — AI research analyst for source-backed reports" },
      {
        name: "description",
        content:
          "Lumen Research turns complex questions into structured, cited reports using live web search, multi-query research, and frontier AI synthesis. Built for analysts, founders, and operators.",
      },
      { property: "og:title", content: "Lumen Research — AI research analyst" },
      {
        property: "og:description",
        content: "Source-backed research reports in minutes, not hours.",
      },
      { property: "og:url", content: "https://research-flux-core.lovable.app/" },
    ],
    links: [{ rel: "canonical", href: "https://research-flux-core.lovable.app/" }],
  }),
  component: LandingPage,
});

function LandingPage() {
  const featured = SAMPLE_REPORTS[0];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--color-primary)/0.10,_transparent_55%)]" />
          <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:py-28">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                AI research analyst · live web · cited output
              </div>
              <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Source-backed research reports in minutes, not hours.
              </h1>
              <p className="mt-5 max-w-xl text-lg text-muted-foreground">
                Lumen Research turns complex questions into structured, cited reports using
                live web search, multi-query research, and frontier AI synthesis. Built for
                analysts, founders, and operators — not endless chat threads.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button size="lg" asChild>
                  <Link to="/signup">
                    Start researching free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="#sample-report">View sample report</a>
                </Button>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                No credit card required · 5 free reports/day
              </p>
            </div>

            {/* Product mockup */}
            <ProductMockup />
          </div>
        </section>

        {/* Logo / trust strip */}
        <section className="border-b border-border bg-muted/20">
          <div className="mx-auto max-w-6xl px-4 py-8">
            <p className="text-center text-xs uppercase tracking-widest text-muted-foreground">
              Trusted by early users across strategy, investing, and founder research
            </p>
            <div className="mt-6 grid grid-cols-2 gap-6 text-center sm:grid-cols-4">
              {[
                { k: "10k+", v: "Sources analyzed" },
                { k: "<2 min", v: "Avg. report time" },
                { k: "100%", v: "Citations linked" },
                { k: "0", v: "Training on your data" },
              ].map((m) => (
                <div key={m.v}>
                  <div className="text-2xl font-semibold text-foreground">{m.k}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{m.v}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Live sample report */}
        <section id="sample-report" className="border-b border-border">
          <div className="mx-auto max-w-4xl px-4 py-20">
            <div className="text-center">
              <Badge variant="secondary" className="mb-3">
                <ShieldCheck className="mr-1 h-3 w-3" /> Real Lumen output · hover any [N] to inspect the source
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                See what a Lumen report actually looks like
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                Below is a real report Lumen produced. Every claim links back to its source —
                no hallucinated references, no unverifiable summaries.
              </p>
            </div>

            <div className="mt-10">
              <SampleReportView report={featured} defaultCollapsedAfter={1} />
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button asChild>
                <Link to="/examples">
                  Browse more examples <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/how-it-works">How the pipeline works</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Use cases */}
        <section className="border-b border-border bg-muted/20">
          <div className="mx-auto max-w-6xl px-4 py-20">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Built for high-stakes research workflows
              </h2>
              <p className="mt-4 text-muted-foreground">
                When the answer needs to be defensible, Lumen replaces hours of tab-juggling
                with a single structured, cited report.
              </p>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: TrendingUp,
                  title: "Competitive intelligence",
                  problem: "Sales decks, pricing pages, and reviews scattered across the web.",
                  outcome: "One brief with positioning, pricing, weaknesses, and citations.",
                },
                {
                  icon: LineChart,
                  title: "Market landscape reports",
                  problem: "Hours mapping players, segments, and growth drivers manually.",
                  outcome: "Structured market map with sized segments and source links.",
                },
                {
                  icon: Briefcase,
                  title: "Investment & due diligence",
                  problem: "Verifying claims across founder pitches and press coverage.",
                  outcome: "Cited diligence memo with traceable evidence for every claim.",
                },
                {
                  icon: Building2,
                  title: "Strategy & operator research",
                  problem: "Internal teams need fast, defensible inputs to a decision.",
                  outcome: "On-demand briefs in minutes, exportable to Docs or Notion.",
                },
                {
                  icon: GraduationCap,
                  title: "Academic & policy research",
                  problem: "Tracking primary sources and regulator publications by hand.",
                  outcome: "Structured synthesis with publisher, date, and excerpt per source.",
                },
                {
                  icon: Search,
                  title: "Founder research sprints",
                  problem: "Quick reads on a market, a competitor, or a regulation, fast.",
                  outcome: "5 free reports/day to keep your decision velocity high.",
                },
              ].map((u) => (
                <div key={u.title} className="rounded-xl border border-border bg-card p-6">
                  <u.icon className="h-5 w-5 text-primary" />
                  <h3 className="mt-4 font-semibold text-card-foreground">{u.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{u.problem}</p>
                  <p className="mt-3 text-sm text-foreground">
                    <span className="font-medium text-primary">With Lumen: </span>
                    {u.outcome}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Measurable value */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-20">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  Concrete output. Concrete time saved.
                </h2>
                <p className="mt-4 text-muted-foreground">
                  Lumen isn't a chat companion. It is a research pipeline that produces a
                  finished artifact you can hand to a partner, a client, or an IC.
                </p>
                <ul className="mt-8 space-y-4">
                  {[
                    { icon: Clock, t: "Compress hours of manual search into a structured report." },
                    { icon: Link2, t: "Trace every claim back to a source URL — no orphan facts." },
                    { icon: Download, t: "Export client-ready Markdown and PDF in one click." },
                    { icon: Layers, t: "Run multi-query research instead of one-off search prompts." },
                  ].map((v) => (
                    <li key={v.t} className="flex items-start gap-3">
                      <div className="rounded-md border border-border bg-card p-2">
                        <v.icon className="h-4 w-4 text-primary" />
                      </div>
                      <p className="pt-1.5 text-sm text-foreground">{v.t}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Compare */}
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Lumen vs. generic AI chat
                </div>
                <h3 className="mt-2 text-xl font-semibold text-card-foreground">
                  Built for reports, not endless chat threads.
                </h3>
                <div className="mt-6 grid grid-cols-[1fr_auto_auto] gap-x-4 gap-y-3 text-sm">
                  <div />
                  <div className="text-center text-xs font-semibold uppercase text-muted-foreground">Chat tools</div>
                  <div className="text-center text-xs font-semibold uppercase text-primary">Lumen</div>
                  {[
                    "Structured research workflows",
                    "Multi-query live web search",
                    "Source-backed synthesis with citations",
                    "Export-ready Markdown & PDF",
                    "Repeatable, reviewable research history",
                    "Private workspace with row-level security",
                  ].map((row) => (
                    <RowCompare key={row} label={row} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why now */}
        <section className="border-b border-border bg-muted/20">
          <div className="mx-auto max-w-5xl px-4 py-20">
            <div className="text-center">
              <Badge variant="secondary" className="mb-3">Why now</Badge>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Knowledge work is moving from search to research systems.
              </h2>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: Sparkles,
                  t: "Frontier AI can finally synthesize long-form, multi-source research without losing the thread.",
                },
                {
                  icon: Zap,
                  t: "Live web access closes the gap between stale training data and what is true today.",
                },
                {
                  icon: ShieldCheck,
                  t: "Teams demand verifiable answers — citations, not vibes — before acting on AI output.",
                },
                {
                  icon: Database,
                  t: "Manual tab-juggling and copy-paste workflows are being replaced by AI research pipelines.",
                },
              ].map((r, i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-5">
                  <r.icon className="h-5 w-5 text-primary" />
                  <p className="mt-3 text-sm text-foreground">{r.t}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Privacy / security */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-20">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
              <div>
                <Badge variant="secondary" className="mb-3">Enterprise-credible privacy</Badge>
                <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  Your research is yours.
                </h2>
                <p className="mt-4 text-muted-foreground">
                  Reports are private by default, scoped to your workspace, and never indexed
                  publicly unless you explicitly share a link.
                </p>
                <div className="mt-6">
                  <Button asChild variant="outline">
                    <Link to="/security">
                      Read the security overview <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { icon: Lock, t: "Auth-protected workspaces with row-level security on every record." },
                  { icon: Shield, t: "No public indexing of private research. Sharing is opt-in, per report." },
                  { icon: FileText, t: "Clear ownership — every report you generate is yours to keep or export." },
                  { icon: Database, t: "No training on your queries or generated reports. Ever." },
                ].map((f, i) => (
                  <div key={i} className="rounded-lg border border-border bg-card p-5">
                    <f.icon className="h-5 w-5 text-primary" />
                    <p className="mt-3 text-sm text-foreground">{f.t}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Built for the next generation */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-4xl px-4 py-20 text-center">
            <Badge variant="secondary" className="mb-3">Our thesis</Badge>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Built for the next generation of research teams.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-muted-foreground">
              The next decade of knowledge work belongs to teams that can produce reliable,
              verifiable research at startup speed. Lumen is the system of record for that work —
              built for analysts, founders, consultants, and operators who need answers they
              can defend, not paragraphs they have to fact-check.
            </p>
          </div>
        </section>

        {/* Final CTA */}
        <section>
          <div className="mx-auto max-w-4xl px-4 py-24 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
              Run your first source-backed research report today.
            </h2>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Button size="lg" asChild>
                <Link to="/signup">
                  Start researching free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#sample-report">View sample report</a>
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              No credit card required · 5 free reports/day
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-10">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <Link to="/examples" className="hover:text-foreground">Examples</Link>
            <Link to="/how-it-works" className="hover:text-foreground">How it works</Link>
            <Link to="/security" className="hover:text-foreground">Security</Link>
          </div>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Lumen Research. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

function RowCompare({ label }: { label: string }) {
  return (
    <>
      <div className="text-foreground">{label}</div>
      <div className="flex justify-center">
        <X className="h-4 w-4 text-muted-foreground/70" />
      </div>
      <div className="flex justify-center">
        <Check className="h-4 w-4 text-primary" />
      </div>
    </>
  );
}

function ProductMockup() {
  return (
    <div className="relative">
      <div className="absolute -inset-6 -z-10 rounded-3xl bg-[radial-gradient(circle_at_30%_20%,_var(--color-primary)/0.15,_transparent_60%)]" />
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
        {/* Window chrome */}
        <div className="flex items-center gap-1.5 border-b border-border bg-muted/40 px-3 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
          <div className="ml-3 truncate text-[11px] text-muted-foreground">
            lumen.research / new report
          </div>
        </div>

        {/* Query input */}
        <div className="space-y-3 p-4">
          <div className="rounded-lg border border-border bg-background p-3">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Research question
            </div>
            <div className="mt-1 text-sm text-foreground">
              How are enterprises adopting AI agents in 2026? Map vendors, budgets, blockers.
            </div>
          </div>

          {/* Pipeline */}
          <div className="grid grid-cols-4 gap-2 text-[10px]">
            {[
              { label: "Plan", done: true },
              { label: "Search", done: true },
              { label: "Read", done: true },
              { label: "Synthesize", done: false },
            ].map((s, i) => (
              <div
                key={s.label}
                className={`rounded-md border px-2 py-1.5 ${
                  s.done
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-border bg-muted/30 text-muted-foreground"
                }`}
              >
                <div className="font-semibold">0{i + 1}</div>
                <div>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Sources */}
          <div className="rounded-lg border border-border bg-background p-3">
            <div className="flex items-center justify-between">
              <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Sources gathered
              </div>
              <span className="text-[10px] text-muted-foreground">23 / 35</span>
            </div>
            <div className="mt-2 space-y-1.5">
              {[
                { p: "mckinsey.com", t: "The state of AI in 2026" },
                { p: "a16z.com", t: "Agent-native enterprise stacks" },
                { p: "gartner.com", t: "Forecast: Enterprise AI spend" },
              ].map((s) => (
                <div key={s.t} className="flex items-center gap-2 text-[11px]">
                  <Link2 className="h-3 w-3 shrink-0 text-primary" />
                  <span className="shrink-0 text-muted-foreground">{s.p}</span>
                  <span className="truncate text-foreground">{s.t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Report preview */}
          <div className="rounded-lg border border-border bg-background p-3">
            <div className="flex items-center justify-between">
              <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Cited report · draft
              </div>
              <div className="flex gap-1">
                <span className="rounded border border-border bg-card px-1.5 py-0.5 text-[9px] font-medium text-foreground">
                  .md
                </span>
                <span className="rounded border border-border bg-card px-1.5 py-0.5 text-[9px] font-medium text-foreground">
                  .pdf
                </span>
              </div>
            </div>
            <div className="mt-2 space-y-1">
              <div className="text-[12px] font-semibold text-foreground">
                Executive summary
              </div>
              <div className="text-[11px] leading-relaxed text-muted-foreground">
                Enterprise AI agent adoption is shifting from pilots to production
                <span className="mx-0.5 rounded bg-primary/15 px-1 text-[9px] font-semibold text-primary">
                  1
                </span>
                , with budgets concentrating on workflow automation
                <span className="mx-0.5 rounded bg-primary/15 px-1 text-[9px] font-semibold text-primary">
                  2
                </span>
                . Top blockers remain data access and evaluation
                <span className="mx-0.5 rounded bg-primary/15 px-1 text-[9px] font-semibold text-primary">
                  3
                </span>
                .
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
