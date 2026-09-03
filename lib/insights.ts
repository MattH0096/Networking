/**
 * §9.8 Insights.
 *
 * One paper, exactly as specified. `file` is a slug, never a path — the browser
 * only ever sees `/api/insights/<slug>/download`, and the real filename is
 * resolved on the server after the gate has been passed.
 *
 * No fabricated metrics (page counts, etc.) — only approved identity fields and
 * qualitative signals.
 */

export const INSIGHTS_INTRO =
  "IST is committed to advancing the state of the art in networked systems. This page serves as our hub for technical white papers, research publications, and industry perspectives.";

export type Paper = {
  slug: string;
  title: string;
  series: string;
  /** Display string. The paper is dated by month, so there is no ISO day to give. */
  date: string;
  gated: boolean;
  /** Short abstract for the featured layout — no unverified claims. */
  summary: string;
  tags: readonly string[];
  /** Qualitative signals only — never invent page counts or metrics. */
  signals: readonly { label: string; icon: "doc" | "chart" | "review" }[];
};

export const PAPERS: Paper[] = [
  {
    slug: "distribution-completeness",
    title: "Distribution Completeness in Dynamic Mesh Networks: The Missing Layer",
    series: "IST Technical Research Series",
    date: "July 2026",
    gated: true,
    summary:
      "This paper introduces a distribution completeness framework for dynamic mesh networks — how information reaches every intended destination when connectivity is intermittent, contested, or incomplete.",
    tags: [
      "Dynamic Networks",
      "Distribution Completeness",
      "Mesh Systems",
      "Network Resilience",
      "Information Theory",
    ],
    signals: [
      { label: "Technical paper", icon: "doc" },
      { label: "Figures & models", icon: "chart" },
    ],
  },
];

/**
 * Future publications overview — blank cards for review only.
 * @deprecated Placeholders are no longer shown. Upcoming items are CMS-managed.
 */
export const FUTURE_PUBLICATIONS = [] as const;
