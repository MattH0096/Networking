/**
 * Homepage content, in the order the spec fixes the sections.
 *
 * Anything commented `[LOCKED]` ships verbatim — line breaks may change, words
 * may not. Keeping the strings here rather than inline in JSX means a copy
 * review happens in one file.
 */

import { CTA } from "@/lib/site";

/** §9.1.1 [LOCKED] — headline breaks on the sentence, never an orphaned word. */
export const HERO = {
  lines: ["Every Device.", "Any Network."],
  cta: CTA.howItWorks,
  ctaHref: "/#how-it-works",
} as const;

/** Hero bottom-right support panel. */
export const SUPPORT_LINE = {
  lines: [
    "The world moves.",
    "Networks weren't built to keep up.",
  ],
  closer: "IST was.",
} as const;

/**
 * Homepage Problem — §9.1.3 [LOCKED] heading, four condition lines, closer.
 */
export const PROBLEM = {
  headingLines: [
    "Today's networks assume perfect",
    "connectivity. Reality does not.",
  ] as const,
  conditions: [
    { icon: "satellite" as const, line: "Satellites move." },
    { icon: "mountains" as const, line: "Drones fly behind mountains." },
    { icon: "ship" as const, line: "Ships disappear beyond the horizon." },
    { icon: "robotArm" as const, line: "Robots lose line of sight." },
  ],
  closer:
    "Conventional systems treat these interruptions as failures. IST treats them as the environment the network must survive.",
} as const;

/** Homepage Solution column — paired with Problem in one composition. */
export const SOLUTION = {
  headingLines: ["Networks should adapt.", "Not break."] as const,
  body: "IST intelligently stores, routes, and delivers information through changing networks until every intended destination receives what it needs. Missions should not stop simply because connectivity changes.",
} as const;

/**
 * §9.1.5 [LOCKED sequence] — labels stay fixed; supporting lines explain each beat.
 */
export const HOW_IT_WORKS = [
  {
    key: "01",
    n: 1,
    label: "Networks change",
    image: "step-networks-change",
    alt: "Vehicle, drone and base station linked across a canyon under storm clouds.",
  },
  {
    key: "02",
    n: 2,
    label: "IST adapts",
    image: "step-ist-adapts",
    alt: "Ruggedized field unit with copper links and antennas, orange core active.",
  },
  {
    key: "03",
    n: 3,
    label: "Information keeps moving",
    image: "step-info-moving",
    alt: "Drone, ship and satellite connected by an orange data path over open water.",
  },
  {
    key: "04",
    n: 4,
    label: "Mission continues",
    image: "step-mission-continues",
    alt: "Rover, field relay and drone operating together across rugged terrain at dusk.",
  },
] as const;

/** §9.1.6 and §9.1.7. Descriptions reuse approved product-page copy verbatim. */
export const PRODUCTS = [
  {
    id: "locus",
    eyebrow: "",
    name: "Locus",
    tagline: "Assured data distribution engine.",
    body: "Locus is IST's assured distribution engine. It ensures mission-critical information continues moving through dynamic, intermittently connected networks until delivery is complete.",
    /** The sharpest line in the brief. Given its own display treatment. */
    pull: "Not most. All.",
    pullLead: "Delivery is not complete until every intended recipient has the complete payload.",
    cta: CTA.locus,
    href: "/locus",
    image: "locus-network-in-action",
    alt: "Locus — glowing cargo pods moving across drone, truck, rail, and ship links.",
  },
  {
    id: "crucible",
    eyebrow: "",
    name: "Crucible",
    tagline: "Simulation, validation, mission visualization.",
    body: "Before deployment, watch your mission come to life. Build your network. Move your assets. See how terrain, movement, and interference impact connectivity — and how IST keeps information flowing.",
    pull: "Know before you go.",
    pullLead: "Measure results, identify failure points, and optimize before you deploy.",
    cta: CTA.crucible,
    href: "/crucible",
    image: "crucible-terrain-sim",
    alt: "Crucible — tactical terrain table with glowing network paths and naval assets offshore.",
  },
] as const;

/** §9.5 [LOCKED] — real operational photography, one line each. */
export const APPLICATIONS = {
  heading: "Built for the Missions That Matter Most.",
  headingLines: ["Built for the Missions", "That Matter Most."] as const,
  lead: "IST solutions enable reliable communication across a wide range of industries and mission-critical applications.",
  tiles: [
    {
      id: "space",
      label: "Space",
      line: "Reliable data delivery for satellites, constellations, and space systems.",
      image: "app-space",
      alt: "A satellite in low orbit above the illuminated curve of Earth.",
    },
    {
      id: "defense",
      label: "Defense",
      line: "Secure, resilient communications for military and multi-domain operations.",
      image: "app-defense",
      alt: "A dispersed team observing a valley at dusk with an aircraft overhead.",
    },
    {
      id: "drones-uas",
      label: "Drones & UAS",
      line: "Persistent connectivity for drone teams and autonomous systems.",
      image: "app-drones-uas",
      alt: "An uncrewed aircraft in flight over mountainous terrain at sunrise.",
    },
    {
      id: "maritime",
      label: "Maritime",
      line: "Connectivity beyond the horizon for ships and maritime operations.",
      image: "app-maritime",
      alt: "A vessel under way in heavy seas beneath a broken sky.",
    },
    {
      id: "emergency-response",
      label: "Emergency Response",
      line: "Dependable communication that reaches every responder, every time.",
      image: "app-emergency-response",
      alt: "Emergency responders coordinating on a wet city street at night.",
    },
    {
      id: "industrial-iot",
      label: "Industrial IoT",
      line: "Reliable connectivity for remote and distributed operations.",
      image: "app-industrial-iot",
      alt: "A remote industrial processing facility lit against the dusk.",
    },
  ],
  closer: {
    heading: "One Platform. Countless Possibilities.",
    body: "From space to sea, air to ground — IST keeps your critical information moving so your mission never stops.",
    cta: "Explore All Solutions",
    href: "/solutions",
  },
} as const;

export type LayerStatus = "current" | "in-development" | "coming-soon";

/**
 * §9.1.9 — the strategic centre of the page. Unreleased layers carry no name
 * and no capability copy; the restraint is the message.
 */
export const STACK: {
  layer: string;
  product: string | null;
  status: LayerStatus;
}[] = [
  { layer: "Distribution Software", product: "Locus", status: "current" },
  { layer: "Simulation & Validation", product: "Crucible", status: "current" },
  { layer: "Network Processing Hardware", product: null, status: "in-development" },
  { layer: "Protocol Interoperability", product: null, status: "in-development" },
  { layer: "Developer Ecosystem", product: null, status: "coming-soon" },
];

export const STATUS_LABELS: Record<LayerStatus, string> = {
  current: "CURRENT",
  "in-development": "In Development",
  "coming-soon": "Coming Soon",
};

/** §9.1.10 — closing CTA band. Prefer `HOME_CTA` from `@/lib/cta` for new code. */
export const VISION = {
  lines: [
    "IST is building toward a world where every device,",
    "on any network, can communicate intelligently —",
  ] as const,
  accentLine: "regardless of topology, protocol, or environment.",
  afterLines: [
    "That future requires rethinking networking from the ground up.",
    "That is what we are doing.",
  ] as const,
  primaryCta: CTA.mission,
  primaryHref: "/contact",
  secondaryCta: CTA.contact,
  secondaryHref: "/contact",
} as const;
