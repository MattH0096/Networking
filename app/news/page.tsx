import type { Metadata } from "next";

import { PageHero } from "@/components/layout/PageHero";
import { NewsIndex } from "@/components/news/NewsIndex";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { Container } from "@/components/ui/Container";
import { getSiteContent } from "@/lib/cms/content";
import { tryImg } from "@/lib/images.server";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return {
    title: "News — Latest News & Updates",
    description: content.news.lead,
  };
}

export default async function NewsPage() {
  const content = await getSiteContent();
  const c = content.news;
  const posts = c.posts.map((post) => ({
    ...post,
    imageAsset: tryImg(post.image),
  }));

  return (
    <>
      <PageHero
        eyebrow={c.eyebrow}
        title={c.title}
        lead={c.lead}
        image="news-hero"
        alt={c.heroAlt}
        mobileFocus="right"
      />

      <section className="section-y bg-ist-bg">
        <Container>
          <NewsIndex posts={posts} />
        </Container>
      </section>

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
