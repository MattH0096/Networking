"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/cn";

type Props = {
  className?: string;
  /** Soften when sitting over video/photo heroes. */
  overMedia?: boolean;
};

type Star = {
  id: number;
  left: string;
  top: string;
  size: number;
  delay: string;
  duration: string;
  depth: 1 | 2 | 3;
  drift?: string;
};

type Streak = {
  id: number;
  left: string;
  top: string;
  delay: string;
  duration: string;
  length: number;
};

/** Deterministic PRNG so SSR and client match. */
function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildStars(
  count: number,
  seed: number,
  sizeMin: number,
  sizeMax: number,
  depth: 1 | 2 | 3,
): Star[] {
  const rand = mulberry32(seed);
  const stars: Star[] = [];
  for (let i = 0; i < count; i++) {
    const size = sizeMin + rand() * (sizeMax - sizeMin);
    stars.push({
      id: seed * 1000 + i,
      left: `${(rand() * 100).toFixed(2)}%`,
      top: `${(rand() * 100).toFixed(2)}%`,
      size: Number(size.toFixed(2)),
      delay: `${(rand() * 12).toFixed(2)}s`,
      duration: `${(5 + rand() * 7).toFixed(2)}s`,
      depth,
      drift: `${((rand() - 0.5) * 12).toFixed(1)}px`,
    });
  }
  return stars;
}

const STREAKS: Streak[] = [
  { id: 1, left: "22%", top: "-10%", delay: "6s", duration: "26s", length: 170 },
  { id: 2, left: "68%", top: "-8%", delay: "18s", duration: "32s", length: 150 },
];

/**
 * Depth parallax against Lenis-smoothed scroll.
 * Ease is soft so layers glide with the page rather than snap or overshoot.
 */
const LAYER = {
  far: { factor: -0.03, ease: 0.08 },
  mid: { factor: -0.06, ease: 0.1 },
  near: { factor: -0.1, ease: 0.12 },
  nebula: { factor: -0.02, ease: 0.07 },
} as const;

/**
 * Deep-space body field — nebula volume, star layers, rare streams.
 */
export function AerospaceField({ className, overMedia = false }: Props) {
  const [reduceMotion, setReduceMotion] = useState(false);

  const farRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);
  const nearRef = useRef<HTMLDivElement>(null);
  const nebulaRef = useRef<HTMLDivElement>(null);

  const dust = useMemo(() => buildStars(45, 11, 1.2, 2.4, 3), []);
  const mid = useMemo(() => buildStars(18, 29, 2.8, 4.5, 2), []);
  const near = useMemo(() => buildStars(7, 47, 5.5, 9, 1), []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduceMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;

    let yFar = 0;
    let yMid = 0;
    let yNear = 0;
    let yNebula = 0;
    let frame = 0;
    let running = true;

    const tick = () => {
      if (!running) return;

      const scrollY = window.scrollY;
      const tFar = scrollY * LAYER.far.factor;
      const tMid = scrollY * LAYER.mid.factor;
      const tNear = scrollY * LAYER.near.factor;
      const tNebula = scrollY * LAYER.nebula.factor;

      yFar += (tFar - yFar) * LAYER.far.ease;
      yMid += (tMid - yMid) * LAYER.mid.ease;
      yNear += (tNear - yNear) * LAYER.near.ease;
      yNebula += (tNebula - yNebula) * LAYER.nebula.ease;

      if (farRef.current) {
        farRef.current.style.transform = `translate3d(0, ${yFar.toFixed(2)}px, 0)`;
      }
      if (midRef.current) {
        midRef.current.style.transform = `translate3d(0, ${yMid.toFixed(2)}px, 0)`;
      }
      if (nearRef.current) {
        nearRef.current.style.transform = `translate3d(0, ${yNear.toFixed(2)}px, 0)`;
      }
      if (nebulaRef.current) {
        nebulaRef.current.style.transform = `translate3d(0, ${yNebula.toFixed(2)}px, 0)`;
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
    };
  }, [reduceMotion]);

  return (
    <div
      aria-hidden="true"
      className={cn(
        "aerospace-field pointer-events-none overflow-hidden",
        overMedia && "aerospace-field--over-media",
        reduceMotion && "aerospace-field--static",
        className,
      )}
    >
      <div className="aerospace-field__void" />

      <div ref={nebulaRef} className="aerospace-field__nebulae">
        <div className="aerospace-field__nebula aerospace-field__nebula--a" />
        <div className="aerospace-field__nebula aerospace-field__nebula--b" />
        <div className="aerospace-field__nebula aerospace-field__nebula--c" />
      </div>

      <div className="aerospace-field__grain" />

      <div ref={farRef} className="aerospace-field__layer">
        {dust.map((star) => (
          <span
            key={star.id}
            className="aerospace-field__star aerospace-field__star--dust"
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              animationDelay: star.delay,
              animationDuration: star.duration,
            }}
          />
        ))}
      </div>

      <div ref={midRef} className="aerospace-field__layer">
        {mid.map((star) => (
          <span
            key={star.id}
            className="aerospace-field__star aerospace-field__star--mid"
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              animationDelay: star.delay,
              animationDuration: star.duration,
            }}
          />
        ))}
      </div>

      <div ref={nearRef} className="aerospace-field__layer">
        {near.map((star) => (
          <span
            key={star.id}
            className="aerospace-field__star aerospace-field__star--near"
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              animationDelay: star.delay,
              animationDuration: star.duration,
              ["--star-drift" as string]: star.drift,
            }}
          />
        ))}
      </div>

      <div className="aerospace-field__streaks">
        {STREAKS.map((streak) => (
          <span
            key={streak.id}
            className="aerospace-field__streak"
            style={{
              left: streak.left,
              top: streak.top,
              width: streak.length,
              animationDelay: streak.delay,
              animationDuration: streak.duration,
            }}
          />
        ))}
      </div>
    </div>
  );
}
