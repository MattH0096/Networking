"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ElementType, ReactNode } from "react";

import { cn } from "@/lib/cn";

/**
 * Motion vocabulary (sitewide rule):
 * - `fromLeft` / `fromRight` — split (2-col) sections: outside → in
 * - `expand` — single / full-bleed sections: center → out
 * - `rise` — card grids (How It Works, tiles): one-by-one upward
 */
export type RevealVariant = "fromLeft" | "fromRight" | "expand" | "rise";

type Props = {
  as?: ElementType;
  /** Stagger index for card grids — delay is `index × step`. */
  index?: number;
  /** Milliseconds between staggered cards. Default 120. */
  step?: number;
  variant?: RevealVariant;
  children: ReactNode;
  className?: string;
};

/**
 * Scroll reveal. Pick the variant from the section layout rule above.
 */
export function Reveal({
  as: Tag = "div",
  index = 0,
  step = 120,
  variant = "rise",
  children,
  className,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.16) {
            setRevealed(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: [0, 0.16, 0.3], rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={cn("reveal", className)}
      data-revealed={revealed ? "true" : "false"}
      data-reveal={variant}
      style={
        {
          "--reveal-i": index,
          "--reveal-step": `${step}ms`,
        } as CSSProperties
      }
    >
      {children}
    </Tag>
  );
}
