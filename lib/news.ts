/**
 * §9.7 News.
 *
 * Categories and labels stay here. Posts are managed in the CMS
 * (`content/overrides.json` → news.posts) via `/admin/news`.
 * Defaults seed the site until an admin save replaces the list.
 */

export const NEWS_CATEGORIES = ["company", "partnerships", "product", "media"] as const;

export type NewsCategory = (typeof NEWS_CATEGORIES)[number];

export type NewsPost = {
  id?: string;
  slug: string;
  title: string;
  category: NewsCategory;
  /** ISO 8601 date, e.g. "2026-07-14". */
  date: string;
  excerpt: string;
  /** Image key (manifest or upload override). Optional for basic list layout. */
  image?: string;
  /** Plain text body; paragraphs separated by blank lines. */
  body: string;
};

export const CATEGORY_LABELS: Record<NewsCategory, string> = {
  company: "Company",
  partnerships: "Partnerships",
  product: "Product",
  media: "Media",
};

/** Seed posts shown when CMS has no `news.posts` yet. */
export const DEFAULT_NEWS_POSTS: NewsPost[] = [
  {
    id: "post-spaceapp-mou",
    slug: "ist-signs-mou-with-spaceapp",
    title: "IST Signs MoU with SpaceApp to Explore Joint Architecture",
    category: "partnerships",
    date: "2026-07-31",
    excerpt: "IST signs technical collaboration agreement with SpaceApp.",
    image: "news-spaceapp",
    body: [
      "Integrated Switching Technologies has signed an MoU agreement with SpaceApp to explore the integration of IST's distribution intelligence architecture within SpaceApp's enterprise mission framework.",
      "SpaceApp develops the Mission Services Integration Framework — a vendor-neutral backbone for integrating specialized mission capabilities into BMC3I architectures. Through this collaboration, IST's distribution intelligence layer is being evaluated as a foundational component of that stack, sitting beneath SpaceApp's Mission Intelligence Integration Layer and responsible for ensuring reliable, adaptive data distribution across dynamic network environments.",
      "The two companies will jointly develop a Joint Architecture Document capturing the technical relationship between their platforms — covering architectural insertion points, mission product exchange, and the role of distribution intelligence as an input to enterprise mission intelligence and decision support.",
      "This agreement marks the beginning of what both companies see as a natural and complementary fit within evolving mission systems architectures.",
    ].join("\n\n"),
  },
  {
    id: "post-research-series-vol-1",
    slug: "ist-technical-research-series-volume-1",
    title: "IST Technical Research Series — Volume 1 Now Available",
    category: "company",
    date: "2026-07-13",
    excerpt: "IST publishes first paper in the Technical Research Series.",
    image: "news-research-series",
    body: [
      "Integrated Switching Technologies has published its first paper in the IST Technical Research Series — Distribution Completeness in Dynamic Mesh Networks: The Missing Layer. The paper defines distribution completeness as a distinct network property, examines why existing approaches fail to guarantee it, and presents the architectural case for a dedicated distribution intelligence layer. Available now on our Insights page.",
    ].join("\n\n"),
  },
];

/** @deprecated Prefer DEFAULT_NEWS_POSTS / CMS — kept for older imports. */
export const POSTS: NewsPost[] = DEFAULT_NEWS_POSTS;

/** Newest first. */
export function sortNewsPosts<T extends { date: string }>(posts: T[]): T[] {
  return [...posts].sort((a, b) => b.date.localeCompare(a.date));
}

export function formatNewsListDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "2-digit",
  });
}

export function formatNewsDetailDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Adjacent posts in newest→oldest order (prev = newer, next = older). */
export function getAdjacentNewsPosts<T extends { slug: string; date: string }>(
  posts: T[],
  slug: string,
): { previous: T | null; next: T | null } {
  const sorted = sortNewsPosts(posts);
  const index = sorted.findIndex((p) => p.slug === slug);
  if (index < 0) return { previous: null, next: null };
  return {
    previous: index > 0 ? sorted[index - 1]! : null,
    next: index < sorted.length - 1 ? sorted[index + 1]! : null,
  };
}
