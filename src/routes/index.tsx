import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { ArrowRight, Globe, FileText, Zap, Shield, Search, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lumen Research — AI-powered deep research platform" },
      { name: "description", content: "Ask any research question. Lumen searches the live web, reads dozens of sources, and writes you a structured, cited report in minutes." },
      { property: "og:title", content: "Lumen Research" },
      { property: "og:description", content: "AI-powered deep research with live web sources and cited reports." },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--color-primary)/0.08,_transparent_50%)]" />
          <div className="mx-auto max-w-5xl px-4 py-24 text-center sm:py-32">
            <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Powered by frontier AI and live web search
            </div>
            <h1 className="mx-auto max-w-3xl text-balance text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              Deep research, on demand. With sources you can verify.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-muted-foreground">
              Ask any question. Lumen runs multi-query searches across the live web, reads
              the results, and synthesizes a structured, fully-cited report — in minutes,
              not hours.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" asChild>
                <Link to="/signup">
                  Start researching free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/pricing">View pricing</Link>
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              No credit card required · 5 reports/month on Free
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-20">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Built for serious research
              </h2>
              <p className="mt-4 text-muted-foreground">
                Not a chatbot. A structured pipeline that searches, reads, and synthesizes
                — with every claim traced back to a source.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: Search,
                  title: "Multi-query web search",
                  body: "Each question fans out into multiple targeted searches across the live internet, not stale training data.",
                },
                {
                  icon: Globe,
                  title: "Real, cited sources",
                  body: "Every report links back to the URLs it was built from. No hallucinated references.",
                },
                {
                  icon: Sparkles,
                  title: "Frontier AI synthesis",
                  body: "Sources are read and synthesized by Gemini and GPT models into a structured, readable report.",
                },
                {
                  icon: FileText,
                  title: "Export-ready",
                  body: "Copy as Markdown or export to PDF. Drop straight into Notion, Docs, or a client deck.",
                },
                {
                  icon: Zap,
                  title: "Minutes, not hours",
                  body: "A typical report completes in under two minutes. Iterate on questions as fast as you can ask them.",
                },
                {
                  icon: Shield,
                  title: "Private by default",
                  body: "Your reports are yours. End-to-end auth, row-level security, no training on your data.",
                },
              ].map((f) => (
                <div key={f.title} className="rounded-lg border border-border bg-card p-6">
                  <f.icon className="h-6 w-6 text-primary" />
                  <h3 className="mt-4 font-semibold text-card-foreground">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section>
          <div className="mx-auto max-w-4xl px-4 py-24 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Your next research report is one question away.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Free to start. Upgrade when you need more.
            </p>
            <div className="mt-8">
              <Button size="lg" asChild>
                <Link to="/signup">
                  Create your account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-6xl px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Lumen Research. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
