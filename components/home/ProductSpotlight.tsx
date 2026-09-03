import Image from "next/image";

import { Button } from "@/components/ui/Button";
import { ChassisFrame } from "@/components/ui/ChassisFrame";
import { Container } from "@/components/ui/Container";
import { LinkRule } from "@/components/ui/LinkRule";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { img, type ImageKey } from "@/lib/images.server";

type Props = {
  id: string;
  eyebrow: string;
  name: string;
  tagline: string;
  body: string;
  pull: string;
  pullLead: string;
  cta: string;
  href: string;
  image: ImageKey;
  alt: string;
  /** Alternates the image to the other column so the two products don't mirror. */
  flip?: boolean;
  surface?: "bg" | "surface";
};

/**
 * §9.1.6 and §9.1.7. Both products ship today, so every rule here is solid.
 * Copy is lifted verbatim from the approved product-page headers — nothing about
 * these two is paraphrased.
 */
export function ProductSpotlight({
  id,
  eyebrow,
  name,
  tagline,
  body,
  pull,
  pullLead,
  cta,
  href,
  image,
  alt,
  flip = false,
  surface = "bg",
}: Props) {
  const asset = img(image);

  return (
    <section
      id={id}
      className={`section-y ${surface === "surface" ? "bg-ist-surface" : "bg-ist-bg"}`}
    >
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-8">
          {/* Split rule: outside → in. flip swaps which column is visual-left. */}
          <Reveal
            className={flip ? "lg:order-2" : undefined}
            variant={flip ? "fromRight" : "fromLeft"}
          >
            <ChassisFrame media inert>
              <Image
                src={asset.src}
                width={asset.width}
                height={asset.height}
                alt={alt}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="h-auto w-full"
              />
            </ChassisFrame>
          </Reveal>

          <Reveal index={1} step={80} variant={flip ? "fromLeft" : "fromRight"}>
            <SectionHeader compact eyebrow={eyebrow} title={name} lead={tagline} />

            <p className="t-body mt-4 text-ist-muted">{body}</p>

            <figure className="mt-5">
              <LinkRule state="connected" tone="accent" className="max-w-12" />
              <blockquote className="mt-3">
                <p className="t-small text-ist-muted">{pullLead}</p>
                <p className="t-h3 mt-1.5 text-ist-accent">{pull}</p>
              </blockquote>
            </figure>

            <div className="mt-6">
              <Button href={href} variant="secondary" withArrow>
                {cta}
              </Button>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
