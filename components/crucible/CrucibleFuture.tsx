import { Container } from "@/components/ui/Container";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { Reveal } from "@/components/ui/Reveal";
import type { SiteContent } from "@/lib/cms/content";

type Props = {
  content: SiteContent["crucible"];
};

type PillarKey = SiteContent["crucible"]["pillars"][number]["key"];

/**
 * Premium square marks sized for the FeatureCard icon plate.
 */
function PillarArt({ name }: { name: PillarKey }) {
  const common = {
    viewBox: "0 0 48 48",
    width: 52,
    height: 52,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  if (name === "plugins") {
    return (
      <svg {...common}>
        <rect x="16" y="16" width="16" height="16" rx="2" />
        <path d="M22 16V9.5M26 16V9.5M22 38.5V32M26 38.5V32M16 22H9.5M16 26H9.5M38.5 22H32M38.5 26H32" />
        <rect x="19.5" y="5.5" width="9" height="5.5" rx="1.2" />
        <rect x="19.5" y="37" width="9" height="5.5" rx="1.2" />
        <rect x="5.5" y="19.5" width="5.5" height="9" rx="1.2" />
        <rect x="37" y="19.5" width="5.5" height="9" rx="1.2" />
        <circle cx="24" cy="24" r="2.2" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (name === "profiles") {
    return (
      <svg {...common}>
        <rect x="9" y="8" width="30" height="32" rx="2.5" />
        <path d="M15 18h14M15 25h10M15 32h16" />
        <circle cx="33" cy="18" r="2.1" fill="currentColor" stroke="none" />
        <circle cx="29" cy="25" r="2.1" fill="currentColor" stroke="none" />
        <circle cx="35" cy="32" r="2.1" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (name === "terrain") {
    return (
      <svg {...common}>
        <path d="M6 36 16 18l7 10 6-14 13 22H6Z" />
        <path d="M16 18v18M23 28v8M29 14v22" opacity="0.45" />
        <path d="M8 36h32" />
        <circle cx="29" cy="14" r="1.8" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (name === "assets") {
    return (
      <svg {...common}>
        {/* ground vehicle */}
        <path d="M7 22h5l2.5-4h8l2.5 4h5v5H7z" />
        <circle cx="13" cy="28" r="2.2" />
        <circle cx="25" cy="28" r="2.2" />
        {/* drone */}
        <ellipse cx="36" cy="12" rx="6" ry="2.8" />
        <path d="M28 12h3M41 12h3M30 7.5l-2.5-2.5M42 7.5l2.5-2.5M30 16.5l-2.5 2.5M42 16.5l2.5 2.5" />
        {/* armored */}
        <path d="M10 38h6l2.5-5h10l2.5 5h5l-3.5 5H13.5z" />
        <circle cx="36" cy="12" r="1.4" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  /* distribution algorithms */
  return (
    <svg {...common}>
      <circle cx="24" cy="24" r="4.2" />
      <circle cx="24" cy="24" r="1.8" fill="currentColor" stroke="none" />
      <circle cx="10" cy="12" r="3.2" />
      <circle cx="38" cy="12" r="3.2" />
      <circle cx="10" cy="36" r="3.2" />
      <circle cx="38" cy="36" r="3.2" />
      <path d="M12.6 14.2 20.4 21.2M35.4 14.2 27.6 21.2M12.6 33.8 20.4 26.8M35.4 33.8 27.6 26.8" />
    </svg>
  );
}

/**
 * Future extensibility — vision pillars on shared FeatureCard chrome.
 */
export function CrucibleFuture({ content }: Props) {
  return (
    <section className="section-y bg-ist-bg">
      <Container>
        <Reveal variant="expand" className="mx-auto max-w-4xl text-center">
          <p className="t-tag text-ist-dim">{content.futureTag}</p>
          <p className="mt-5 text-[1.05rem] font-medium text-ist-muted sm:text-[1.15rem]">
            {content.futureEyebrow}
          </p>
          <h2 className="t-h2 mt-2 text-balance text-ist-text">{content.futureHeading}</h2>
        </Reveal>

        <ul className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
          {content.pillars.map((pillar, i) => (
            <Reveal
              key={pillar.key}
              as="li"
              index={i}
              step={100}
              variant="rise"
              className="h-full"
            >
              <FeatureCard
                title={pillar.title}
                body={pillar.body}
                align="center"
                standby
                icon={<PillarArt name={pillar.key} />}
              />
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
