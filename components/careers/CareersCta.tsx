import Link from "next/link";

import { glassPanel } from "@/components/ui/GlassSupportPanel";
import { BandCard } from "@/components/ui/BandBackdrop";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import { CAREERS_CTA, HIRING_BAND } from "@/lib/careers";
import { img } from "@/lib/images.server";
import { CTA } from "@/lib/site";

/**
 * Careers closing CTA — locked hiring line on the left; soft outreach panel on the right.
 */
export function CareersCta() {
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
            viewportClassName="min-h-[min(40svh,24rem)]"
            contentClassName="items-stretch py-10 sm:py-12 lg:py-10"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/55 via-black/35 to-black/50"
            />

            <div className="relative z-10 grid w-full gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(16rem,0.85fr)] lg:items-center lg:gap-10 xl:gap-8">
              {/* Left — full locked hiring line */}
              <div className="min-w-0">
                <h2 className="text-[1.2rem] font-semibold leading-[1.3] tracking-tight text-ist-text sm:text-[1.35rem] lg:text-[1.45rem]">
                  <span className="block">{HIRING_BAND.before}</span>
                  <span className="mt-0.5 block text-ist-accent-bright">{HIRING_BAND.accent}</span>
                </h2>
                <p className="mt-4 max-w-xl text-[0.95rem] leading-relaxed text-ist-muted sm:text-[1.05rem]">
                  {HIRING_BAND.after}
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
                  <Link
                    href="#open-roles"
                    className="btn btn--primary btn--lg inline-flex items-center gap-2.5"
                  >
                    {CAREERS_CTA.viewRoles}
                    <span aria-hidden="true">→</span>
                  </Link>
                  <Link
                    href="/contact"
                    className={cn(
                      glassPanel,
                      "inline-flex min-h-11 items-center gap-2.5 border-ist-accent/60 px-6 py-3 text-[0.95rem] font-medium text-ist-text transition-[border-color,background-color] duration-[180ms] ease-ist hover:border-ist-accent hover:bg-black/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ist-focus sm:px-8",
                    )}
                  >
                    {CTA.contact}
                    <span aria-hidden="true" className="text-ist-accent-bright">
                      →
                    </span>
                  </Link>
                </div>
              </div>

              {/* Right — outreach panel */}
              <aside className="border border-white/15 bg-black/45 p-6 backdrop-blur-md sm:p-7">
                <p className="text-[1.05rem] font-semibold text-ist-text sm:text-[1.15rem]">
                  {CAREERS_CTA.asideTitle}
                </p>
                <p className="mt-3 text-[0.88rem] leading-relaxed text-ist-muted">
                  {CAREERS_CTA.asideBody}
                </p>
                <Link
                  href="/contact"
                  className="mt-5 inline-flex items-center gap-2 text-[0.92rem] font-medium text-ist-accent-bright transition-colors duration-[180ms] ease-ist hover:text-ist-accent"
                >
                  {CAREERS_CTA.asideLink}
                  <span aria-hidden="true">→</span>
                </Link>
              </aside>
            </div>
          </BandCard>
        </Reveal>
      </Container>
    </section>
  );
}
