import Link from "next/link";

import { cn } from "@/lib/cn";

type NavPost = {
  slug: string;
  title: string;
};

type Props = {
  previous: NavPost | null;
  next: NavPost | null;
};

/**
 * Previous / next news navigation at the foot of a post.
 * Previous = newer post; next = older post (newest-first index order).
 */
export function NewsPager({ previous, next }: Props) {
  if (!previous && !next) return null;

  return (
    <nav
      aria-label="News post navigation"
      className="mt-14 grid gap-4 border-t border-ist-line pt-8 sm:grid-cols-2 sm:gap-6"
    >
      {previous ? (
        <Link
          href={`/news/${previous.slug}`}
          className={cn(
            "group flex flex-col gap-2 rounded-md border border-ist-line px-4 py-4 transition-[border-color,background-color] duration-[180ms] ease-ist",
            "hover:border-ist-accent/50 hover:bg-white/[0.02]",
          )}
        >
          <span className="text-[0.72rem] font-medium uppercase tracking-[0.12em] text-ist-dim">
            ← Previous
          </span>
          <span className="text-[0.95rem] font-semibold leading-snug text-ist-text transition-colors group-hover:text-ist-accent-bright">
            {previous.title}
          </span>
        </Link>
      ) : (
        <div className="hidden sm:block" />
      )}

      {next ? (
        <Link
          href={`/news/${next.slug}`}
          className={cn(
            "group flex flex-col gap-2 rounded-md border border-ist-line px-4 py-4 text-right transition-[border-color,background-color] duration-[180ms] ease-ist sm:ml-auto sm:items-end",
            "hover:border-ist-accent/50 hover:bg-white/[0.02]",
          )}
        >
          <span className="text-[0.72rem] font-medium uppercase tracking-[0.12em] text-ist-dim">
            Next →
          </span>
          <span className="text-[0.95rem] font-semibold leading-snug text-ist-text transition-colors group-hover:text-ist-accent-bright">
            {next.title}
          </span>
        </Link>
      ) : null}
    </nav>
  );
}
