import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { supabase } from "@/integrations/supabase/client";
import { toggleReportPublic } from "@/lib/research.functions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowLeft, Copy, Printer, ExternalLink, Loader2, Download, Share2, Link as LinkIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/_authenticated/research/$id")({
  head: () => ({ meta: [{ title: "Research report — Lumen" }] }),
  component: ReportPage,
});

type Source = { index: number; title: string; url: string };

function ReportPage() {
  const { id } = Route.useParams();
  const queryClient = useQueryClient();
  const togglePublic = useServerFn(toggleReportPublic);
  const [sharing, setSharing] = useState(false);

  const { data: report, isLoading } = useQuery({
    queryKey: ["report", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("research_reports")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
    refetchInterval: (q) => {
      const r = q.state.data as { status?: string } | undefined;
      return r && (r.status === "researching" || r.status === "synthesizing" || r.status === "pending") ? 3000 : false;
    },
  });

  if (isLoading) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-20 text-center">
        <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
      </main>
    );
  }

  if (!report) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-muted-foreground">Report not found.</p>
        <Button asChild variant="link" className="mt-4">
          <Link to="/dashboard">Back to dashboard</Link>
        </Button>
      </main>
    );
  }

  const isRunning = report.status === "researching" || report.status === "synthesizing" || report.status === "pending";
  const sources = (report.sources as Source[] | null) ?? [];
  // The synthesis prompt asks the model to include a "## Sources" section, but we
  // render a richer interactive list below. Strip the inline one to avoid duplicates.
  const displayContent = (report.content ?? "").replace(
    /\n#{1,6}\s*Sources?\b[\s\S]*$/i,
    "",
  ).trimEnd();

  const handleCopy = () => {
    if (!report.content) return;
    navigator.clipboard.writeText(report.content);
    toast.success("Markdown copied");
  };

  const handleDownload = () => {
    if (!report.content) return;
    const blob = new Blob([report.content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${report.query.slice(0, 60).replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => window.print();

  const handleToggleShare = async () => {
    setSharing(true);
    try {
      const res = await togglePublic({ data: { id: report.id, isPublic: !report.is_public } });
      await queryClient.invalidateQueries({ queryKey: ["report", id] });
      if (res.slug) {
        const link = `${window.location.origin}/r/${res.slug}`;
        await navigator.clipboard.writeText(link).catch(() => {});
        toast.success("Public link copied to clipboard");
      } else {
        toast.success("Report is now private");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Share toggle failed");
    } finally {
      setSharing(false);
    }
  };

  const handleCopyShareLink = async () => {
    if (!report.public_slug) return;
    const link = `${window.location.origin}/r/${report.public_slug}`;
    await navigator.clipboard.writeText(link);
    toast.success("Link copied");
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="print:hidden">
        <Button asChild variant="ghost" size="sm">
          <Link to="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Link>
        </Button>
      </div>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{report.query}</h1>
          <p className="mt-2 text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}
            {report.is_public && <span className="ml-2 text-primary">· Public</span>}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 print:hidden">
          {report.status === "completed" && (
            <>
              <Button variant="outline" size="sm" onClick={handleCopy}>
                <Copy className="mr-2 h-4 w-4" /> Copy
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" /> .md
              </Button>
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" /> PDF
              </Button>
              {report.is_public && report.public_slug && (
                <Button variant="outline" size="sm" onClick={handleCopyShareLink}>
                  <LinkIcon className="mr-2 h-4 w-4" /> Copy link
                </Button>
              )}
              <Button
                variant={report.is_public ? "secondary" : "default"}
                size="sm"
                onClick={handleToggleShare}
                disabled={sharing}
              >
                <Share2 className="mr-2 h-4 w-4" />
                {sharing ? "…" : report.is_public ? "Make private" : "Share"}
              </Button>
            </>
          )}
        </div>
      </div>

      {isRunning && (
        <div className="mt-8 flex items-center gap-3 rounded-lg border border-border bg-card p-6">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <div>
            <p className="font-medium text-card-foreground">
              {report.status === "synthesizing" ? "Writing your report…" : "Searching the web…"}
            </p>
            <p className="text-sm text-muted-foreground">This usually takes 1-2 minutes.</p>
          </div>
        </div>
      )}

      {report.status === "failed" && (
        <div className="mt-8 rounded-lg border border-destructive/50 bg-destructive/10 p-6">
          <p className="font-medium text-destructive">Research failed</p>
          <p className="mt-1 text-sm text-muted-foreground">{report.error ?? "Unknown error"}</p>
        </div>
      )}

      {report.status === "completed" && report.content && (
        <>
          <article className="prose prose-neutral dark:prose-invert mt-8 max-w-none rounded-xl border border-border bg-card p-8 text-foreground [&_a]:text-primary [&_h1]:mt-0 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-foreground [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-foreground [&_li]:my-1 [&_li]:text-foreground [&_p]:my-3 [&_p]:leading-7 [&_p]:text-foreground [&_strong]:text-foreground [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-6">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{displayContent}</ReactMarkdown>
          </article>

          {sources.length > 0 && (
            <section className="mt-8 rounded-xl border border-border bg-card p-6 print:hidden">
              <h2 className="flex items-center gap-2 font-semibold text-card-foreground">
                <Badge variant="secondary">{sources.length}</Badge> Sources
              </h2>
              <ol className="mt-4 space-y-2 text-sm">
                {sources.map((s) => (
                  <li key={s.url} className="flex gap-2">
                    <span className="shrink-0 text-muted-foreground">[{s.index}]</span>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-start gap-1 text-foreground hover:text-primary hover:underline"
                    >
                      <span>{s.title}</span>
                      <ExternalLink className="mt-0.5 h-3 w-3 shrink-0" />
                    </a>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </>
      )}
    </main>
  );
}
