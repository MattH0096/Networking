import type { Metadata } from "next";

import { FeaturedResearch } from "@/components/insights/FeaturedResearch";
import { FuturePublications } from "@/components/insights/FuturePublications";
import { InsightsSubscribe } from "@/components/insights/InsightsSubscribe";
import { PageHero } from "@/components/layout/PageHero";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { getSiteContent } from "@/lib/cms/content";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return {
    title: "Insights",
    description: content.insights.intro,
  };
}

export default async function InsightsPage() {
  const content = await getSiteContent();
  const c = content.insights;

  return (
    <>
      <PageHero
        eyebrow={c.eyebrow}
        title={c.title}
        lead={c.intro}
        image="insights-hero"
        alt={c.heroAlt}
        mobileFocus="right"
      />

      {c.papers.length > 0 ? (
        <section className="section-y bg-ist-bg">
          <Container>
            <div className="flex flex-col gap-10">
              {c.papers.map((paper, i) => (
                <Reveal key={paper.id || paper.slug} index={i} variant="expand">
                  <FeaturedResearch
                    paper={paper}
                    featuredLabel={i === 0 ? c.featuredLabel : "Research"}
                  />
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {c.upcoming.length > 0 ? (
        <FuturePublications heading={c.upcomingHeading} items={c.upcoming} />
      ) : null}

      <InsightsSubscribe
        heading={c.subscribeHeading}
        lead={c.subscribeLead}
        cta={c.subscribeCta}
        note={c.subscribeNote}
        successTitle={c.subscribeSuccessTitle}
        successBody={c.subscribeSuccessBody}
      />
      <ClosingCta
        copy={{
          lines: [c.visionLine1, c.visionLine2],
          accentLine: c.visionAccent,
          afterLines: [c.visionAfter1, c.visionAfter2],
          primaryCta: c.visionPrimaryCta,
          primaryHref: c.visionPrimaryHref,
          secondaryCta: c.visionSecondaryCta,
          secondaryHref: c.visionSecondaryHref,
        }}
      />
    </>
  );
}
