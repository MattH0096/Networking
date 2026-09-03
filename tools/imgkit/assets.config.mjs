/**
 * Curated map of source imagery → public asset slugs.
 *
 * Sources live in `individual image/` and are directional placeholders until
 * the client marks them approved. `role` drives the output width.
 */

export const ROLE_WIDTHS = {
  hero: 1920,
  band: 1600,
  diagram: 1600,
  tile: 1100,
  cutout: 900,
};

/** @type {{ slug: string, src: string, role: keyof typeof ROLE_WIDTHS, note: string, treat?: boolean, size?: { width: number, height: number }, zoom?: number }[]} */
export const ASSETS = [
  // ---------- Product visuals ----------
  {
    slug: "locus-network-in-action",
    src: "locus-network-in-action.png",
    role: "diagram",
    treat: false,
    note: "Homepage Locus — network in action plate",
  },
  {
    slug: "crucible-terrain-sim",
    src: "Crucible.png",
    role: "diagram",
    treat: false,
    note: "Homepage / Crucible — tactical terrain table",
  },
  {
    slug: "crucible-questions-terrain",
    src: "crucible-questions-terrain.png",
    role: "diagram",
    treat: false,
    note: "Crucible — questions section terrain with satellite and interference dome",
  },
  {
    slug: "locus-distribution",
    src: "distributed systems.png",
    role: "diagram",
    treat: false,
    note: "Locus — Assured Distribution in Action topology diagram",
  },

  // ---------- Solutions page plates ----------
  {
    slug: "solution-locus",
    src: "solution-locus.png",
    role: "diagram",
    treat: false,
    note: "Solutions — Locus assured distribution plate",
  },
  {
    slug: "solution-crucible",
    src: "solution-crucible.png",
    role: "diagram",
    treat: false,
    note: "Solutions — Crucible mission simulation plate",
  },
  {
    slug: "solution-hardware",
    src: "solution-hardware.png",
    role: "diagram",
    treat: false,
    note: "Solutions — programmable hardware plate",
  },

  // ---------- Insights ----------
  {
    slug: "insights-hero",
    src: "insights-hero.png",
    role: "hero",
    treat: false,
    note: "Insights page hero background",
  },
  {
    slug: "insights-cover",
    src: "cover.png",
    role: "diagram",
    treat: false,
    note: "Featured research book cover",
  },

  // ---------- How it works ----------
  {
    slug: "step-networks-change",
    src: "How it works (1).png",
    role: "tile",
    treat: false,
    note: "How it works 1",
  },
  {
    slug: "step-ist-adapts",
    src: "How it works (2).png",
    role: "tile",
    treat: false,
    note: "How it works 2",
  },
  {
    slug: "step-info-moving",
    src: "How it works (3).png",
    role: "tile",
    treat: false,
    note: "How it works 3",
  },
  {
    slug: "step-mission-continues",
    src: "How it works (4).png",
    role: "tile",
    treat: false,
    note: "How it works 4",
  },

  // ---------- Homepage panels ----------
  {
    slug: "section-problem",
    src: "The Problem.png",
    role: "diagram",
    treat: false,
    note: "Homepage Problem",
  },
  {
    slug: "section-solution",
    src: "The Solution.png",
    role: "diagram",
    treat: false,
    note: "Homepage Solution",
  },
  {
    slug: "section-missing-layer",
    src: "The Missing Layer.png",
    role: "diagram",
    treat: false,
    note: "Solutions — Distribution Intelligence / missing layer plate",
  },
  // section-platform-stack removed — file never shipped; unused on site

  // ---------- Application tiles ----------
  {
    slug: "app-space",
    src: "ChatGPT Image Aug 6, 2026, 10_37_54 AM (4).png",
    role: "tile",
    note: "Space — PLACEHOLDER (replace with approved operational photography)",
  },
  {
    slug: "app-defense",
    src: "ChatGPT Image Aug 6, 2026, 10_37_55 AM (5).png",
    role: "tile",
    note: "Defense — PLACEHOLDER (replace with approved operational photography)",
  },
  {
    slug: "app-drones-uas",
    src: "ChatGPT Image Aug 6, 2026, 10_37_57 AM (6).png",
    role: "tile",
    note: "Drones & UAS — PLACEHOLDER (replace with approved operational photography)",
  },
  {
    slug: "app-maritime",
    src: "ChatGPT Image Aug 6, 2026, 10_37_59 AM (7).png",
    role: "tile",
    note: "Maritime — PLACEHOLDER (replace with approved operational photography)",
  },
  {
    slug: "app-emergency-response",
    src: "app-emergency-response.png",
    role: "tile",
    note: "Emergency Response — paramedic / ambulance connectivity scene",
  },
  {
    slug: "app-industrial-iot",
    src: "ChatGPT Image Aug 6, 2026, 10_38_01 AM (9).png",
    role: "tile",
    note: "Industrial IoT — PLACEHOLDER (replace with approved operational photography)",
  },

  // ---------- Bands ----------
  {
    slug: "band-vision",
    src: "CTA.png",
    role: "band",
    treat: false,
    note: "Vision + CTA band",
  },
  {
    slug: "band-one-platform",
    src: "band-one-platform.png",
    role: "band",
    treat: false,
    note: "Applications closer — One Platform. Countless Possibilities.",
  },
  {
    slug: "band-contact-help",
    src: "band-contact-help.png",
    role: "band",
    treat: false,
    note: "Contact page help / stay connected band",
  },
  // contact-hero removed — Contact uses video heroes now
  {
    slug: "band-careers-lead",
    src: "Career.png",
    role: "band",
    treat: false,
    note: "Careers hiring lead plate under hero",
  },
  {
    slug: "about-statement",
    src: "Behind IST.png",
    role: "band",
    treat: false,
    note: "About — statement plate (Behind IST)",
  },
  {
    slug: "about-mission",
    src: "Mission.png",
    role: "band",
    treat: false,
    note: "About — Our Mission card",
  },
  {
    slug: "about-vision",
    src: "Vision.png",
    role: "band",
    treat: false,
    note: "About — Our Vision card",
  },
  {
    slug: "news-hero",
    src: "News.png",
    role: "hero",
    treat: false,
    note: "News page hero",
  },
  {
    slug: "map-denver",
    src: "map-colorado.png",
    role: "band",
    note: "Contact page map — Colorado HQ",
  },
];
