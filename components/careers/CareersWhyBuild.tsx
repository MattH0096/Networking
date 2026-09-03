import {
  CareersAtomIcon,
  CareersCompassIcon,
  CareersGlobeIcon,
  CareersNodesIcon,
  CareersPeopleIcon,
} from "@/components/careers/CareersIcons";
import { Container } from "@/components/ui/Container";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { Reveal } from "@/components/ui/Reveal";
import { WHY_BUILD } from "@/lib/careers";

function WhyIcon({ name }: { name: (typeof WHY_BUILD.items)[number]["icon"] }) {
  switch (name) {
    case "atom":
      return <CareersAtomIcon size={52} />;
    case "nodes":
      return <CareersNodesIcon size={52} />;
    case "people":
      return <CareersPeopleIcon size={52} />;
    case "compass":
      return <CareersCompassIcon size={52} />;
    case "globe":
      return <CareersGlobeIcon size={52} />;
  }
}

/**
 * Five “Why Build at IST” FeatureCards.
 */
export function CareersWhyBuild() {
  return (
    <section className="section-y bg-ist-bg">
      <Container>
        <Reveal>
          <h2 className="text-center text-[1.75rem] font-semibold tracking-tight text-ist-text sm:text-[2rem]">
            {WHY_BUILD.title}
          </h2>
        </Reveal>

        <ul className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
          {WHY_BUILD.items.map((item, index) => (
            <Reveal as="li" key={item.id} index={index % 3} className="h-full min-w-0">
              <FeatureCard
                title={item.title}
                body={item.body}
                align="center"
                icon={<WhyIcon name={item.icon} />}
              />
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
