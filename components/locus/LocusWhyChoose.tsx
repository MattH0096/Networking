import { Icon } from "@/components/icons/Icon";
import { Container } from "@/components/ui/Container";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { Reveal } from "@/components/ui/Reveal";
import type { SiteContent } from "@/lib/cms/content";

type Props = {
  content: SiteContent["locus"];
};

/**
 * Capabilities + Why — shared FeatureCard chassis grid.
 */
export function LocusWhyChoose({ content }: Props) {
  return (
    <section className="section-y bg-ist-bg">
      <Container>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {content.features.map((item, i) => (
            <Reveal key={item.title} index={i} variant="rise" className="h-full">
              <FeatureCard
                title={item.title}
                body={item.body}
                icon={<Icon name={item.icon} size={52} />}
                faceClassName="min-h-[15.5rem]"
              />
            </Reveal>
          ))}
        </div>

        <Reveal variant="expand" className="py-10 text-center sm:py-12">
          <h2 className="t-h2 text-balance text-ist-text">{content.whyHeading}</h2>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {content.why.map((item, i) => (
            <Reveal key={item.title} index={i} variant="rise" className="h-full">
              <FeatureCard
                title={item.title}
                body={item.body}
                align="center"
                icon={<Icon name={item.icon} size={52} />}
                faceClassName="min-h-[15.5rem]"
              />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
