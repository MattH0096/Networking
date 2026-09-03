import type { Metadata } from "next";
import Image from "next/image";

import { PageHero } from "@/components/layout/PageHero";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { BandCard } from "@/components/ui/BandBackdrop";
import { Button } from "@/components/ui/Button";
import { ChassisFrame } from "@/components/ui/ChassisFrame";
import { Container } from "@/components/ui/Container";
import { LinkRule } from "@/components/ui/LinkRule";
import { Reveal } from "@/components/ui/Reveal";
import { APPLICATIONS } from "@/lib/home";
import { APPLICATIONS_CTA } from "@/lib/cta";
import { img } from "@/lib/images.server";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Applications — Built for the Missions That Matter Most",
  description: APPLICATIONS.lead,
};

/**
 * §9.5 [LOCKED] header, tiles and closer.
 *
 * The homepage shows these six as a grid. Here they get a row each, because the
 * footer deep-links to `/applications#space` and friends — an anchor should land
 * on something substantial, not on one cell of a grid.
 */
export default function ApplicationsPage() {
  const band = img("band-one-platform");

  return (
    <>
      <PageHero
        eyebrow="Applications"
        title={APPLICATIONS.headingLines}
        lead={APPLICATIONS.lead}
        video={["/video/applications-1.mp4", "/video/applications-2.mp4"]}
      />

      <div className="bg-ist-bg">
        {APPLICATIONS.tiles.map((tile, i) => {
          const asset = img(tile.image);
          // Alternate sides so the eye zig-zags down the page instead of
          // scanning one rigid column of images.
          const imageFirst = i % 2 === 0;

          return (
            <section
              key={tile.id}
              id={tile.id}
              // Offset for the sticky header so an anchored heading isn't hidden.
              className="scroll-mt-18 border-b border-ist-line last:border-b-0"
            >
              <Container className="section-y-sm">
                <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                  <Reveal
                    className={cn(!imageFirst && "lg:order-2")}
                    variant={imageFirst ? "fromLeft" : "fromRight"}
                  >
                    <ChassisFrame media inert>
                      <Image
                        src={asset.src}
                        width={asset.width}
                        height={asset.height}
                        alt={tile.alt}
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="aspect-[4/3] w-full object-cover"
                      />
                    </ChassisFrame>
                  </Reveal>

                  <Reveal index={1} step={80} variant={imageFirst ? "fromRight" : "fromLeft"}>
                    <p className="t-tag text-ist-dim">{`0${i + 1}`}</p>
                    <LinkRule state="connected" tone="accent" className="mt-4 max-w-12" />
                    <h2 className="t-h2 mt-8 text-balance text-ist-text">{tile.label}</h2>
                    <p className="t-lead mt-6">{tile.line}</p>
                  </Reveal>
                </div>
              </Container>
            </section>
          );
        })}
      </div>

      <section
        className="section-y bg-ist-bg pt-0"
        aria-label={APPLICATIONS.closer.heading}
      >
        <Container>
          <Reveal variant="expand">
            <BandCard
              src={band.src}
              width={band.width}
              height={band.height}
              pinLeft
              viewportClassName="min-h-[min(42svh,24rem)]"
              contentClassName="justify-center py-10 sm:py-12 lg:py-14"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50"
              />
              <div className="relative z-10 mx-auto w-full max-w-2xl text-center sm:max-w-3xl">
                <h2 className="t-h2 text-balance text-ist-text">{APPLICATIONS.closer.heading}</h2>
                <p className="t-body mx-auto mt-5 max-w-2xl text-pretty text-ist-text/90">
                  {APPLICATIONS.closer.body}
                </p>
                <div className="mt-8 flex justify-center">
                  <Button href={APPLICATIONS.closer.href} variant="secondary" withArrow>
                    {APPLICATIONS.closer.cta}
                  </Button>
                </div>
              </div>
            </BandCard>
          </Reveal>
        </Container>
      </section>

      <ClosingCta copy={APPLICATIONS_CTA} />
    </>
  );
}
