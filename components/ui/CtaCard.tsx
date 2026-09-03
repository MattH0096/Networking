import Link from "next/link";
import type { ReactNode } from "react";

import { glassPanel } from "@/components/ui/GlassSupportPanel";
import { BandCard } from "@/components/ui/BandBackdrop";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import { img } from "@/lib/images.server";

type Props = {
  children: ReactNode;
  primaryCta: string;
  primaryHref: string;
  secondaryCta: string;
  secondaryHref: string;
};

/**
 * Closing CTA — inset chassis plate (same card treatment as other bands).
 */
export function CtaCard({
  children,
  primaryCta,
  primaryHref,
  secondaryCta,
  secondaryHref,
}: Props) {
  const asset = img("band-vision");

  return (
    <section className="section-y bg-ist-bg">
      <Container>
        <Reveal variant="expand">
          <BandCard
            src={asset.src}
            width={asset.width}
            height={asset.height}
            pinLeft
            viewportClassName="min-h-[min(44svh,26rem)]"
            contentClassName="justify-center py-10 sm:py-12 lg:py-14"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50"
            />
            <div className="relative z-10 mx-auto w-full max-w-3xl text-center sm:max-w-4xl">
              {children}

              <div className="mx-auto mt-8 grid w-full max-w-xl grid-cols-1 gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-4">
                <Link
                  href={primaryHref}
                  className="btn btn--primary btn--lg !max-w-none w-full"
                >
                  {primaryCta}
                  <span aria-hidden="true">→</span>
                </Link>
                <Link
                  href={secondaryHref}
                  className={cn(
                    "btn btn--lg !max-w-none w-full",
                    glassPanel,
                    "border-white/25 text-ist-text hover:border-ist-accent hover:bg-black/35",
                  )}
                >
                  {secondaryCta}
                  <span aria-hidden="true" className="text-ist-accent-bright">
                    →
                  </span>
                </Link>
              </div>
            </div>
          </BandCard>
        </Reveal>
      </Container>
    </section>
  );
}
