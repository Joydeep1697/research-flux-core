import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Lock, Database, Eye, Trash2, FileSearch, Server } from "lucide-react";

export const Route = createFileRoute("/security")({
  head: () => ({
    meta: [
      { title: "Security & Privacy — Lumen Research" },
      { name: "description", content: "How Lumen protects your data: encryption in transit, row-level security, no training on customer reports, and clear retention policies." },
      { property: "og:title", content: "Security & Privacy — Lumen Research" },
      { property: "og:description", content: "Encryption, row-level security, no training on customer data, audit logs, and clear retention." },
      { property: "og:url", content: "https://research-flux-core.lovable.app/security" },
    ],
    links: [{ rel: "canonical", href: "https://research-flux-core.lovable.app/security" }],
  }),
  component: SecurityPage,
});

const PILLARS = [
  { icon: Lock, title: "Encryption in transit", body: "All traffic to and from Lumen is served over TLS. Database connections inside our infrastructure are encrypted." },
  { icon: ShieldCheck, title: "Row-level security", body: "Every table holding user data is protected by row-level security policies — you can only read and write your own rows. Enforced at the database layer." },
  { icon: Eye, title: "No training on your data", body: "Your research questions, reports, and saved history are never used to train AI models. Period." },
  { icon: Database, title: "Source transparency", body: "Every claim in every report links to a real source URL. Sources are ranked by retrieval relevance, not by paid promotion." },
  { icon: FileSearch, title: "Audit logs", body: "Sensitive events — sign-in, plan changes, public-share toggles, deletions — are recorded in an append-only audit log accessible to workspace admins." },
  { icon: Trash2, title: "Retention & deletion", body: "You can delete any report at any time. Deleted reports are removed from primary storage immediately and from backups within 30 days." },
];

function SecurityPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-16">
        <div className="text-center">
          <Badge variant="secondary" className="mb-4">Trust & security</Badge>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Security & privacy
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Your research is yours. Here's exactly how Lumen protects it.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {PILLARS.map((p) => (
            <div key={p.title} className="rounded-xl border border-border bg-card p-6">
              <p.icon className="h-6 w-6 text-primary" />
              <h2 className="mt-3 font-semibold text-card-foreground">{p.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>

        <section className="mt-12 rounded-xl border border-border bg-card p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-card-foreground">
            <Server className="h-5 w-5 text-primary" /> Infrastructure
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>• Application hosted on Cloudflare's global edge network with automatic failover.</li>
            <li>• Database on managed Postgres with point-in-time recovery and daily backups.</li>
            <li>• Authentication backed by industry-standard JWTs; sessions auto-rotate.</li>
            <li>• Secrets stored in encrypted secret storage and only injected into server runtime.</li>
          </ul>
        </section>

        <section className="mt-8 rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-card-foreground">How sources are selected and ranked</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Lumen uses Tavily's advanced web search to retrieve candidate sources for each
            sub-query. Results are deduplicated by URL and ranked by retrieval relevance
            scores. During synthesis, the AI is instructed to cite every non-trivial claim
            and to surface conflicts between sources rather than averaging them away. Lumen
            does not accept paid placement in source rankings.
          </p>
        </section>

        <section className="mt-8 rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-card-foreground">Data retention</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>• <strong className="text-foreground">Reports</strong>: kept until you delete them.</li>
            <li>• <strong className="text-foreground">Audit logs</strong>: retained for 12 months.</li>
            <li>• <strong className="text-foreground">Backups</strong>: rolled forward 30 days, then purged.</li>
            <li>• <strong className="text-foreground">Account deletion</strong>: contact support and all associated data is purged within 7 days.</li>
          </ul>
        </section>

        <section className="mt-8 rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-card-foreground">Reporting a vulnerability</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Found a security issue? Please disclose responsibly by emailing{" "}
            <a href="mailto:security@lumen.research" className="text-primary hover:underline">security@lumen.research</a>.
            We acknowledge within 2 business days.
          </p>
        </section>
      </main>
    </div>
  );
}
