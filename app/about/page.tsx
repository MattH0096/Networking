import type { Metadata } from "next";

import { AboutHowWeBuild } from "@/components/about/AboutHowWeBuild";
import { AboutMissionVision } from "@/components/about/AboutMissionVision";
import { AboutStatement } from "@/components/about/AboutStatement";
import { PageHero } from "@/components/layout/PageHero";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { getSiteContent } from "@/lib/cms/content";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return {
    title: `About — ${content.about.title}`,
    description: content.about.lead,
  };
}

/**
 * §9.6. Deliberately contains no founder name, biography, employer history or
 * headshot, and no counted metrics of any kind.
 */
export default async function AboutPage() {
  const content = await getSiteContent();
  const c = content.about;

  return (
    <>
      <PageHero
        eyebrow={c.eyebrow}
        title={c.title}
        lead={c.lead}
        video={["/video/about-1.mp4", "/video/about-2.mp4"]}
      />

      <AboutStatement content={c} />
      <AboutMissionVision content={c} />
      <AboutHowWeBuild content={c} />
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
