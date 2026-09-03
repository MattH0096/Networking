import { SolutionsStackIcon } from "@/components/solutions/SolutionsStackIcons";
import { Container } from "@/components/ui/Container";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { Reveal } from "@/components/ui/Reveal";
import type { SiteContent } from "@/lib/cms/content";

type Props = {
  content: SiteContent["solutions"];
};

/**
 * Full-stack approach — four FeatureCards matching sitewide card chrome.
 */
export function SolutionsFullStack({ content }: Props) {
  return (
    <section className="section-y bg-ist-bg">
      <Container>
        <Reveal variant="expand">
          <header className="mx-auto max-w-3xl text-center">
            <p className="font-mono text-[0.72rem] font-medium uppercase tracking-[0.16em] text-ist-accent-bright">
              {content.fullStackEyebrow}
            </p>
            <h2 className="t-h2 mt-3 text-balance text-ist-text">{content.fullStackTitle}</h2>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-ist-muted sm:text-[1.05rem]">
              {content.fullStackLead}
            </p>
          </header>
        </Reveal>

        <ul className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {content.fullStackItems.map((item, index) => (
            <Reveal key={item.id} as="li" index={index} step={100} variant="rise" className="h-full min-w-0">
              <FeatureCard
                index={String(index + 1).padStart(2, "0")}
                title={item.title}
                body={item.body}
                align="center"
                icon={<SolutionsStackIcon name={item.icon} size={52} />}
                faceClassName="min-h-[16rem]"
              />
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
