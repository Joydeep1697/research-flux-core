import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { startResearch, deleteReport } from "@/lib/research.functions";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Search, Trash2, FileText, Sparkles, Zap, Layers, Telescope } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type Depth = "quick" | "standard" | "deep";

const DEPTH_OPTIONS: Array<{ value: Depth; label: string; desc: string; icon: typeof Zap }> = [
  { value: "quick", label: "Quick", desc: "~30s · 3 queries · ~12 sources", icon: Zap },
  { value: "standard", label: "Standard", desc: "~2 min · 5+3 queries · ~22 sources", icon: Layers },
  { value: "deep", label: "Deep", desc: "~4 min · 7+8 queries · ~35 sources · Pro", icon: Telescope },
];

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Lumen Research" }] }),
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const runResearch = useServerFn(startResearch);
  const removeReport = useServerFn(deleteReport);
  const [query, setQuery] = useState("");
  const [depth, setDepth] = useState<Depth>("standard");
  const [submitting, setSubmitting] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "running" | "failed">("all");

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ["reports", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("research_reports")
        .select("id, query, status, created_at, completed_at, error, is_public")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!user,
    refetchInterval: (q) => {
      const rows = q.state.data as Array<{ status: string }> | undefined;
      return rows?.some((r) => r.status === "researching" || r.status === "pending" || r.status === "synthesizing") ? 3000 : false;
    },
  });

  const { data: subscription } = useQuery({
    queryKey: ["subscription", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("plan, status")
        .maybeSingle();
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!user,
  });

  const plan = subscription?.plan ?? "free";

  const { data: usageCount = 0 } = useQuery({
    queryKey: ["reports-usage", user?.id, plan],
    queryFn: async () => {
      const windowStart = new Date();
      if (plan === "free") {
        windowStart.setUTCHours(0, 0, 0, 0);
      } else {
        windowStart.setUTCDate(1);
        windowStart.setUTCHours(0, 0, 0, 0);
      }
      const { count, error } = await supabase
        .from("research_reports")
        .select("id", { count: "exact", head: true })
        .gte("created_at", windowStart.toISOString());
      if (error) throw new Error(error.message);
      return count ?? 0;
    },
    enabled: !!user,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length < 8) {
      toast.error("Please ask a more specific question (at least 8 characters).");
      return;
    }
    setSubmitting(true);
    try {
      const result = await runResearch({ data: { query: query.trim(), depth } });
      setQuery("");
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      navigate({ to: "/research/$id", params: { id: result.id } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Research failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this report?")) return;
    try {
      await removeReport({ data: { id } });
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      toast.success("Report deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const quota = plan === "enterprise" ? 10000 : plan === "pro" ? 100 : 5;
  const usagePct = Math.min(100, Math.round((usageCount / quota) * 100));
  const periodLabel = plan === "free" ? "Today" : "This month";

  const filteredReports = reports.filter((r) => {
    if (statusFilter === "completed" && r.status !== "completed") return false;
    if (statusFilter === "failed" && r.status !== "failed") return false;
    if (
      statusFilter === "running" &&
      !["pending", "researching", "synthesizing"].includes(r.status)
    )
      return false;
    if (searchTerm && !r.query.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Your research</h1>
          <p className="mt-1 text-sm text-muted-foreground">Ask a question. Get a cited report.</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge variant="secondary" className="capitalize">{plan} plan</Badge>
          <div className="w-48">
            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <span>{periodLabel}</span>
              <span>{usageCount} / {quota === 10000 ? "∞" : quota}</span>
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full transition-all ${usagePct >= 90 ? "bg-destructive" : "bg-primary"}`}
                style={{ width: `${usagePct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 rounded-xl border border-border bg-card p-6 shadow-sm">
        <label className="flex items-center gap-2 text-sm font-medium text-card-foreground">
          <Sparkles className="h-4 w-4 text-primary" />
          New research question
        </label>
        <Textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. What are the latest advancements in solid-state batteries for EVs, and which companies lead?"
          rows={3}
          className="mt-3 resize-none"
          disabled={submitting}
        />
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
          {DEPTH_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const selected = depth === opt.value;
            const locked = opt.value === "deep" && plan === "free";
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => !locked && setDepth(opt.value)}
                disabled={submitting || locked}
                className={`flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition-colors ${
                  selected
                    ? "border-primary bg-primary/5"
                    : "border-border bg-background hover:border-primary/40"
                } ${locked ? "cursor-not-allowed opacity-60" : ""}`}
                aria-pressed={selected}
              >
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Icon className={`h-4 w-4 ${selected ? "text-primary" : "text-muted-foreground"}`} />
                  {opt.label}
                  {locked && <span className="ml-auto text-[10px] font-normal text-muted-foreground">Pro</span>}
                </div>
                <p className="text-xs text-muted-foreground">{opt.desc}</p>
              </button>
            );
          })}
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            Lumen plans queries, fans out web searches, audits gaps, and writes a cited Markdown report.
          </p>
          <Button type="submit" disabled={submitting || !query.trim()}>
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Researching…
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" /> Start research
              </>
            )}
          </Button>
        </div>
      </form>

      <div className="mt-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-foreground">History</h2>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search reports…"
                className="h-8 w-56 rounded-md border border-input bg-background pl-8 pr-3 text-sm outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            {(["all", "completed", "running", "failed"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(s)}
                className={`h-8 rounded-md border px-3 text-xs capitalize transition-colors ${
                  statusFilter === s
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-background text-muted-foreground hover:text-foreground"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        {isLoading ? (
          <p className="mt-4 text-sm text-muted-foreground">Loading…</p>
        ) : filteredReports.length === 0 ? (
          <div className="mt-6 rounded-lg border border-dashed border-border p-12 text-center">
            <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-4 text-sm text-muted-foreground">
              {reports.length === 0 ? "No reports yet. Run your first research above." : "No reports match your filters."}
            </p>
          </div>
        ) : (
          <ul className="mt-4 space-y-2">
            {filteredReports.map((r) => (
              <li key={r.id} className="group flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/40">
                <Link to="/research/$id" params={{ id: r.id }} className="min-w-0 flex-1">
                  <p className="truncate font-medium text-card-foreground">{r.query}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(r.created_at), { addSuffix: true })}
                  </p>
                </Link>
                {r.is_public && <Badge variant="outline" className="text-[10px]">Public</Badge>}
                <StatusBadge status={r.status} />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(r.id)}
                  className="opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label="Delete report"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "completed") return <Badge variant="default">Completed</Badge>;
  if (status === "failed") return <Badge variant="destructive">Failed</Badge>;
  return (
    <Badge variant="secondary" className="gap-1">
      <Loader2 className="h-3 w-3 animate-spin" />
      {status === "synthesizing" ? "Writing" : "Searching"}
    </Badge>
  );
}
