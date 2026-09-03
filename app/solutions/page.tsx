import type { Metadata } from "next";
import Image from "next/image";

import { PageHero } from "@/components/layout/PageHero";
import { MissingLayer } from "@/components/solutions/MissingLayer";
import { SolutionsCta } from "@/components/solutions/SolutionsCta";
import { SolutionsFullStack } from "@/components/solutions/SolutionsFullStack";
import { Button } from "@/components/ui/Button";
import { ChassisFrame } from "@/components/ui/ChassisFrame";
import { Container } from "@/components/ui/Container";
import { LinkRule } from "@/components/ui/LinkRule";
import { Reveal } from "@/components/ui/Reveal";
import { getSiteContent } from "@/lib/cms/content";
import { cn } from "@/lib/cn";
import { img } from "@/lib/images.server";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return {
    title: "Solutions — Built for Dynamic, Intermittent Networks",
    description: content.solutions.lead,
  };
}

export default async function SolutionsPage() {
  const content = await getSiteContent();
  const s = content.solutions;

  return (
    <>
      <PageHero
        eyebrow={s.eyebrow}
        title={[s.titleLine1, s.titleLine2]}
        lead={s.lead}
        video="/video/solutions.mp4"
      />

      <MissingLayer content={s} />

      <section className="section-y bg-ist-surface">
        <Container>
          <ul className="flex flex-col gap-10 lg:gap-8">
            {s.columns.map((column, i) => {
              const shipping = column.status === "current";
              const asset = img(column.image);
              const imageFirst = i % 2 === 0;

              return (
                <Reveal as="li" key={column.title} index={i} step={100} variant="rise">
                  <ChassisFrame
                    media
                    standby={!shipping}
                    className="group"
                    viewportClassName="grid overflow-hidden lg:grid-cols-2"
                  >
                    <div
                      className={cn(
                        "relative min-h-[14rem] bg-black sm:min-h-[18rem] lg:min-h-[22rem]",
                        !imageFirst && "lg:order-2",
                      )}
                    >
                      <Image
                        src={asset.src}
                        width={asset.width}
                        height={asset.height}
                        alt={column.alt}
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    </div>

                    <div
                      className={cn(
                        "flex flex-col justify-center px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12",
                        !imageFirst && "lg:order-1",
                      )}
                    >
                      <p className="t-tag text-ist-dim">{column.eyebrow}</p>

                      <LinkRule
                        state={shipping ? "connected" : "intermittent"}
                        tone={shipping ? "accent" : "line"}
                        resolveOnHover={!shipping}
                        className="mt-5 max-w-12"
                      />

                      <h2 className="t-h3 mt-6 text-balance text-ist-text sm:mt-8">
                        {column.title}
                      </h2>
                      <p className="t-body mt-4 text-ist-muted">{column.body}</p>

                      <div className="mt-8">
                        {column.href && column.cta ? (
                          <Button href={column.href} variant="secondary" withArrow>
                            {column.cta}
                          </Button>
                        ) : (
                          <p className="t-tag text-ist-dim">{s.hardwareNote}</p>
                        )}
                      </div>
                    </div>
                  </ChassisFrame>
                </Reveal>
              );
            })}
          </ul>
        </Container>
      </section>

      <SolutionsFullStack content={s} />
      <SolutionsCta content={s} />
    </>
  );
}
