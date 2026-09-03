"use client";

import { useMemo, useState } from "react";

import { NewsCard, type NewsPostView } from "@/components/news/NewsCards";
import { NewsFilterIcon } from "@/components/news/NewsIcons";
import { cn } from "@/lib/cn";
import {
  CATEGORY_LABELS,
  NEWS_CATEGORIES,
  sortNewsPosts,
  type NewsCategory,
} from "@/lib/news";

type Filter = "all" | NewsCategory;

const FILTERS: Filter[] = ["all", ...NEWS_CATEGORIES];
const LABELS: Record<Filter, string> = { all: "All", ...CATEGORY_LABELS };

type Props = {
  posts: NewsPostView[];
};

/**
 * News index — filters + equal-size image rows.
 */
export function NewsIndex({ posts: source }: Props) {
  const [active, setActive] = useState<Filter>("all");

  const posts = useMemo(() => {
    const sorted = sortNewsPosts(source);
    return active === "all" ? sorted : sorted.filter((post) => post.category === active);
  }, [active, source]);

  const empty = posts.length === 0;

  return (
    <div>
      {source.length > 0 ? (
        <div role="group" aria-label="Filter news by category" className="flex flex-wrap gap-2">
          {FILTERS.map((filter) => {
            const selected = filter === active;

            return (
              <button
                key={filter}
                type="button"
                aria-pressed={selected}
                onClick={() => setActive(filter)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-md border px-3.5 py-2 text-[0.8rem] font-medium transition-colors duration-[180ms] ease-ist sm:px-4",
                  selected
                    ? "border-ist-accent bg-ist-accent/10 text-ist-text"
                    : "border-transparent text-ist-muted hover:border-ist-line hover:text-ist-text",
                )}
              >
                <NewsFilterIcon
                  name={filter}
                  className={selected ? "text-ist-accent-bright" : "text-ist-dim"}
                />
                {LABELS[filter]}
              </button>
            );
          })}
        </div>
      ) : null}

      <div className={cn(source.length > 0 ? "mt-8 sm:mt-10" : "")}>
        {empty ? (
          <p className="max-w-xl text-[0.95rem] leading-relaxed text-ist-muted">
            {source.length === 0
              ? "No news posts yet. Check back soon."
              : `No posts in ${LABELS[active].toLowerCase()} yet.`}
          </p>
        ) : (
          <ul>
            {posts.map((post) => (
              <li key={post.slug}>
                <NewsCard post={post} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
