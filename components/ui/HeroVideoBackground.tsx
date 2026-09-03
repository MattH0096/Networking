"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/cn";

type Props = {
  /** One or more clips; multiple sources cycle in order. */
  sources: readonly string[];
  rate?: number;
  className?: string;
  /** Soft black fade into the page at the bottom edge. Default on. */
  fadeBottom?: boolean;
};

/**
 * Full-bleed muted hero video. No still poster — page base colour until play.
 * Bottom edge dissolves into site black so the cut into the next section is soft.
 */
export function HeroVideoBackground({
  sources,
  rate = 0.7,
  className,
  fadeBottom = true,
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [index, setIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduceMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const applyRate = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = true;
    el.defaultMuted = true;
    el.volume = 0;
    el.playbackRate = rate;
    el.defaultPlaybackRate = rate;
  }, [rate]);

  useEffect(() => {
    if (reduceMotion) return;
    const el = videoRef.current;
    if (!el) return;

    const src = sources[index] ?? sources[0];
    if (!src) return;
    el.muted = true;
    el.defaultMuted = true;
    el.volume = 0;
    el.src = src;
    el.load();
    applyRate();

    const start = el.play();
    if (start) {
      start.catch(() => {
        /* Autoplay can be blocked; hero stays on the page base colour. */
      });
    }
  }, [index, reduceMotion, applyRate, sources]);

  if (reduceMotion) {
    return <div className={cn("absolute inset-0 -z-10 bg-ist-bg", className)} aria-hidden="true" />;
  }

  const multi = sources.length > 1;

  return (
    <div className={cn("absolute inset-0 -z-10 overflow-hidden bg-ist-bg", className)} aria-hidden="true">
      <video
        ref={videoRef}
        className="h-full w-full object-cover object-center"
        muted
        playsInline
        autoPlay
        loop={!multi}
        preload="auto"
        onEnded={() => {
          if (multi) setIndex((i) => (i + 1) % sources.length);
        }}
        onLoadedData={applyRate}
        onPlay={applyRate}
        onVolumeChange={() => {
          const el = videoRef.current;
          if (!el) return;
          if (!el.muted || el.volume > 0) {
            el.muted = true;
            el.volume = 0;
          }
        }}
        onRateChange={applyRate}
      />
      {fadeBottom ? (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[min(48%,22rem)] bg-gradient-to-t from-ist-bg from-[12%] via-ist-bg/80 via-[45%] to-transparent"
        />
      ) : null}
    </div>
  );
}
