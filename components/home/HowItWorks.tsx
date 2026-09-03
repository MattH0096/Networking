import Image from "next/image";

import { PsIcon } from "@/components/icons/ProblemSolutionIcons";
import { ChassisFrame } from "@/components/ui/ChassisFrame";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import type { SiteContent } from "@/lib/cms/content";
import { img, type ImageKey } from "@/lib/images.server";

type Props = {
  title: string;
  steps: SiteContent["home"]["howItWorksSteps"];
};

/**
 * §9.1.5 — card grid: one-by-one rise.
 */
export function HowItWorks({ title, steps }: Props) {
  return (
    <section id="how-it-works" className="section-y bg-ist-bg">
      <Container>
        <Reveal variant="expand">
          <header className="text-center">
            <h2 className="t-h2 text-ist-text">{title}</h2>
          </header>
        </Reveal>

        <ol className="mt-10 grid grid-cols-1 gap-10 sm:mt-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-10">
          {steps.map((step, i) => {
            const asset = img(step.image as ImageKey);

            return (
              <li key={step.key} className="min-w-0">
                <Reveal
                  index={i}
                  step={140}
                  variant="rise"
                  className="flex flex-col items-center text-center"
                >
                  <ChassisFrame media className="w-full" viewportClassName="relative aspect-[3/2]">
                    <Image
                      src={asset.src}
                      width={asset.width}
                      height={asset.height}
                      alt={step.alt}
                      sizes="(min-width: 1024px) 22vw, (min-width: 640px) 50vw, 100vw"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center text-ist-accent-bright"
                    >
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black/55 ring-1 ring-ist-accent/40 backdrop-blur-[2px] sm:h-14 sm:w-14">
                        <PsIcon name="mark" size={30} />
                      </span>
                    </span>
                  </ChassisFrame>

                  <h3 className="mt-5 text-[0.95rem] font-semibold leading-snug text-ist-accent-bright sm:text-base">
                    {step.n}. {step.label}
                  </h3>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
