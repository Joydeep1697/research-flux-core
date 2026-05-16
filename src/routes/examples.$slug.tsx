import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { SampleReportView } from "@/components/sample-report";
import { getSampleReport, SAMPLE_REPORTS } from "@/lib/sample-reports";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/examples/$slug")({
  loader: ({ params }) => {
    const report = getSampleReport(params.slug);
    if (!report) throw notFound();
    return { report };
  },
  head: ({ loaderData, params }) => {
    const r = loaderData?.report;
    if (!r) return { meta: [{ title: "Example — Lumen Research" }] };
    return {
      meta: [
        { title: `${r.title} — Lumen Research` },
        { name: "description", content: r.summary[0]?.replace(/\[\d+\]/g, "").trim() ?? r.title },
        { property: "og:title", content: r.title },
        { property: "og:description", content: r.summary[0]?.replace(/\[\d+\]/g, "").trim() ?? r.title },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `https://research-flux-core.lovable.app/examples/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `https://research-flux-core.lovable.app/examples/${params.slug}` }],
      scripts: [{
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: r.title,
          datePublished: r.publishedAt,
          author: { "@type": "Organization", name: "Lumen Research" },
        }),
      }],
    };
  },
  component: ExampleDetail,
});

function ExampleDetail() {
  const { report } = Route.useLoaderData();
  const others = SAMPLE_REPORTS.filter((r) => r.slug !== report.slug).slice(0, 2);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <Button asChild variant="ghost" size="sm">
          <Link to="/examples"><ArrowLeft className="mr-2 h-4 w-4" /> All examples</Link>
        </Button>

        <div className="mt-6">
          <SampleReportView report={report} defaultCollapsedAfter={2} />
        </div>

        <div className="mt-10 rounded-xl border border-border bg-card p-6 text-center">
          <h2 className="text-xl font-semibold text-card-foreground">
            Run a report like this on your own question
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Free to start. 5 reports/month on Free, no credit card required.
          </p>
          <Button asChild className="mt-4">
            <Link to="/signup">Start researching free <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>

        {others.length > 0 && (
          <div className="mt-10">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              More examples
            </h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {others.map((o) => (
                <Link
                  key={o.slug}
                  to="/examples/$slug"
                  params={{ slug: o.slug }}
                  className="rounded-lg border border-border bg-card p-4 hover:border-primary/50"
                >
                  <div className="text-xs text-muted-foreground">{o.industry}</div>
                  <div className="mt-1 font-medium text-card-foreground">{o.title}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
