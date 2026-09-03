import { PaperGate } from "@/components/forms/PaperGate";
import { InsightIcon } from "@/components/insights/InsightIcon";
import { ResearchCover } from "@/components/insights/ResearchCover";
import type { SiteContent } from "@/lib/cms/content";

type Paper = SiteContent["insights"]["papers"][number];

/**
 * Featured research — 30 | 40 | 30.
 */
export function FeaturedResearch({
  paper,
  featuredLabel = "Featured Research",
}: {
  paper: Paper;
  featuredLabel?: string;
}) {
  return (
    <article className="chassis chassis--inert">
      <div className="chassis__viewport p-5 sm:p-6 lg:p-7">
        <p className="flex items-center gap-2 font-mono text-[0.7rem] font-medium uppercase tracking-[0.16em] text-ist-accent-bright">
          <span aria-hidden="true" className="text-[0.55rem]">
            ◆
          </span>
          {featuredLabel}
        </p>

        <div className="mt-5 grid items-stretch gap-5 sm:mt-6 sm:gap-6 lg:grid-cols-[3fr_4fr_3fr] lg:gap-x-6 xl:gap-x-8">
          <ResearchCover paper={paper} coverKey={paper.coverKey} />

          <div className="flex min-w-0 flex-col">
            <p className="font-mono text-[0.68rem] font-medium uppercase tracking-[0.14em] text-ist-accent-bright">
              {paper.series} · {paper.date}
            </p>

            <h2 className="mt-2.5 text-[1.3rem] font-semibold leading-[1.2] tracking-tight text-ist-text sm:text-[1.45rem] lg:text-[1.55rem]">
              {paper.title}
            </h2>

            <p className="mt-3 max-w-[38rem] text-[0.9rem] leading-[1.55] text-ist-muted">
              {paper.summary}
            </p>

            <ul className="mt-4 flex flex-wrap gap-1.5">
              {paper.tags.map((tag) => (
                <li
                  key={tag}
                  className="border border-white/20 px-2.5 py-1 text-[0.7rem] tracking-wide text-ist-text/85"
                >
                  {tag}
                </li>
              ))}
            </ul>

            <div className="min-h-4 flex-1" aria-hidden="true" />

            <ul className="flex flex-wrap gap-x-4 gap-y-2 border-t border-ist-line pt-3.5">
              {paper.signals.map((signal) => (
                <li
                  key={signal.label}
                  className="inline-flex items-center gap-1.5 text-[0.75rem] text-ist-muted"
                >
                  <span className="text-ist-accent-bright">
                    <InsightIcon name={signal.icon} size={13} />
                  </span>
                  {signal.label}
                </li>
              ))}
            </ul>
          </div>

          {paper.gated ? (
            <PaperGate slug={paper.slug} title={paper.title} compact fillHeight />
          ) : (
            <div className="flex items-end text-[0.85rem] text-ist-muted">
              Available without gate.
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
