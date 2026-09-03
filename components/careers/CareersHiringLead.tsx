import { BandCard } from "@/components/ui/BandBackdrop";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { CAREERS } from "@/lib/careers";
import { img } from "@/lib/images.server";

/**
 * Locked hiring line — first band under the hero, Career.png plate.
 */
export function CareersHiringLead() {
  const asset = img("band-careers-lead");

  return (
    <section className="section-y bg-ist-bg">
      <Container>
        <Reveal variant="expand">
          <BandCard
            src={asset.src}
            width={asset.width}
            height={asset.height}
            pinLeft
            viewportClassName="min-h-[min(38svh,22rem)]"
            contentClassName="justify-center py-10 sm:py-12 lg:py-12"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/55"
            />
            <div className="relative z-10 mx-auto max-w-[46rem] px-4 text-center">
              <div
                aria-hidden="true"
                className="mx-auto h-0.5 w-10 bg-ist-accent sm:w-12"
              />
              <p className="mt-8 text-[1.05rem] font-medium leading-[1.55] tracking-tight text-pretty text-ist-text sm:mt-10 sm:text-[1.2rem] sm:leading-[1.6] lg:text-[1.3rem]">
                {CAREERS.hiringLine}
              </p>
            </div>
          </BandCard>
        </Reveal>
      </Container>
    </section>
  );
}
