import type { Metadata } from "next";

import { CareersApplySection } from "@/components/careers/CareersApplySection";
import { CareersCta } from "@/components/careers/CareersCta";
import { CareersHiringBand } from "@/components/careers/CareersHiringBand";
import { CareersHiringLead } from "@/components/careers/CareersHiringLead";
import { CareersHowWeWork } from "@/components/careers/CareersHowWeWork";
import { CareersOpenRoles } from "@/components/careers/CareersOpenRoles";
import { CareersWhyBuild } from "@/components/careers/CareersWhyBuild";
import { PageHero } from "@/components/layout/PageHero";
import { getSiteContent } from "@/lib/cms/content";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return {
    title: "Careers — Build Something That Matters",
    description: content.careers.lead,
  };
}

/**
 * §9.9 — locked hiring line first; culture bands are soft presentation.
 * Open roles come from CMS (`content/overrides.json` → careers.roles).
 */
export default async function CareersPage() {
  const content = await getSiteContent();
  const c = content.careers;

  return (
    <>
      <PageHero
        eyebrow={c.eyebrow}
        title={[c.titleLine1, c.titleLine2]}
        lead={c.lead}
        video="/video/career.mp4"
      />

      <CareersHiringLead />
      <CareersHiringBand />
      <CareersWhyBuild />
      <CareersOpenRoles roles={c.roles} />
      {c.roles.length > 0 ? <CareersApplySection roles={c.roles} /> : null}
      <CareersHowWeWork />
      <CareersCta />
    </>
  );
}
