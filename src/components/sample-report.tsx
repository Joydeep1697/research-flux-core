import { useMemo, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ExternalLink, ShieldCheck } from "lucide-react";
import type { SampleReport, SampleSource } from "@/lib/sample-reports";

function confidenceTone(c: SampleSource["confidence"]) {
  if (c === "high") return "text-emerald-500";
  if (c === "medium") return "text-amber-500";
  return "text-muted-foreground";
}

/** Render markdown body and replace [N] tokens with hover-card citations. */
function CitedMarkdown({
  body,
  sources,
}: {
  body: string;
  sources: SampleSource[];
}) {
  // Split the rendered text nodes so [N] becomes an interactive element.
  const sourceMap = useMemo(() => new Map(sources.map((s) => [s.index, s])), [sources]);

  const renderText = (text: string): ReactNode => {
    const parts: ReactNode[] = [];
    const regex = /\[(\d+)\]/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    let key = 0;
    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
      const idx = Number(match[1]);
      const src = sourceMap.get(idx);
      if (src) {
        parts.push(
          <HoverCard key={`c-${key++}`} openDelay={80} closeDelay={50}>
            <HoverCardTrigger asChild>
              <a
                href={`#source-${idx}`}
                className="mx-0.5 inline-flex items-baseline rounded bg-primary/10 px-1.5 text-[0.7em] font-semibold text-primary no-underline hover:bg-primary/20"
              >
                {idx}
              </a>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-muted-foreground">
                    {src.publisher}
                  </span>
                  <span className={`flex items-center gap-1 text-xs ${confidenceTone(src.confidence)}`}>
                    <ShieldCheck className="h-3 w-3" />
                    {src.confidence}
                  </span>
                </div>
                <p className="text-sm font-medium text-foreground">{src.title}</p>
                <p className="text-xs text-muted-foreground">{src.excerpt}</p>
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  Open source <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </HoverCardContent>
          </HoverCard>,
        );
      } else {
        parts.push(match[0]);
      }
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) parts.push(text.slice(lastIndex));
    return parts;
  };

  const transformChildren = (children: ReactNode): ReactNode => {
    if (typeof children === "string") return renderText(children);
    if (Array.isArray(children)) return children.map((c, i) => <span key={i}>{transformChildren(c)}</span>);
    return children;
  };

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => <p>{transformChildren(children)}</p>,
        li: ({ children }) => <li>{transformChildren(children)}</li>,
        strong: ({ children }) => <strong>{transformChildren(children)}</strong>,
      }}
    >
      {body}
    </ReactMarkdown>
  );
}

export function SampleReportView({
  report,
  defaultCollapsedAfter = 1,
}: {
  report: SampleReport;
  /** Sections beyond this index start collapsed. Set to Infinity to keep all open. */
  defaultCollapsedAfter?: number;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <Badge variant="secondary">{report.industry}</Badge>
        <span className="text-muted-foreground">{report.readMinutes} min read</span>
        <span className="text-muted-foreground">·</span>
        <span className="text-muted-foreground">{report.sources.length} sources</span>
      </div>
      <h2 className="mt-3 text-2xl font-bold tracking-tight text-card-foreground sm:text-3xl">
        {report.title}
      </h2>
      <p className="mt-2 text-sm italic text-muted-foreground">"{report.query}"</p>

      <div className="prose prose-neutral dark:prose-invert mt-6 max-w-none [&_a]:text-primary [&_li]:my-1 [&_p]:my-3 [&_p]:leading-7 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6">
        <h3 className="text-base font-semibold uppercase tracking-wide text-muted-foreground">
          Executive Summary
        </h3>
        <ul>
          {report.summary.map((s, i) => (
            <li key={i}>
              <CitedMarkdown body={s} sources={report.sources} />
            </li>
          ))}
        </ul>

        <h3 className="text-base font-semibold uppercase tracking-wide text-muted-foreground">
          Key Findings
        </h3>
        <ul>
          {report.findings.map((s, i) => (
            <li key={i}>
              <CitedMarkdown body={s} sources={report.sources} />
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 space-y-3">
        {report.sections.map((section, i) => (
          <Collapsible key={section.heading} defaultOpen={i < defaultCollapsedAfter}>
            <CollapsibleTrigger className="group flex w-full items-center justify-between rounded-lg border border-border bg-background px-4 py-3 text-left hover:bg-accent/40">
              <span className="font-semibold text-foreground">{section.heading}</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="prose prose-neutral dark:prose-invert max-w-none rounded-b-lg border-x border-b border-border bg-background/60 px-4 py-4 [&_a]:text-primary [&_li]:my-1 [&_p]:my-3 [&_p]:leading-7 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6 [&_strong]:text-foreground">
                <CitedMarkdown body={section.body} sources={report.sources} />
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>

      {report.openQuestions.length > 0 && (
        <div className="mt-6 rounded-lg border border-border bg-background/60 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Open Questions
          </h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-foreground">
            {report.openQuestions.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8">
        <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Sources <Badge variant="secondary">{report.sources.length}</Badge>
        </h3>
        <ol className="mt-3 space-y-2 text-sm">
          {report.sources.map((s) => (
            <li
              key={s.index}
              id={`source-${s.index}`}
              className="flex gap-2 rounded-md border border-transparent px-2 py-1 target:border-primary target:bg-primary/5"
            >
              <span className="shrink-0 text-muted-foreground">[{s.index}]</span>
              <div className="min-w-0 flex-1">
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-baseline gap-1 text-foreground hover:text-primary hover:underline"
                >
                  <span>{s.title}</span>
                  <ExternalLink className="h-3 w-3 shrink-0 self-center" />
                </a>
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span>{s.publisher}</span>
                  <span>·</span>
                  <span className={confidenceTone(s.confidence)}>
                    {s.confidence} confidence
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
