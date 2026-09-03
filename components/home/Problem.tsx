import Image from "next/image";

import { PsIcon } from "@/components/icons/ProblemSolutionIcons";
import { ChassisFrame } from "@/components/ui/ChassisFrame";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import type { SiteContent } from "@/lib/cms/content";
import { img } from "@/lib/images.server";

type Props = {
  content: Pick<
    SiteContent["home"],
    | "problemEyebrow"
    | "problemHeading1"
    | "problemHeading2"
    | "problemConditions"
    | "problemCloser"
  >;
};

/**
 * §9.1.3 — Problem. Split: outside → in. Condition lines: one-by-one rise.
 */
export function Problem({ content }: Props) {
  const asset = img("section-problem");

  return (
    <section id="problem" className="section-y bg-ist-bg">
      <Container>
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-10">
          <div className="min-w-0">
            <Reveal variant="fromLeft">
              <p className="t-eyebrow flex items-center gap-2.5 text-ist-accent-bright">
                <PsIcon name="mark" size={18} className="shrink-0 text-ist-accent-bright" />
                {content.problemEyebrow}
              </p>
              <h2 className="ps-heading mt-5 text-ist-text">
                <span className="block">{content.problemHeading1}</span>
                <span className="block">{content.problemHeading2}</span>
              </h2>
            </Reveal>

            <ul className="mt-10 grid grid-cols-1 gap-y-5 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-8">
              {content.problemConditions.map((item, i) => (
                <Reveal key={`${item.line}-${i}`} as="li" index={i} step={100} variant="rise">
                  <div className="flex items-start gap-2.5 sm:gap-3">
                    <PsIcon
                      name={item.icon}
                      size={36}
                      className="mt-0.5 shrink-0 text-ist-accent-bright"
                    />
                    <p className="text-[0.9rem] leading-snug text-ist-text sm:text-[0.95rem]">
                      {item.line}
                    </p>
                  </div>
                </Reveal>
              ))}
            </ul>

            <Reveal className="mt-8 sm:mt-10" index={4} step={80} variant="rise">
              <p className="max-w-xl text-[0.95rem] leading-relaxed text-ist-muted sm:text-base">
                {content.problemCloser}
              </p>
            </Reveal>
          </div>

          <Reveal index={1} step={80} variant="fromRight">
            <ChassisFrame media inert>
              <Image
                src={asset.src}
                width={asset.width}
                height={asset.height}
                alt="Satellite, drone, ship and ground vehicle across mountains and sea — links strained by terrain and distance."
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="h-auto w-full"
              />
            </ChassisFrame>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
