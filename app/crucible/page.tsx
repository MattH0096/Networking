import type { Metadata } from "next";

import { CrucibleFlow } from "@/components/crucible/CrucibleFlow";
import { CrucibleFuture } from "@/components/crucible/CrucibleFuture";
import { CrucibleQuestions } from "@/components/crucible/CrucibleQuestions";
import { PageHero } from "@/components/layout/PageHero";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { getSiteContent } from "@/lib/cms/content";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return {
    title: "Crucible — Simulate. Validate. Deploy with Confidence.",
    description: content.crucible.lead,
  };
}

export default async function CruciblePage() {
  const content = await getSiteContent();
  const c = content.crucible;

  return (
    <>
      <PageHero
        eyebrow={c.eyebrow}
        title={[c.titleLine1, c.titleLine2]}
        leadIntro={c.leadIntro}
        lead={c.lead}
        video="/video/Crucible_Simulate_Validate.mp4"
      />

      <CrucibleFlow content={c} />

      <CrucibleQuestions content={c} />

      <CrucibleFuture content={c} />

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
