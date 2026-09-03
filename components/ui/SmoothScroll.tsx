"use client";

import { ReactLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import "lenis/dist/lenis.css";

type Props = {
  children: ReactNode;
};

/**
 * Sitewide smooth scroll (Lenis). Disabled on /admin — the admin shell is a
 * fixed overflow panel, and Lenis would eat wheel events meant for that panel.
 */
export function SmoothScroll({ children }: Props) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{
        autoRaf: true,
        // Soft delay like https://julianscott.vercel.app — low lerp = more glide
        lerp: 0.075,
        smoothWheel: true,
        syncTouch: false,
        wheelMultiplier: 0.92,
        touchMultiplier: 1.15,
        autoToggle: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
