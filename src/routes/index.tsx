import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SiteHeader } from "@/components/site-header";
import { SampleReportView } from "@/components/sample-report";
import { SAMPLE_REPORTS } from "@/lib/sample-reports";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Search,
  FileText,
  Download,
  Check,
  X,
  Building2,
  LineChart,
  Briefcase,
  Compass,
  GraduationCap,
  TrendingUp,
  Clock,
  Link2,
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
          "Lumen Research is the AI research analyst that turns complex questions into structured, source-backed reports using live web search and frontier AI synthesis.",
      },
      { property: "og:title", content: "Lumen Research — AI research analyst" },
      {
        property: "og:description",
        content:
          "Source-backed market, competitive, and strategic research reports in minutes — not hours.",
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
          <div className="mx-auto max-w-6xl px-4 pt-20 pb-12 sm:pt-28">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                AI research analyst · live web · cited reports
              </div>
              <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
                Source-backed research reports in minutes, not hours.
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-muted-foreground">
                Lumen Research turns complex questions into structured, cited reports using
                live web search, multi-query research, and frontier AI synthesis. Built for
                analysts, founders, consultants, and operators who need answers they can defend.
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <Button size="lg" asChild>
                  <Link to="/signup">
                    Start researching free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/examples">View sample report</Link>
                </Button>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                No credit card required · 5 free reports/day
              </p>
            </div>

            {/* Product mockup */}
            <div className="mx-auto mt-16 max-w-5xl">
              <ProductMockup />
            </div>
          </div>
        </section>

        {/* Logos / social proof placeholder */}
        <section className="border-b border-border bg-muted/20">
          <div className="mx-auto max-w-5xl px-4 py-8 text-center">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Trusted by early users across strategy, investing, and founder research
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm font-semibold text-muted-foreground/70">
              <span>Independent VC funds</span>
              <span>·</span>
              <span>Boutique consultancies</span>
              <span>·</span>
              <span>Pre-seed founders</span>
              <span>·</span>
              <span>Corporate strategy teams</span>
            </div>
          </div>
        </section>

        {/* Use cases */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-20">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Built for high-stakes research workflows
              </h2>
              <p className="mt-4 text-muted-foreground">
                Lumen replaces hours of tab-juggling and manual synthesis with a single,
                defensible research artifact.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {USE_CASES.map((u) => (
                <div key={u.title} className="rounded-xl border border-border bg-card p-6">
                  <u.icon className="h-6 w-6 text-primary" />
                  <h3 className="mt-4 font-semibold text-card-foreground">{u.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground/80">Today:</span> {u.before}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    <span className="font-medium text-primary">With Lumen:</span> {u.after}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Live sample report */}
        <section className="border-b border-border bg-muted/20">
          <div className="mx-auto max-w-4xl px-4 py-20">
            <div className="text-center">
              <Badge variant="secondary" className="mb-3">
                <ShieldCheck className="mr-1 h-3 w-3" /> Real Lumen output · hover any [N] citation
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                See what a Lumen report actually looks like
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                Below is a real report Lumen produced. Every claim links back to its source —
                hover any bracketed number to preview where it came from.
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

        {/* Differentiation */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-20">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                A research system, not another chat window.
              </h2>
              <p className="mt-4 text-muted-foreground">
                Generic AI tools end the conversation with a guess. Lumen ends it with a
                structured, cited artifact you can share, file, and defend.
              </p>
            </div>

            <div className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-xl border border-border bg-card">
              <div className="grid grid-cols-3 border-b border-border bg-muted/40 text-sm font-semibold text-foreground">
                <div className="px-5 py-4">Capability</div>
                <div className="px-5 py-4 text-center">Generic AI chat</div>
                <div className="px-5 py-4 text-center text-primary">Lumen Research</div>
              </div>
              {COMPARISON.map((row, i) => (
                <div
                  key={row.label}
                  className={`grid grid-cols-3 text-sm ${
                    i % 2 === 0 ? "bg-background" : "bg-muted/20"
                  }`}
                >
                  <div className="px-5 py-4 font-medium text-foreground">{row.label}</div>
                  <div className="px-5 py-4 text-center text-muted-foreground">
                    {row.generic ? (
                      <span className="inline-flex items-center gap-1.5">
                        <X className="h-4 w-4 text-muted-foreground/70" />
                        {row.generic}
                      </span>
                    ) : (
                      <X className="mx-auto h-4 w-4 text-muted-foreground/70" />
                    )}
                  </div>
                  <div className="px-5 py-4 text-center text-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Check className="h-4 w-4 text-primary" />
                      {row.lumen}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Built for reports, not endless chat threads.
            </p>
          </div>
        </section>

        {/* Why now */}
        <section className="border-b border-border bg-muted/20">
          <div className="mx-auto max-w-5xl px-4 py-20">
            <div className="mx-auto max-w-2xl text-center">
              <Badge variant="secondary" className="mb-3">Why now</Badge>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Research workflows are being rebuilt around AI — verifiable AI.
              </h2>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {WHY_NOW.map((w) => (
                <div key={w.title} className="rounded-xl border border-border bg-card p-6">
                  <w.icon className="h-6 w-6 text-primary" />
                  <h3 className="mt-3 font-semibold text-card-foreground">{w.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{w.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust / metrics placeholders */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-20">
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                { stat: "Hours → minutes", label: "Typical research compression per report" },
                { stat: "20–35 sources", label: "Read and cited per standard report" },
                { stat: "100% traceable", label: "Every claim links to a source URL" },
              ].map((m) => (
                <div
                  key={m.label}
                  className="rounded-xl border border-border bg-card p-8 text-center"
                >
                  <div className="text-3xl font-bold tracking-tight text-foreground">
                    {m.stat}
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing teaser */}
        <section className="border-b border-border bg-muted/20">
          <div className="mx-auto max-w-5xl px-4 py-20">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Simple, usage-based pricing
              </h2>
              <p className="mt-4 text-muted-foreground">
                Start free. Upgrade when your research volume grows.
              </p>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-3">
              {PRICING.map((p) => (
                <div
                  key={p.name}
                  className={`flex flex-col rounded-xl border bg-card p-6 ${
                    p.featured ? "border-primary ring-1 ring-primary" : "border-border"
                  }`}
                >
                  <div className="text-sm font-semibold text-card-foreground">{p.name}</div>
                  <div className="mt-2 text-2xl font-bold text-foreground">{p.price}</div>
                  <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Button asChild variant="outline">
                <Link to="/pricing">See full pricing <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Privacy / Security */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-5xl px-4 py-20">
            <div className="mx-auto max-w-2xl text-center">
              <Badge variant="secondary" className="mb-3">
                <Lock className="mr-1 h-3 w-3" /> Private by default
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Enterprise-grade privacy for sensitive research
              </h2>
              <p className="mt-4 text-muted-foreground">
                Your reports are yours. Lumen treats research like the confidential
                deliverable it is — not training data.
              </p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {PRIVACY.map((item) => (
                <div
                  key={item.title}
                  className="flex gap-3 rounded-lg border border-border bg-card p-5"
                >
                  <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <h3 className="font-semibold text-card-foreground">{item.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Button asChild variant="outline">
                <Link to="/security">Read our security overview</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Built for next gen */}
        <section className="border-b border-border bg-muted/20">
          <div className="mx-auto max-w-3xl px-4 py-20 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Built for the next generation of research teams
            </h2>
            <p className="mt-4 text-muted-foreground">
              Lumen is designed for professionals who need reliable, verifiable research at
              startup speed — analysts shipping memos before market open, founders building
              conviction in a category overnight, consultants turning a vague brief into a
              defensible deliverable by morning.
            </p>
          </div>
        </section>

        {/* Final CTA */}
        <section>
          <div className="mx-auto max-w-4xl px-4 py-24 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Run your first source-backed research report today.
            </h2>
            <p className="mt-4 text-muted-foreground">
              From question to cited report in minutes. No setup, no prompt engineering.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button size="lg" asChild>
                <Link to="/signup">
                  Start researching free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/examples">View sample report</Link>
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              No credit card required · 5 free reports/day
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <Link to="/examples" className="hover:text-foreground">Examples</Link>
            <Link to="/how-it-works" className="hover:text-foreground">How it works</Link>
            <Link to="/pricing" className="hover:text-foreground">Pricing</Link>
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

/* ---------- inline data ---------- */

const USE_CASES = [
  {
    icon: TrendingUp,
    title: "Competitive intelligence",
    before: "Hours mapping competitors across blog posts, decks, and Crunchbase.",
    after: "One brief returns positioning, pricing, traction, and recent moves — cited.",
  },
  {
    icon: LineChart,
    title: "Market landscape reports",
    before: "Patchwork of analyst PDFs, paywalls, and Reddit threads.",
    after: "A structured landscape: size, segments, drivers, players, risks.",
  },
  {
    icon: Briefcase,
    title: "Investment & due diligence briefs",
    before: "Days of analyst time per opportunity in the pipeline.",
    after: "First-pass diligence brief with sources you can hand to a partner.",
  },
  {
    icon: Compass,
    title: "Strategy & operator research",
    before: "Vague brief becomes a deck nobody trusts.",
    after: "Operator-ready memo grounded in current, verifiable sources.",
  },
  {
    icon: Building2,
    title: "Account & prospect research",
    before: "Manual scraping of websites, filings, and news before every call.",
    after: "Pre-call brief on the account, leadership, and recent activity.",
  },
  {
    icon: GraduationCap,
    title: "Academic & policy research",
    before: "Citation hunts across journals, government sites, and news.",
    after: "Synthesized literature pass with every claim traceable to source.",
  },
] as const;

const COMPARISON = [
  {
    label: "Output format",
    generic: "Chat reply",
    lumen: "Structured cited report",
  },
  {
    label: "Web research",
    generic: "Single search at best",
    lumen: "Multi-query, multi-round",
  },
  {
    label: "Sources",
    generic: "Often unlinked or fabricated",
    lumen: "Real URLs, hover-previewable",
  },
  {
    label: "Export",
    generic: "Copy/paste",
    lumen: "Markdown & PDF, client-ready",
  },
  {
    label: "Repeatable workflow",
    generic: "Reset every conversation",
    lumen: "Saved, searchable history",
  },
  {
    label: "Built for",
    generic: "General Q&A",
    lumen: "Decision-grade research",
  },
] as const;

const WHY_NOW = [
  {
    icon: Sparkles,
    title: "Frontier AI can finally synthesize long-form research",
    body: "Modern reasoning models can read 20–35 sources and produce structured analysis — not just a paragraph reply.",
  },
  {
    icon: Search,
    title: "Live web data makes outputs current",
    body: "Multi-query search hits the live internet on every run, not a training cutoff from last year.",
  },
  {
    icon: ShieldCheck,
    title: "Teams demand verifiable answers",
    body: "Knowledge workers will not stake decisions on unsourced AI output. Citations are now table stakes.",
  },
  {
    icon: Zap,
    title: "Manual search is being replaced by research systems",
    body: "The next generation of analysts ships memos with AI research pipelines — not 40 open tabs.",
  },
] as const;

const PRICING = [
  {
    name: "Free",
    price: "$0",
    features: ["5 reports / day", "Full source citations", "Markdown & PDF export", "Private workspace"],
  },
  {
    name: "Pro",
    price: "$29/mo",
    featured: true,
    features: ["100 reports / month", "Deep research mode", "Priority queue", "Full report history"],
  },
  {
    name: "Team",
    price: "Custom",
    features: ["Shared workspace", "Admin controls", "Private team reports", "Priority support"],
  },
] as const;

const PRIVACY = [
  {
    icon: Lock,
    title: "Private reports by default",
    body: "Your research is visible only to you unless you explicitly publish a share link.",
  },
  {
    icon: ShieldCheck,
    title: "Auth-protected workspaces",
    body: "Every account is isolated. No cross-tenant access, ever.",
  },
  {
    icon: Database,
    title: "Row-level security",
    body: "Database-enforced access rules — security isn't a feature flag, it's the schema.",
  },
  {
    icon: Link2,
    title: "No public indexing",
    body: "Private research is never indexed, scraped, or used to train models.",
  },
] as const;

/* ---------- product mockup ---------- */

function ProductMockup() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-primary/5">
      {/* window chrome */}
      <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-500/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/60" />
        <span className="ml-3 text-xs text-muted-foreground">lumen — new research</span>
      </div>

      <div className="grid gap-0 md:grid-cols-[1fr_1.1fr]">
        {/* left: input + pipeline */}
        <div className="border-b border-border p-6 md:border-b-0 md:border-r">
          <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> Research question
          </label>
          <div className="mt-2 rounded-lg border border-border bg-background p-3 text-sm text-foreground">
            How is the GLP-1 obesity market evolving in 2026 — players, pricing,
            access, and competitive risks?
          </div>

          <div className="mt-5 flex items-center gap-2 text-xs">
            <Badge variant="secondary">Standard depth</Badge>
            <span className="text-muted-foreground">~2 min · 5+3 queries · ~22 sources</span>
          </div>

          <div className="mt-6 space-y-3">
            {[
              { icon: Search, label: "Plan: 5 sub-queries", state: "done" },
              { icon: Database, label: "Search: 23 sources gathered", state: "done" },
              { icon: Compass, label: "Gap-fill: 3 follow-up queries", state: "done" },
              { icon: FileText, label: "Synthesize cited report", state: "active" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-3 text-sm">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full border ${
                    s.state === "done"
                      ? "border-primary/30 bg-primary/10 text-primary"
                      : "border-border bg-muted text-muted-foreground"
                  }`}
                >
                  <s.icon className="h-3.5 w-3.5" />
                </div>
                <span
                  className={
                    s.state === "done"
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }
                >
                  {s.label}
                </span>
                {s.state === "done" ? (
                  <Check className="ml-auto h-4 w-4 text-primary" />
                ) : (
                  <span className="ml-auto h-2 w-2 animate-pulse rounded-full bg-primary" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* right: report preview */}
        <div className="p-6">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>Generated · 1m 47s</span>
            </div>
            <div className="flex gap-2">
              <span className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground">
                <Download className="h-3 w-3" /> .md
              </span>
              <span className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground">
                <Download className="h-3 w-3" /> PDF
              </span>
            </div>
          </div>

          <h3 className="mt-3 text-base font-semibold text-foreground">
            GLP-1 Obesity Market — 2026 Outlook
          </h3>

          <div className="mt-4 space-y-3 text-sm text-foreground">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Executive summary
            </div>
            <p className="leading-6">
              Semaglutide and tirzepatide continue to dominate, with combined revenues on
              track to exceed prior consensus
              <CitePill n={1} /> as access expands beyond endocrinology
              <CitePill n={2} />. Three competitive risks emerge in late 2026
              <CitePill n={3} />.
            </p>

            <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Key findings
            </div>
            <ul className="space-y-1.5 leading-6">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>
                  Payer access broadening in commercial plans, narrowing in Medicare
                  <CitePill n={4} />.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>
                  Oral GLP-1 candidates moving Phase 3 — disruption window 2027–2028
                  <CitePill n={5} />.
                </span>
              </li>
            </ul>
          </div>

          <div className="mt-5 rounded-md border border-border bg-muted/30 p-3 text-[11px] text-muted-foreground">
            <span className="font-semibold text-foreground">23 sources</span> · FDA, Reuters,
            company filings, payer formularies, peer-reviewed journals
          </div>
        </div>
      </div>
    </div>
  );
}

function CitePill({ n }: { n: number }) {
  return (
    <span className="mx-0.5 inline-flex items-baseline rounded bg-primary/10 px-1.5 text-[0.7em] font-semibold text-primary">
      {n}
    </span>
  );
}
