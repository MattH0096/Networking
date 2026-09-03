"use client";

import { HeroVideoBackground } from "@/components/ui/HeroVideoBackground";

const HERO_VIDEOS = [
  "/video/homepage-1.mp4",
  "/video/homepage-2.mp4",
  "/video/homepage-3.mp4",
] as const;

/**
 * Homepage hero background — cycles three homepage clips at 0.7×.
 */
export function HeroBackground() {
  return <HeroVideoBackground sources={HERO_VIDEOS} rate={0.7} />;
}
