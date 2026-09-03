import type { Metadata } from "next";

import { PageHero } from "@/components/layout/PageHero";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { LocusDistribution } from "@/components/locus/LocusDistribution";
import { LocusFlow } from "@/components/locus/LocusFlow";
import { LocusImpact } from "@/components/locus/LocusImpact";
import { LocusWhyChoose } from "@/components/locus/LocusWhyChoose";
import { getSiteContent } from "@/lib/cms/content";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return {
    title: "Locus — Assured Distribution for the Real World",
    description: content.locus.lead,
  };
}

export default async function LocusPage() {
  const content = await getSiteContent();
  const c = content.locus;

  return (
    <>
      <PageHero
        eyebrow={c.eyebrow}
        title={[c.titleLine1, c.titleLine2]}
        lead={c.lead}
        video="/video/Locus_Assured_Distribution_fo.mp4"
      />

      <LocusFlow content={c} />

      <LocusDistribution content={c} />

      <LocusImpact content={c} />

      <LocusWhyChoose content={c} />

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
