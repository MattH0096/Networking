import Image from "next/image";
import type { ReactNode } from "react";

import { CmsSupportPanel } from "@/components/ui/CmsSupportPanel";
import { HeroVideoBackground } from "@/components/ui/HeroVideoBackground";
import { Container } from "@/components/ui/Container";
import { img, type ImageKey } from "@/lib/images.server";

type Props = {
  eyebrow?: string;
  /** Plain string, line breaks as separate entries, or custom React nodes. */
  title: string | readonly string[] | ReactNode;
  /** Optional line directly under the title, before `lead`. */
  leadIntro?: string;
  lead?: string;
  image?: ImageKey;
  /** One clip, or several that cycle like the homepage hero. */
  video?: string | readonly string[];
  alt?: string;
  /** Which side of the plate to keep in frame on small screens. */
  mobileFocus?: "left" | "right" | "center";
};

function TitleLines({ title }: { title: string | readonly string[] | ReactNode }) {
  if (typeof title === "string") {
    return <span className="block">{title}</span>;
  }
  if (Array.isArray(title) && title.every((line) => typeof line === "string")) {
    return (title as readonly string[]).map((line) => (
      <span key={line} className="block">
        {line}
      </span>
    ));
  }
  return title;
}

/**
 * Interior page hero — locked to one viewport (`h-svh`), same `t-hero` display
 * type as the homepage; support panel on desktop only.
 */
export function PageHero({
  eyebrow,
  title,
  leadIntro,
  lead,
  image,
  video,
  alt = "",
  mobileFocus = "left",
}: Props) {
  const asset = image ? img(image) : null;
  const clips = video == null ? null : typeof video === "string" ? [video] : [...video];
  const mobileObject =
    mobileFocus === "right"
      ? "object-[80%_center] md:object-center"
      : mobileFocus === "center"
        ? "object-center"
        : "object-left md:object-center";

  return (
    <section className="relative isolate flex h-svh min-h-svh items-center overflow-hidden pt-18">
      {clips ? (
        <HeroVideoBackground sources={clips} rate={0.7} />
      ) : asset ? (
        <div className="absolute inset-0 -z-10 overflow-hidden bg-ist-bg">
          <Image
            src={asset.src}
            width={asset.width}
            height={asset.height}
            alt={alt}
            priority
            sizes="100vw"
            className={`h-full w-full object-cover ${mobileObject}`}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[min(48%,22rem)] bg-gradient-to-t from-ist-bg from-[12%] via-ist-bg/80 via-[45%] to-transparent"
          />
        </div>
      ) : (
        <div className="absolute inset-0 -z-10 bg-ist-bg" aria-hidden="true" />
      )}

      <Container className="relative z-10 py-24">
        <div className="mt-[100px]">
          {eyebrow ? <p className="t-eyebrow hero-in">{eyebrow}</p> : null}
          {eyebrow ? (
            <div aria-hidden="true" className="hero-in mt-4 h-px w-12 bg-ist-accent" />
          ) : null}
          <h1
            className={`t-hero hero-in text-ist-text ${eyebrow ? "mt-6" : ""}`}
            style={{ "--hero-delay": "120ms" } as React.CSSProperties}
          >
            <TitleLines title={title} />
          </h1>
          {leadIntro ? (
            <p
              className="t-lead hero-in mt-8 max-w-3xl font-medium text-ist-text"
              style={{ "--hero-delay": "200ms" } as React.CSSProperties}
            >
              {leadIntro}
            </p>
          ) : null}
          {lead ? (
            <p
              className={`t-lead hero-in max-w-3xl ${leadIntro ? "mt-4" : "mt-8"}`}
              style={{ "--hero-delay": "240ms" } as React.CSSProperties}
            >
              {lead}
            </p>
          ) : null}
        </div>
      </Container>

      <CmsSupportPanel />
    </section>
  );
}
