import { ContactPillarIcon } from "@/components/contact/ContactIcons";
import { FeatureCard } from "@/components/ui/FeatureCard";
import type { SiteContent } from "@/lib/cms/content";
import { CONTACT_PILLARS } from "@/lib/contact";

type Pillar = SiteContent["contact"]["pillars"][number];

type Props = {
  pillars?: Pillar[];
};

/**
 * Four contact values — separate FeatureCards.
 */
export function ContactPillars({ pillars = [...CONTACT_PILLARS] }: Props) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
      {pillars.map((pillar) => (
        <li key={pillar.id} className="min-w-0">
          <FeatureCard
            title={pillar.title}
            body={pillar.body}
            align="center"
            icon={<ContactPillarIcon name={pillar.icon} size={52} />}
          />
        </li>
      ))}
    </ul>
  );
}
