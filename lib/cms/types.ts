/**
 * CMS content model — editable slices the admin can change.
 * Site code merges these over the locked TypeScript defaults in lib/*.
 */

export type ImageOverride = {
  src: string;
  width: number;
  height: number;
};

export type HomeHowItWorksOverride = {
  label?: string;
  alt?: string;
};

export type HomeApplicationTileOverride = {
  label?: string;
  line?: string;
  alt?: string;
};

export type HomeStackLayerOverride = {
  layer?: string;
  product?: string | null;
};

/** Closing CTA band fields shared across pages. */
export type VisionOverrideFields = {
  visionLine1?: string;
  visionLine2?: string;
  visionAccent?: string;
  visionAfter1?: string;
  visionAfter2?: string;
  visionPrimaryCta?: string;
  visionSecondaryCta?: string;
};

export type TitleBodyOverride = {
  title?: string;
  body?: string;
};

export type FlowStepOverride = {
  key?: string;
  title?: string;
  body?: string;
};

export type SiteOverrides = {
  updatedAt?: string;
  home?: {
    heroLine1?: string;
    heroLine2?: string;
    heroCta?: string;
    supportLines?: [string, string];
    supportCloser?: string;
    problemEyebrow?: string;
    problemHeading1?: string;
    problemHeading2?: string;
    problemConditions?: [string, string, string, string];
    problemCloser?: string;
    solutionEyebrow?: string;
    solutionHeading1?: string;
    solutionHeading2?: string;
    solutionBody?: string;
    howItWorksTitle?: string;
    howItWorksSteps?: HomeHowItWorksOverride[];
    locusEyebrow?: string;
    locusTagline?: string;
    locusBody?: string;
    locusPull?: string;
    locusPullLead?: string;
    locusAlt?: string;
    crucibleEyebrow?: string;
    crucibleTagline?: string;
    crucibleBody?: string;
    cruciblePull?: string;
    cruciblePullLead?: string;
    crucibleAlt?: string;
    applicationsEyebrow?: string;
    applicationsHeading?: string;
    applicationsLead?: string;
    applicationsTiles?: HomeApplicationTileOverride[];
    applicationsCloserHeading?: string;
    applicationsCloserBody?: string;
    applicationsCloserCta?: string;
    stackTitle?: string;
    stackLayers?: HomeStackLayerOverride[];
  } & VisionOverrideFields;
  solutions?: {
    eyebrow?: string;
    titleLine1?: string;
    titleLine2?: string;
    lead?: string;
    columns?: {
      eyebrow?: string;
      title?: string;
      body?: string;
      cta?: string | null;
      alt?: string;
    }[];
    hardwareNote?: string;
    missingEyebrow?: string;
    missingTitle?: string;
    missingLead?: string;
    missingGapLabel?: string;
    missingProblem?: string;
    missingAnswerLabel?: string;
    missingInsight?: string;
    missingStackLabel?: string;
    missingStackCaption?: string;
    missingStackHighlightNote?: string;
    missingStackLayers?: { label?: string }[];
    missingImageAlt?: string;
    missingOutcomesLabel?: string;
    missingFeatures?: TitleBodyOverride[];
    missingBridgeLabel?: string;
    missingBridgeLead?: string;
    missingFlow?: { label?: string; detail?: string }[];
    missingCta?: string;
    missingCtaNote?: string;
    fullStackEyebrow?: string;
    fullStackTitle?: string;
    fullStackLead?: string;
    fullStackItems?: TitleBodyOverride[];
  } & VisionOverrideFields;
  locus?: {
    eyebrow?: string;
    titleLine1?: string;
    titleLine2?: string;
    lead?: string;
    flowHeading?: string;
    flow?: FlowStepOverride[];
    pullLead?: string;
    pullLine?: string;
    distributionHeading?: string;
    distributionSub?: string;
    distributionAlt?: string;
    impactHeading?: string;
    impact?: TitleBodyOverride[];
    features?: TitleBodyOverride[];
    /** @deprecated Prefer features[End-to-end].body — still merged for back-compat. */
    integrityBody?: string;
    whyHeading?: string;
    why?: TitleBodyOverride[];
  } & VisionOverrideFields;
  crucible?: {
    eyebrow?: string;
    titleLine1?: string;
    titleLine2?: string;
    leadIntro?: string;
    lead?: string;
    flowTag?: string;
    flowHeading?: string;
    flow?: FlowStepOverride[];
    pullLead?: string;
    pullLine?: string;
    questionsHeading?: string;
    questions?: string[];
    questionsAlt?: string;
    futureTag?: string;
    futureEyebrow?: string;
    futureHeading?: string;
    pillars?: TitleBodyOverride[];
  } & VisionOverrideFields;
  about?: {
    eyebrow?: string;
    title?: string;
    lead?: string;
    statementEyebrow?: string;
    statement?: string[];
    cards?: TitleBodyOverride[];
    howEyebrow?: string;
    howTitleLine1?: string;
    howTitleLine2?: string;
    howItems?: TitleBodyOverride[];
  } & VisionOverrideFields;
  contact?: {
    eyebrow?: string;
    title?: string;
    titleLine1?: string;
    titleLine2?: string;
    lead?: string;
    formTitle?: string;
    formLead?: string;
    formSecure?: string;
    formSubmit?: string;
    placeholders?: {
      fullName?: string;
      workEmail?: string;
      organization?: string;
      interest?: string;
      message?: string;
    };
    officeTitle?: string;
    officeLocation?: string;
    officeDescription?: string;
    mapAlt?: string;
    socialTitle?: string;
    socialLead?: string;
    pillars?: TitleBodyOverride[];
    helpHeading?: string;
    helpLead?: string;
  };
  insights?: {
    eyebrow?: string;
    title?: string;
    intro?: string;
    heroAlt?: string;
    featuredLabel?: string;
    /** Full list of published papers. When set (including []), replaces defaults. */
    papers?: {
      id?: string;
      slug?: string;
      title?: string;
      series?: string;
      date?: string;
      gated?: boolean;
      summary?: string;
      tags?: string[];
      signals?: { label?: string; icon?: "doc" | "chart" | "review" }[];
      coverKey?: string;
    }[];
    /** @deprecated singular paper — migrated into papers[] */
    paper?: {
      title?: string;
      series?: string;
      date?: string;
      summary?: string;
      tags?: string[];
      signals?: { label?: string }[];
    };
    upcomingHeading?: string;
    /** Optional “coming soon” cards. Empty by default — never seeded with placeholders. */
    upcoming?: {
      id?: string;
      title?: string;
      body?: string;
      status?: string;
    }[];
    /** @deprecated review placeholders — ignored */
    futureHeading?: string;
    future?: {
      title?: string;
      body?: string;
      status?: string;
    }[];
    subscribeHeading?: string;
    subscribeLead?: string;
    subscribeCta?: string;
    subscribeNote?: string;
    subscribeSuccessTitle?: string;
    subscribeSuccessBody?: string;
  } & VisionOverrideFields;
  news?: {
    eyebrow?: string;
    title?: string;
    lead?: string;
    heroAlt?: string;
    /** Full list of news posts. Empty by default. */
    posts?: {
      id?: string;
      slug?: string;
      title?: string;
      category?: "company" | "partnerships" | "product" | "media";
      date?: string;
      excerpt?: string;
      body?: string;
      image?: string;
    }[];
  } & VisionOverrideFields;
  careers?: {
    eyebrow?: string;
    title?: string;
    titleLine1?: string;
    titleLine2?: string;
    lead?: string;
    /** Full list of open roles. Defaults seed until CMS saves a list. */
    roles?: {
      id?: string;
      slug?: string;
      title?: string;
      team?: string;
      location?: string;
      type?: "Full-time" | "Part-time" | "Contract" | "Internship";
      summary?: string;
      /** Full job description (detail page). */
      body?: string;
    }[];
  };
  /** Image key → uploaded asset (replaces processed /img/* plate). */
  images?: Record<string, ImageOverride>;
};

