"use client";

import type { CSSProperties } from "react";

import { cn } from "@/lib/cn";
import { COMPANY_NAME } from "@/lib/site";

type Props = {
  mode?: "route";
  className?: string;
};

/**
 * Cinematic loader: light filaments + energy fill the exact IST lockup mask,
 * then the official logo settles. Same mark as nav/footer (`/img/logo.png`).
 */
export function LogoStream({ mode = "route", className }: Props) {
  return (
    <div
      className={cn("logo-stream", mode === "route" && "logo-stream--route", className)}
      aria-hidden="true"
    >
      <div className="logo-stream__aura" />
      <div className="logo-stream__ring" />

      <div className="logo-stream__stage">
        <span className="logo-stream__filament logo-stream__filament--1" />
        <span className="logo-stream__filament logo-stream__filament--2" />
        <span className="logo-stream__filament logo-stream__filament--3" />

        <div className="logo-stream__energy" />
        <div className="logo-stream__rim" />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="logo-stream__lockup"
          src="/img/logo.png"
          alt={COMPANY_NAME}
          width={1240}
          height={262}
          decoding="async"
        />
      </div>

      <div className="logo-stream__sparks" aria-hidden="true">
        {Array.from({ length: 12 }, (_, i) => (
          <span
            key={i}
            className="logo-stream__spark"
            style={{ "--i": String(i) } as CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}
