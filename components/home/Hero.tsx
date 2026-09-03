import Link from "next/link";

import { HeroBackground } from "@/components/home/HeroBackground";
import { Container } from "@/components/ui/Container";
import { CmsSupportPanel } from "@/components/ui/CmsSupportPanel";
import { glassPanel } from "@/components/ui/GlassSupportPanel";

type Props = {
  line1: string;
  line2: string;
  cta: string;
  ctaHref: string;
};

/**
 * §9.1.1 — headline + CTA, with the support line in a bottom-right panel.
 */
export function Hero({ line1, line2, cta, ctaHref }: Props) {
  return (
    <section id="home-hero" className="relative isolate flex h-svh min-h-svh items-center overflow-hidden pt-18">
      <HeroBackground />

      <Container className="relative z-10 py-24">
        <div className="mt-[100px]">
          <h1 className="t-hero text-ist-text">
            <span
              className="hero-in block whitespace-nowrap"
              style={{ "--hero-delay": "60ms" } as React.CSSProperties}
            >
              {line1}
            </span>
            <span
              className="hero-in block whitespace-nowrap"
              style={{ "--hero-delay": "160ms" } as React.CSSProperties}
            >
              {line2}
            </span>
          </h1>

          <div className="hero-in mt-12" style={{ "--hero-delay": "300ms" } as React.CSSProperties}>
            <Link
              href={ctaHref}
              className={`${glassPanel} inline-flex min-h-11 items-center gap-2.5 px-6 py-3 text-[0.95rem] font-medium text-ist-text transition-[border-color,background-color] duration-[180ms] ease-ist hover:border-ist-accent/50 hover:bg-black/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ist-focus sm:text-[1.05rem]`}
            >
              {cta}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </Container>

      <CmsSupportPanel mobile />
    </section>
  );
}
