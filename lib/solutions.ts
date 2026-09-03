/**
 * §9.2 Solutions page. Header is [LOCKED]; all three column bodies are verbatim
 * from the spec table.
 *
 * The hardware column is the reason this page exists — it carries the platform
 * signal — so it gets identical size and spacing to the two software columns and
 * differs only in rule state. "Details coming soon." is the approved language
 * and nothing may be added to it.
 */

import type { ImageKey } from "@/lib/images";

export const SOLUTIONS_HEADER = {
  titleLines: ["Solutions Built for Dynamic,", "Intermittent Networks"] as const,
  /** Single-line form for metadata / accessibility. */
  title: "Solutions Built for Dynamic, Intermittent Networks",
  lead: "IST delivers the software and simulation tools needed to operate with confidence in the most challenging environments — with programmable hardware in development to extend that capability further.",
} as const;

export type SolutionColumn = {
  eyebrow: string;
  title: string;
  body: string;
  /** Shipping columns link out; the hardware column deliberately does not. */
  href: string | null;
  cta: string | null;
  status: "current" | "in-development";
  image: ImageKey;
  alt: string;
};

export const SOLUTION_COLUMNS: SolutionColumn[] = [
  {
    eyebrow: "Software",
    title: "Locus: Assured Distribution Engine",
    body: "Ensures mission-critical information reaches every destination through dynamic, intermittently connected networks until delivery is complete.",
    href: "/locus",
    cta: "Explore Locus",
    status: "current",
    image: "solution-locus",
    alt: "Network nodes linked by orange paths — Locus routes around obstacles to keep delivery moving.",
  },
  {
    eyebrow: "Software",
    title: "Crucible: Mission Simulation & Validation",
    body: "Visualize, test, and refine your mission and network before deployment so you can move forward with confidence.",
    href: "/crucible",
    cta: "Explore Crucible",
    status: "current",
    image: "solution-crucible",
    alt: "Terrain table with drones, ground assets, and glowing network paths — Crucible mission simulation.",
  },
  {
    eyebrow: "Hardware",
    title: "Programmable Hardware That Adapts to Any Environment",
    body: "IST hardware is designed for performance, flexibility, and integration across air, space, land, and sea.",
    href: null,
    cta: null,
    status: "in-development",
    image: "solution-hardware",
    alt: "Ruggedized programmable hardware module with field connectors and an active orange core.",
  },
];

/** Approved verbatim, and set apart so it never reads as part of the body copy. */
export const HARDWARE_NOTE = "Details coming soon.";

/**
 * Distribution Intelligence — the missing architectural layer.
 * Written for customers and investors: clear thesis, then proof.
 * CTA routes to Insights (gated paper: distribution-completeness).
 */
export const MISSING_LAYER = {
  eyebrow: "The Missing Layer",
  title: "Distribution Intelligence for Networks That Can't Afford to Fail",
  lead: "Today's networks know how to move packets. They don't know how to complete missions.",
  /** Plain-language frame for the gap in the stack. */
  problem:
    "Classic network architecture stops at moving data between nodes. It assumes connectivity will hold. In contested, intermittent, and hybrid environments, that assumption breaks — and missions stall.",
  insight:
    "Distribution Intelligence is the layer that was never built: software that keeps critical information moving until every intended destination receives what it needs.",
  stackLabel: "Where it sits",
  stackCaption:
    "Above transport. Below applications. Built for autonomous, DDIL, terrestrial, NTN, and hybrid networks.",
  image: "section-missing-layer",
  imageAlt:
    "Distribution Intelligence — the missing layer linking applications to the network fabric across domains.",
  stack: [
    { id: "applications", label: "Applications", highlight: false, icon: "applications" as const },
    {
      id: "distribution",
      label: "Distribution Intelligence",
      highlight: true,
      icon: "distribution" as const,
    },
    { id: "transport", label: "Transport", highlight: false, icon: "transport" as const },
    { id: "network", label: "Network", highlight: false, icon: "network" as const },
    { id: "datalink", label: "Data Link", highlight: false, icon: "datalink" as const },
    { id: "physical", label: "Physical", highlight: false, icon: "physical" as const },
  ],
  outcomesLabel: "What it delivers",
  features: [
    {
      id: "mission",
      title: "Mission Awareness",
      body: "Understands what information matters and where it must go.",
      icon: "mission" as const,
    },
    {
      id: "adaptive",
      title: "Adaptive Distribution",
      body: "Changes delivery strategy as links appear, fail, or degrade.",
      icon: "adaptive" as const,
    },
    {
      id: "persistent",
      title: "Persistent Delivery",
      body: "Keeps information moving until every intended recipient receives it.",
      icon: "persistent" as const,
    },
    {
      id: "cross",
      title: "Cross-Network Intelligence",
      body: "Works across terrestrial, satellite, mesh, and hybrid environments.",
      icon: "cross" as const,
    },
  ],
  bridgeLabel: "From thesis to platform",
  bridgeLead:
    "The white paper defines the layer. IST builds the software, simulation, and hardware to put it in the field.",
  flow: [
    { id: "thesis", label: "White Paper", detail: "The thesis", href: "/insights" },
    { id: "di", label: "Distribution Intelligence", detail: "The missing layer", href: null },
    { id: "locus", label: "Locus", detail: "Assured distribution", href: "/locus" },
    { id: "crucible", label: "Crucible", detail: "Mission validation", href: "/crucible" },
    { id: "hardware", label: "Hardware", detail: "In development", href: "/solutions" },
  ],
  cta: "Read the White Paper",
  ctaHref: "/insights",
  ctaNote: "Technical research series — gated download on Insights.",
} as const;

/**
 * Full-stack band under the three solution cards — presentation structure.
 * Pillars map to software / simulation / hardware already on this page, plus
 * soft integration language (no invented product names).
 */
export const SOLUTIONS_FULL_STACK = {
  title: "A Full-Stack Approach to Mission Success",
  lead: "IST provides the essential building blocks to design, test, field, and sustain mission communications across the most complex, dynamic environments.",
  items: [
    {
      id: "software",
      title: "Software",
      body: "Purpose-built software that moves critical data across intermittent, contested, and constrained networks with confidence.",
      icon: "code" as const,
    },
    {
      id: "simulation",
      title: "Simulation & Validation",
      body: "High-fidelity simulation environments to stress, validate, and optimize missions before they launch.",
      icon: "cube" as const,
    },
    {
      id: "hardware",
      title: "Hardware",
      body: "Rugged, adaptable hardware platforms engineered for performance across air, space, land, and sea.",
      icon: "chip" as const,
    },
    {
      id: "integration",
      title: "Integration",
      body: "Open, modular, and API-first to integrate seamlessly with your systems, tools, and mission workflows.",
      icon: "puzzle" as const,
    },
  ],
} as const;
