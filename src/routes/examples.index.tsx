import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { SAMPLE_REPORTS } from "@/lib/sample-reports";
import { ArrowRight, Clock, FileText } from "lucide-react";

export const Route = createFileRoute("/examples/")({
  head: () => ({
    meta: [
      { title: "Example Research Reports — Lumen Research" },
      { name: "description", content: "See real, fully-cited Lumen research reports across AI, healthcare, and finance. Every claim links back to its source." },
      { property: "og:title", content: "Example Research Reports — Lumen Research" },
      { property: "og:description", content: "Real, fully-cited Lumen research reports across AI, healthcare, and finance." },
      { property: "og:url", content: "https://research-flux-core.lovable.app/examples" },
    ],
    links: [{ rel: "canonical", href: "https://research-flux-core.lovable.app/examples" }],
  }),
  component: ExamplesPage,
});

function ExamplesPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Example research reports
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Real Lumen output across industries. Every claim is inline-cited and every
            source is linked. Hover any citation to preview the source.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SAMPLE_REPORTS.map((r) => (
            <Link
              key={r.slug}
              to="/examples/$slug"
              params={{ slug: r.slug }}
              className="group flex flex-col rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/50"
            >
              <Badge variant="secondary" className="self-start">{r.industry}</Badge>
              <h2 className="mt-3 text-lg font-semibold leading-snug text-card-foreground group-hover:text-primary">
                {r.title}
              </h2>
              <p className="mt-2 line-clamp-2 text-sm italic text-muted-foreground">
                "{r.query}"
              </p>
              <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{r.readMinutes} min</span>
                <span className="flex items-center gap-1"><FileText className="h-3 w-3" />{r.sources.length} sources</span>
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Read report <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
