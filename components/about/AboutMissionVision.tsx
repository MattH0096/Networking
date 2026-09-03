import Image from "next/image";

import { ChassisFrame } from "@/components/ui/ChassisFrame";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import type { SiteContent } from "@/lib/cms/content";
import { cn } from "@/lib/cn";
import { img, type ImageKey } from "@/lib/images.server";

type Props = {
  content: SiteContent["about"];
};

/**
 * Our Mission / Our Vision — text|image then image|text.
 * Wider image; black edge gradient into the copy (no blur).
 */
export function AboutMissionVision({ content }: Props) {
  return (
    <section className="section-y bg-ist-bg pt-0">
      <Container>
        <ul className="flex flex-col gap-5 lg:gap-6">
          {content.cards.map((card, i) => {
            const asset = img(card.image as ImageKey);
            const imageFirst = i % 2 === 1;

            return (
              <Reveal as="li" key={card.id} index={i}>
                <ChassisFrame media className="group" viewportClassName="overflow-hidden bg-black">
                  <div
                    className={cn(
                      "grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] lg:items-stretch",
                      imageFirst && "lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.9fr)]",
                    )}
                  >
                    <div
                      className={cn(
                        "relative z-10 flex flex-col justify-center bg-black px-6 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-10",
                        imageFirst && "lg:order-2",
                      )}
                    >
                      <p className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.14em] text-ist-accent-bright">
                        {card.title}
                      </p>
                      <p className="mt-4 max-w-lg text-[1.3rem] font-semibold leading-snug tracking-tight text-ist-text sm:text-[1.5rem] lg:text-[1.65rem]">
                        {card.body}
                      </p>
                    </div>

                    <div
                      className={cn(
                        "relative min-h-[16rem] sm:min-h-[20rem] lg:min-h-[26rem]",
                        imageFirst && "lg:order-1",
                      )}
                    >
                      <Image
                        src={asset.src}
                        width={asset.width}
                        height={asset.height}
                        alt=""
                        sizes="(min-width: 1024px) 58vw, 100vw"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      {/* Black edge gradient toward the text column */}
                      <div
                        aria-hidden="true"
                        className={cn(
                          "pointer-events-none absolute inset-y-0 w-[42%] from-black via-black/75 to-transparent",
                          imageFirst
                            ? "right-0 bg-gradient-to-l"
                            : "left-0 bg-gradient-to-r",
                        )}
                      />
                    </div>
                  </div>
                </ChassisFrame>
              </Reveal>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
