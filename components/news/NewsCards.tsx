import Image from "next/image";
import Link from "next/link";

import type { ImageAsset } from "@/lib/images";
import type { NewsPost } from "@/lib/news";
import { formatNewsListDate } from "@/lib/news";

export type NewsPostView = NewsPost & {
  imageAsset?: ImageAsset | null;
};

/**
 * News list item — fixed image size + date / orange headline / excerpt / Read More.
 */
export function NewsCard({ post }: { post: NewsPostView }) {
  const href = `/news/${post.slug}`;
  const asset = post.imageAsset;

  return (
    <article className="group border-b border-ist-line/80 py-10 first:pt-0 last:border-b-0 sm:py-12">
      <div className="grid items-start gap-6 sm:gap-8 md:grid-cols-[minmax(0,1.05fr)_minmax(0,1.2fr)] md:gap-10 lg:gap-12">
        <Link
          href={href}
          className="relative block aspect-[16/9] w-full overflow-hidden bg-ist-raised"
        >
          {asset ? (
            <Image
              src={asset.src}
              width={asset.width}
              height={asset.height}
              alt=""
              sizes="(min-width: 1024px) 34vw, (min-width: 768px) 45vw, 100vw"
              className="h-full w-full object-cover transition-transform duration-500 ease-ist group-hover:scale-[1.02]"
            />
          ) : (
            <div className="absolute inset-0 bg-[linear-gradient(135deg,#141414_0%,#0a0a0a_55%,#1a120e_100%)]" />
          )}
        </Link>

        <div className="flex min-w-0 flex-col">
          <p className="text-[0.9rem] text-ist-text/90">
            <time dateTime={post.date}>{formatNewsListDate(post.date)}</time>
          </p>
          <h3 className="mt-4 text-[1.25rem] font-bold uppercase leading-[1.15] tracking-tight text-ist-accent-bright sm:text-[1.45rem] lg:text-[1.6rem]">
            <Link
              href={href}
              className="transition-colors duration-[180ms] ease-ist hover:text-ist-accent"
            >
              {post.title}
            </Link>
          </h3>
          {post.excerpt ? (
            <p className="mt-4 text-[0.98rem] leading-relaxed text-ist-text sm:text-[1.02rem]">
              {post.excerpt}
            </p>
          ) : null}
          <p className="mt-7">
            <Link
              href={href}
              className="text-[1rem] font-medium text-ist-accent-bright underline underline-offset-[5px] transition-colors duration-[180ms] ease-ist hover:text-ist-accent"
            >
              Read More
            </Link>
          </p>
        </div>
      </div>
    </article>
  );
}
