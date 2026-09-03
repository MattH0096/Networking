"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type Props = {
  /**
   * Fraction of the section's own height the layer travels across a full pass
   * through the viewport. 0.2 gives ±10%, which the layer's 12% bleed covers.
   */
  travel?: number;
  children: ReactNode;
  className?: string;
};

/**
 * Moves a background layer at a fraction of scroll speed.
 *
 * Drives `transform` only — never `background-position` — and reads scroll
 * position inside a rAF callback so a fast scroll can't queue up layout work.
 * Does nothing at all when the visitor asks for reduced motion.
 */
export function Parallax({ travel = 0.2, children, className }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    const section = node?.parentElement;
    if (!node || !section) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const viewport = window.innerHeight;

      // −0.5 when the section sits just below the fold, +0.5 once it has passed
      // above it, 0 when centred.
      const progress =
        (rect.top + rect.height / 2 - viewport / 2) / (viewport + rect.height);

      node.style.transform = `translate3d(0, ${(progress * travel * rect.height).toFixed(1)}px, 0)`;
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [travel]);

  return (
    <div ref={ref} className={cn("parallax-layer", className)}>
      {children}
    </div>
  );
}
