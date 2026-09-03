import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type Props = {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  /** Centred headers suit full-width sections; left-aligned suits editorial. */
  align?: "left" | "center";
  /** Tighter vertical rhythm for split layouts beside imagery. */
  compact?: boolean;
  as?: "h1" | "h2";
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  lead,
  align = "left",
  compact = false,
  as: Heading = "h2",
  className,
}: Props) {
  const centered = align === "center";

  return (
    <header className={cn(centered && "flex flex-col items-center text-center", className)}>
      {eyebrow ? <p className="t-eyebrow">{eyebrow}</p> : null}
      {/* 48px accent rule above the heading — the section-header signature. */}
      <div
        aria-hidden="true"
        className={cn("h-px w-12 bg-ist-accent", compact ? "mt-3" : "mt-4")}
      />
      {/* Capped near 28 characters so a long heading breaks into balanced lines
          rather than running the full 1280px container. */}
      <Heading
        className={cn(
          Heading === "h1" ? "t-h1" : "t-h2",
          "max-w-[28ch] text-balance text-ist-text",
          compact ? "mt-4" : "mt-6",
          centered && "mx-auto",
        )}
      >
        {title}
      </Heading>
      {lead ? (
        <p className={cn("t-lead", compact ? "mt-3" : "mt-6", centered && "mx-auto")}>
          {lead}
        </p>
      ) : null}
    </header>
  );
}
