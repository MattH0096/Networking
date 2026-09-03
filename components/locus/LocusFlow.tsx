import { Fragment } from "react";

import { Container } from "@/components/ui/Container";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { PullQuote } from "@/components/ui/PullQuote";
import { Reveal } from "@/components/ui/Reveal";
import type { SiteContent } from "@/lib/cms/content";
import { cn } from "@/lib/cn";

type Props = {
  content: SiteContent["locus"];
};

function FlowChevron({ direction }: { direction: "right" | "down" }) {
  return (
    <span aria-hidden="true" className="inline-flex text-ist-accent-bright">
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
        {direction === "right" ? (
          <path
            d="M9 5l7 7-7 7"
            stroke="currentColor"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <path
            d="M5 9l7 7 7-7"
            stroke="currentColor"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </span>
  );
}

/**
 * How Locus Works — numbered FeatureCard steps.
 */
export function LocusFlow({ content }: Props) {
  return (
    <section className="section-y bg-ist-bg">
      <Container>
        <Reveal variant="expand">
          <header className="text-center">
            <h2 className="t-h2 text-balance text-ist-text">{content.flowHeading}</h2>
          </header>
        </Reveal>

        <ol
          className={cn(
            "mt-10 grid list-none grid-cols-1 gap-4 p-0 sm:mt-10",
            "sm:grid-cols-2 sm:gap-5",
            "xl:flex xl:items-stretch xl:gap-2",
          )}
        >
          {content.flow.map((step, i) => {
            const n = i + 1;
            const isLast = i === content.flow.length - 1;

            return (
              <Fragment key={step.key}>
                <li className="flex min-w-0 flex-col xl:min-w-0 xl:flex-1">
                  <Reveal index={i} variant="rise" className="flex h-full flex-1 flex-col">
                    <FeatureCard
                      index={n}
                      eyebrow={step.key.toUpperCase()}
                      title={step.title}
                      body={step.body}
                    />
                  </Reveal>

                  {!isLast ? (
                    <div aria-hidden="true" className="flex justify-center py-2 sm:hidden">
                      <FlowChevron direction="down" />
                    </div>
                  ) : null}
                </li>

                {!isLast ? (
                  <li
                    aria-hidden="true"
                    className="hidden w-7 shrink-0 items-center justify-center xl:flex"
                  >
                    <FlowChevron direction="right" />
                  </li>
                ) : null}
              </Fragment>
            );
          })}
        </ol>

        <Reveal className="mt-10 lg:mt-12" variant="expand">
          <PullQuote lead={content.pullLead} line={content.pullLine} />
        </Reveal>
      </Container>
    </section>
  );
}
