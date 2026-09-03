import { ApplicationTile } from "@/components/ui/ApplicationTile";
import { BandCard } from "@/components/ui/BandBackdrop";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { SiteContent } from "@/lib/cms/content";
import { img, type ImageKey } from "@/lib/images.server";

type Props = {
  content: Pick<
    SiteContent["home"],
    | "applicationsEyebrow"
    | "applicationsHeading"
    | "applicationsLead"
    | "applicationsTiles"
    | "applicationsCloserHeading"
    | "applicationsCloserBody"
    | "applicationsCloserCta"
    | "applicationsCloserHref"
  >;
};

/** §9.1.8 and §9.5 — tile grid; closer as inset chassis plate. */
export function Applications({ content }: Props) {
  const band = img("band-one-platform");

  return (
    <>
      <section id="applications" className="section-y bg-ist-bg">
        <Container>
          <Reveal variant="expand">
            <SectionHeader
              eyebrow={content.applicationsEyebrow}
              title={content.applicationsHeading}
              lead={content.applicationsLead}
            />
          </Reveal>

          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {content.applicationsTiles.map((tile, i) => (
              <Reveal key={tile.id} as="li" index={i} step={110} variant="rise">
                <ApplicationTile
                  label={tile.label}
                  line={tile.line}
                  image={tile.image as ImageKey}
                  alt={tile.alt}
                  href={`/applications#${tile.id}`}
                  className="h-full"
                />
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <section
        className="section-y bg-ist-bg pt-0"
        aria-label={content.applicationsCloserHeading}
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
                <h3 className="t-h2 text-balance text-ist-text">
                  {content.applicationsCloserHeading}
                </h3>
                <p className="t-body mx-auto mt-5 max-w-2xl text-pretty text-ist-text/90">
                  {content.applicationsCloserBody}
                </p>
                <div className="mt-8 flex justify-center">
                  <Button href={content.applicationsCloserHref} variant="secondary" withArrow>
                    {content.applicationsCloserCta}
                  </Button>
                </div>
              </div>
            </BandCard>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
