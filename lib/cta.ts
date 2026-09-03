import { CTA } from "@/lib/site";

export type PageCtaCopy = {
  /** White lines above the accent (homepage-style). */
  lines?: readonly string[];
  /** Accent line, or used as heading when `lines` is omitted. */
  accentLine?: string;
  /** Locked closer lines after the accent (homepage vision). */
  afterLines?: readonly string[];
  /** Alternate: heading + lead instead of vision lines. */
  heading?: string;
  lead?: string;
  primaryCta: string;
  primaryHref: string;
  secondaryCta: string;
  secondaryHref: string;
};

const buttons = {
  primaryCta: CTA.mission,
  primaryHref: "/contact",
  secondaryCta: CTA.contact,
  secondaryHref: "/contact",
} as const;

/** Homepage — locked vision band. */
export const HOME_CTA: PageCtaCopy = {
  lines: [
    "IST is building toward a world where every device,",
    "on any network, can communicate intelligently —",
  ],
  accentLine: "regardless of topology, protocol, or environment.",
  afterLines: [
    "That future requires rethinking networking from the ground up.",
    "That is what we are doing.",
  ],
  ...buttons,
};

/** Interior pages reuse the locked vision CTA — no invented closer headlines. */
export const SOLUTIONS_CTA: PageCtaCopy = { ...HOME_CTA };

export const LOCUS_CTA: PageCtaCopy = { ...HOME_CTA };

export const CRUCIBLE_CTA: PageCtaCopy = { ...HOME_CTA };

/** Applications page — closer band owns “One Platform…”; CTA uses locked vision. */
export const APPLICATIONS_CTA: PageCtaCopy = { ...HOME_CTA };

export const ABOUT_CTA: PageCtaCopy = { ...HOME_CTA };

export const NEWS_CTA: PageCtaCopy = { ...HOME_CTA };

export const INSIGHTS_CTA: PageCtaCopy = { ...HOME_CTA };
