import type { Metadata } from "next";

import { Applications } from "@/components/home/Applications";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Problem } from "@/components/home/Problem";
import { ProductSpotlight } from "@/components/home/ProductSpotlight";
import { Solution } from "@/components/home/Solution";
import { StackSignal } from "@/components/home/StackSignal";
import { Vision } from "@/components/home/Vision";
import { getSiteContent } from "@/lib/cms/content";
import { PRODUCTS } from "@/lib/home";

export const metadata: Metadata = {
  title: "Every Device. Any Network.",
  description:
    "IST intelligently stores, routes, and delivers information through changing networks until every intended destination receives what it needs.",
};

/** Sections run in the order §9.1 fixes them, alternating bg / surface for rhythm. */
export default async function HomePage() {
  const content = await getSiteContent();
  const home = content.home;
  const [locus, crucible] = PRODUCTS;

  return (
    <>
      <Hero
        line1={home.heroLine1}
        line2={home.heroLine2}
        cta={home.heroCta}
        ctaHref={home.heroCtaHref}
      />
      <Problem content={home} />
      <Solution content={home} />
      <HowItWorks title={home.howItWorksTitle} steps={home.howItWorksSteps} />
      <ProductSpotlight
        {...locus}
        eyebrow={home.locusEyebrow}
        tagline={home.locusTagline}
        body={home.locusBody}
        pull={home.locusPull}
        pullLead={home.locusPullLead}
        alt={home.locusAlt}
        surface="surface"
      />
      <ProductSpotlight
        {...crucible}
        eyebrow={home.crucibleEyebrow}
        tagline={home.crucibleTagline}
        body={home.crucibleBody}
        pull={home.cruciblePull}
        pullLead={home.cruciblePullLead}
        alt={home.crucibleAlt}
        surface="bg"
        flip
      />
      <Applications content={home} />
      <StackSignal title={home.stackTitle} layers={home.stackLayers} />
      <Vision
        copy={{
          lines: [home.visionLine1, home.visionLine2],
          accentLine: home.visionAccent,
          afterLines: [home.visionAfter1, home.visionAfter2],
          primaryCta: home.visionPrimaryCta,
          primaryHref: home.visionPrimaryHref,
          secondaryCta: home.visionSecondaryCta,
          secondaryHref: home.visionSecondaryHref,
        }}
      />
    </>
  );
}
