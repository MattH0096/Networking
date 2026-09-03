import { InsightIcon } from "@/components/insights/InsightIcon";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import type { SiteContent } from "@/lib/cms/content";

type FutureItem = SiteContent["insights"]["upcoming"][number];

function TargetMark({ size = 16 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22" />
    </svg>
  );
}

function DocMark() {
  return (
    <span
      aria-hidden="true"
      className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/15 text-ist-muted"
    >
      <InsightIcon name="doc" size={22} />
    </span>
  );
}

function ClockMark() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-ist-accent-bright"
    >
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4.5l3 1.5" />
    </svg>
  );
}

/** Upcoming publications — only rendered when the CMS has real upcoming items. */
export function FuturePublications({
  heading,
  items,
}: {
  heading: string;
  items: FutureItem[];
}) {
  if (items.length === 0) return null;

  return (
    <section className="section-y bg-ist-bg pt-0">
      <Container>
        <Reveal variant="expand">
          <header className="flex items-center gap-2.5">
            <span aria-hidden="true" className="text-ist-accent-bright">
              <TargetMark />
            </span>
            <h2 className="font-mono text-[0.72rem] font-medium uppercase tracking-[0.16em] text-ist-accent-bright">
              {heading}
            </h2>
          </header>

          <ul className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {items.map((item, i) => (
              <Reveal key={item.id} as="li" index={i} step={80} variant="rise">
                <article className="flex h-full flex-col items-center rounded-md border border-ist-line bg-[#0a0a0a] px-6 py-8 text-center sm:px-7 sm:py-9">
                  <DocMark />
                  <h3 className="mt-5 text-[0.98rem] font-semibold tracking-tight text-ist-text sm:text-[1.02rem]">
                    {item.title}
                  </h3>
                  <div aria-hidden="true" className="mt-3 h-px w-10 bg-ist-accent/80" />
                  <p className="mt-3 max-w-[22rem] text-[0.84rem] leading-relaxed text-ist-muted">
                    {item.body}
                  </p>
                  <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 px-3.5 py-1.5 text-[0.75rem] text-ist-text/85">
                    <ClockMark />
                    {item.status}
                  </p>
                </article>
              </Reveal>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
