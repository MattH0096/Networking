import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/cn";

type BackdropProps = {
  src: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  /** Prefer subject on the left when the plate crops (mobile heroes/bands). */
  pinLeft?: boolean;
  /** Prefer subject on the right when the plate crops (mobile). */
  pinRight?: boolean;
  /** Grey idle → full color when the parent `.group` is hovered. */
  greyscale?: boolean;
  /**
   * `bleed` — full-viewport bands: blur sides dissolve into page black.
   * `soft` — frameless inset plates: black + blur side rails, no chassis.
   * `card` — inside a chassis frame (subtler rails).
   */
  mode?: "bleed" | "soft" | "card";
};

const pinLeftClass = "object-left max-md:object-left md:object-center";
/** Soft right bias — not flush to the edge (avoids over-cropping). */
const pinRightClass = "object-[80%_center] max-md:object-[80%_center] md:object-center";

/**
 * Image plate with soft left/right blur. Used under BandCard or full-bleed CTAs.
 */
export function BandBackdrop({
  src,
  width,
  height,
  priority = false,
  className,
  mode = "bleed",
  pinLeft = false,
  pinRight = false,
  greyscale = false,
}: BackdropProps) {
  const useFill = width == null || height == null;
  const sizes = mode === "bleed" ? "100vw" : "(min-width: 1280px) 1280px, 100vw";
  const fadeClass =
    mode === "soft"
      ? "band-backdrop__fade--soft"
      : mode === "card"
        ? "band-backdrop__fade--card"
        : "band-backdrop__fade";
  const sharpClass =
    mode === "soft" ? "band-backdrop__sharp--soft" : "band-backdrop__sharp";
  const objectPos = pinRight
    ? pinRightClass
    : pinLeft
      ? pinLeftClass
      : "object-center";

  return (
    <div
      className={cn(
        "absolute inset-0 -z-10 overflow-hidden bg-ist-bg",
        greyscale && "band-backdrop--greyscale",
        className,
      )}
      aria-hidden="true"
      data-mode={mode}
    >
      {useFill ? (
        <Image
          src={src}
          alt=""
          fill
          sizes={sizes}
          priority={priority}
          className={cn("scale-110 object-cover blur-2xl", objectPos)}
        />
      ) : (
        <Image
          src={src}
          alt=""
          width={width}
          height={height}
          sizes={sizes}
          priority={priority}
          className={cn(
            "absolute inset-0 h-full w-full scale-110 object-cover blur-2xl",
            objectPos,
          )}
        />
      )}

      <div className={cn(sharpClass, "absolute inset-0")}>
        {useFill ? (
          <Image
            src={src}
            alt=""
            fill
            sizes={sizes}
            priority={priority}
            className={cn("object-cover", objectPos)}
          />
        ) : (
          <Image
            src={src}
            alt=""
            width={width}
            height={height}
            sizes={sizes}
            priority={priority}
            className={cn("absolute inset-0 h-full w-full object-cover", objectPos)}
          />
        )}
      </div>

      <div className={cn("pointer-events-none absolute inset-0", fadeClass)} />
    </div>
  );
}

type CardProps = {
  src: string;
  width: number;
  height: number;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  viewportClassName?: string;
  natural?: boolean;
  framed?: boolean;
  /**
   * Image left / solid content right — One Platform + Vision CTA.
   * Used on all breakpoints so mobile keeps the split, not a text overlay.
   */
  split?: boolean;
  /** Bias crop toward the left on small screens. */
  pinLeft?: boolean;
  /** Bias crop toward the right on small screens. */
  pinRight?: boolean;
};

/**
 * Inset story/CTA band: full image plate, optional chassis, or image|copy split.
 */
export function BandCard({
  src,
  width,
  height,
  children,
  className,
  contentClassName,
  viewportClassName,
  natural = false,
  framed = true,
  split = false,
  pinLeft = false,
  pinRight = false,
}: CardProps) {
  const objectPos = pinRight
    ? pinRightClass
    : pinLeft
      ? pinLeftClass
      : "object-center";

  if (split) {
    return (
      <div
        className={cn(
          "band-card--split group relative isolate grid w-full overflow-hidden bg-black",
          "grid-cols-2",
          className,
        )}
      >
        <div
          className={cn(
            "relative min-h-[16rem] sm:min-h-[18rem] lg:min-h-[min(42svh,22rem)]",
            viewportClassName,
          )}
        >
          <Image
            src={src}
            alt=""
            width={width}
            height={height}
            sizes="(min-width: 1024px) 50vw, 50vw"
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-[filter] duration-500 ease-ist",
              "grayscale group-hover:grayscale-0",
              objectPos,
            )}
          />
        </div>
        <div
          className={cn(
            "relative z-10 flex min-w-0 flex-col justify-center bg-black",
            "px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12",
            contentClassName,
          )}
        >
          {children}
        </div>
      </div>
    );
  }

  const fluid = !framed || natural;

  return (
    <div
      className={cn(
        "relative isolate w-full overflow-hidden",
        framed && "chassis chassis--media chassis--inert",
        !framed && "band-card--frameless bg-black",
        fluid && "band-card--fluid",
        className,
      )}
      style={
        fluid
          ? ({ "--band-ar": `${width} / ${height}` } as CSSProperties)
          : undefined
      }
    >
      <div
        className={cn(
          "band-card__viewport relative flex w-full overflow-hidden",
          framed && "chassis__viewport",
          fluid ? "band-card__viewport--fluid" : (viewportClassName ?? "min-h-[min(44svh,26rem)]"),
          fluid ? viewportClassName : null,
        )}
      >
        {fluid ? <div aria-hidden="true" className="band-card__sizer" /> : null}

        {framed ? (
          <Image
            src={src}
            alt=""
            width={width}
            height={height}
            sizes="(min-width: 1280px) 1280px, 100vw"
            className={cn(
              "absolute inset-0 -z-10 h-full w-full object-cover",
              objectPos,
            )}
          />
        ) : (
          <BandBackdrop
            src={src}
            width={width}
            height={height}
            mode="soft"
            pinLeft={pinLeft}
            pinRight={pinRight}
          />
        )}
        <div
          className={cn(
            "band-card__content relative z-10 flex w-full min-w-0 flex-col px-5 sm:px-8 lg:px-10",
            contentClassName ?? "justify-center py-8 sm:py-10 lg:py-10",
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
