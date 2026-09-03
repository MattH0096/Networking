import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { NewsPager } from "@/components/news/NewsPager";
import { Container } from "@/components/ui/Container";
import { getSiteContent } from "@/lib/cms/content";
import {
  formatNewsDetailDate,
  formatNewsListDate,
  getAdjacentNewsPosts,
} from "@/lib/news";
import { tryImg } from "@/lib/images.server";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const content = await getSiteContent();
  const post = content.news.posts.find((p) => p.slug === slug);
  if (!post) return { title: "News" };
  return {
    title: `${post.title} — News`,
    description: post.excerpt,
  };
}

export default async function NewsPostPage({ params }: Props) {
  const { slug } = await params;
  const content = await getSiteContent();
  const post = content.news.posts.find((p) => p.slug === slug);
  if (!post) notFound();

  const asset = tryImg(post.image);
  const paragraphs = post.body
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  const { previous, next } = getAdjacentNewsPosts(content.news.posts, post.slug);

  return (
    <article className="section-y bg-ist-bg">
      <Container className="max-w-3xl">
        <p className="mb-8">
          <Link
            href="/news"
            className="text-[0.85rem] text-ist-muted transition-colors hover:text-ist-text"
          >
            ← All news
          </Link>
        </p>

        <p className="text-[0.9rem] text-ist-text/90">
          <time dateTime={post.date}>{formatNewsListDate(post.date)}</time>
        </p>
        <h1 className="mt-5 text-[1.65rem] font-bold uppercase leading-[1.15] tracking-tight text-ist-accent-bright sm:text-[2rem] lg:text-[2.25rem]">
          {post.title}
        </h1>
        <p className="mt-3 text-[0.8rem] text-ist-dim">
          <time dateTime={post.date}>{formatNewsDetailDate(post.date)}</time>
        </p>

        {asset ? (
          <div className="relative mt-8 aspect-[16/9] overflow-hidden border border-ist-line bg-black">
            <Image
              src={asset.src}
              width={asset.width}
              height={asset.height}
              alt=""
              className="h-full w-full object-cover"
              priority
              sizes="(min-width: 768px) 48rem, 100vw"
            />
          </div>
        ) : null}

        {post.excerpt ? (
          <p className="mt-8 text-[1.05rem] leading-relaxed text-ist-text">{post.excerpt}</p>
        ) : null}

        <div className="mt-8 flex flex-col gap-5 text-[1rem] leading-relaxed text-ist-text/90">
          {paragraphs.length > 0 ? (
            paragraphs.map((para) => <p key={para.slice(0, 48)}>{para}</p>)
          ) : (
            <p className="text-ist-muted">Full story coming soon.</p>
          )}
        </div>

        <NewsPager previous={previous} next={next} />
      </Container>
    </article>
  );
}
