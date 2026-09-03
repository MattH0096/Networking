import { Icon } from "@/components/icons/Icon";
import { Container } from "@/components/ui/Container";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { Reveal } from "@/components/ui/Reveal";
import type { SiteContent } from "@/lib/cms/content";

type Props = {
  content: SiteContent["locus"];
};

/**
 * Outcome tiles — Assured Distribution → Impact → Why Customers Choose IST.
 */
export function LocusImpact({ content }: Props) {
  return (
    <section className="section-y bg-ist-surface" aria-labelledby="locus-impact-heading">
      <Container>
        <Reveal variant="expand">
          <header className="mx-auto max-w-3xl text-center">
            <h2 id="locus-impact-heading" className="t-h2 text-balance text-ist-text">
              {content.impactHeading}
            </h2>
          </header>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4 lg:gap-5">
          {content.impact.map((item, i) => (
            <Reveal key={item.title} index={i} variant="rise" className="h-full">
              <FeatureCard
                title={item.title}
                body={item.body}
                icon={<Icon name={item.icon} size={52} />}
                faceClassName="min-h-[18rem]"
              />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
