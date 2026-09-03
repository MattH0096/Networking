import type { CSSProperties } from "react";

import { cn } from "@/lib/cn";

/** Match nav dropdown over hero: light glass, not solid black. */
export const glassPanel =
  "rounded-md border border-white/15 bg-black/20 shadow-none backdrop-blur-md";

type Props = {
  className?: string;
  delay?: string;
  /** When true, also show on mobile (homepage). Interior heroes stay desktop-only. */
  mobile?: boolean;
  lines: readonly string[];
  closer: string;
};

/**
 * Support copy in a translucent bottom-right panel.
 * Desktop: all page heroes. Mobile: homepage only (`mobile`).
 */
export function GlassSupportPanel({
  className,
  delay = "400ms",
  mobile = false,
  lines,
  closer,
}: Props) {
  return (
    <aside
      aria-label="Support line"
      className={cn(
        "hero-in absolute bottom-5 right-5 z-20 max-w-[min(22rem,calc(100%-2.5rem))]",
        mobile ? "block" : "hidden md:block",
        glassPanel,
        "px-5 py-5 sm:bottom-8 sm:right-8 sm:max-w-[24rem] sm:px-6 sm:py-6",
        className,
      )}
      style={{ "--hero-delay": delay } as CSSProperties}
    >
      {lines.map((line) => (
        <p
          key={line}
          className="mt-1.5 text-[0.95rem] leading-snug text-ist-text first:mt-0 sm:text-[1.05rem]"
        >
          {line}
        </p>
      ))}
      <p className="mt-3 text-right text-[1.25rem] font-semibold tracking-tight text-ist-accent-bright sm:text-[1.4rem]">
        {closer}
      </p>
    </aside>
  );
}