export type AdminPageId =
  | "home"
  | "solutions"
  | "locus"
  | "crucible"
  | "about"
  | "contact"
  | "insights"
  | "news"
  | "careers"
  | "images";

export const ADMIN_PAGES: { id: AdminPageId; label: string; blurb: string }[] = [
  { id: "home", label: "Home", blurb: "All Home copy and section images" },
  { id: "solutions", label: "Solutions", blurb: "All Solutions copy and section images" },
  { id: "locus", label: "Locus", blurb: "Product page copy, flow, impact, and CTA" },
  { id: "crucible", label: "Crucible", blurb: "Product page copy, workflow, questions, and CTA" },
  { id: "about", label: "About", blurb: "Statement, mission/vision, how we build, and CTA" },
  { id: "contact", label: "Contact", blurb: "Hero, form chrome, office, pillars, and help band" },
  { id: "insights", label: "Insights", blurb: "Hero, papers, upcoming, subscribe, CTA" },
  { id: "news", label: "News", blurb: "Hero, posts, and closing CTA" },
  { id: "careers", label: "Careers", blurb: "Hero and open roles (add / edit / remove)" },
  { id: "images", label: "Images", blurb: "Replace any site image" },
];

export const ROLE_TYPES = ["Full-time", "Part-time", "Contract", "Internship"] as const;
export type RoleType = (typeof ROLE_TYPES)[number];

/** Image keys that appear on the Home page (for the Home admin editor). */
export const HOME_IMAGE_KEYS = [
  "section-problem",
  "section-solution",
  "step-networks-change",
  "step-ist-adapts",
  "step-info-moving",
  "step-mission-continues",
  "locus-network-in-action",
  "crucible-terrain-sim",
  "app-space",
  "app-defense",
  "app-drones-uas",
  "app-maritime",
  "app-emergency-response",
  "app-industrial-iot",
  "band-one-platform",
  "band-vision",
] as const;

export const SOLUTIONS_IMAGE_KEYS = [
  "solution-locus",
  "solution-crucible",
  "solution-hardware",
  "section-missing-layer",
  "band-vision",
] as const;

export const LOCUS_IMAGE_KEYS = ["locus-distribution", "band-vision"] as const;
export const CRUCIBLE_IMAGE_KEYS = ["crucible-questions-terrain", "band-vision"] as const;
export const ABOUT_IMAGE_KEYS = [
  "about-statement",
  "about-mission",
  "about-vision",
  "band-vision",
] as const;
export const CONTACT_IMAGE_KEYS = ["map-denver", "band-contact-help"] as const;
export const INSIGHTS_IMAGE_KEYS = ["insights-hero", "insights-cover", "band-vision"] as const;
export const NEWS_IMAGE_KEYS = [
  "news-hero",
  "news-spaceapp",
  "news-research-series",
  "band-vision",
] as const;
