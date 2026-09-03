import type { ReactNode } from "react";

import { cn } from "@/lib/cn";
import type { NewsCategory } from "@/lib/news";

type IconProps = { className?: string; size?: number };

function Svg({
  size = 16,
  className,
  children,
}: IconProps & { children: ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("shrink-0", className)}
    >
      {children}
    </svg>
  );
}

export function NewsFilterIcon({
  name,
  size = 15,
  className,
}: {
  name: "all" | NewsCategory;
  size?: number;
  className?: string;
}) {
  switch (name) {
    case "all":
      return (
        <Svg size={size} className={className}>
          <rect x="4" y="4" width="7" height="7" />
          <rect x="13" y="4" width="7" height="7" />
          <rect x="4" y="13" width="7" height="7" />
          <rect x="13" y="13" width="7" height="7" />
        </Svg>
      );
    case "company":
      return (
        <Svg size={size} className={className}>
          <path d="M4 20V8l8-4 8 4v12" />
          <path d="M9 20v-6h6v6" />
          <path d="M9 10h.01M15 10h.01M12 10h.01" />
        </Svg>
      );
    case "partnerships":
      return (
        <Svg size={size} className={className}>
          <path d="M8 14a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" />
          <path d="M16 14a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" />
          <path d="M4.5 20c.8-2.2 2.7-3.5 5.5-3.5.8 0 1.5.1 2.2.4" />
          <path d="M19.5 20c-.8-2.2-2.7-3.5-5.5-3.5-.5 0-1 .1-1.5.2" />
        </Svg>
      );
    case "product":
      return (
        <Svg size={size} className={className}>
          <path d="M12 3 4 7.5v9L12 21l8-4.5v-9L12 3z" />
          <path d="M12 12 4 7.5M12 12l8-4.5M12 12v9" />
        </Svg>
      );
    case "media":
      return (
        <Svg size={size} className={className}>
          <rect x="3" y="6" width="18" height="12" rx="1.5" />
          <path d="M10 9.5v5l5-2.5-5-2.5z" />
        </Svg>
      );
  }
}

export function NewsCalendarIcon({ size = 14, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <rect x="3.5" y="5" width="17" height="15" rx="1.5" />
      <path d="M8 3.5V7M16 3.5V7M3.5 10h17" />
    </Svg>
  );
}

export function NewsChevronIcon({
  dir = "right",
  size = 16,
  className,
}: IconProps & { dir?: "left" | "right" }) {
  return (
    <Svg size={size} className={className}>
      {dir === "left" ? <path d="M15 6 9 12l6 6" /> : <path d="M9 6l6 6-6 6" />}
    </Svg>
  );
}

export function NewsRefreshIcon({ size = 16, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <path d="M4 12a8 8 0 0 1 13.5-5.8" />
      <path d="M20 4v5h-5" />
      <path d="M20 12a8 8 0 0 1-13.5 5.8" />
      <path d="M4 20v-5h5" />
    </Svg>
  );
}
