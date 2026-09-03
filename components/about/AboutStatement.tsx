import { BandCard } from "@/components/ui/BandBackdrop";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import type { SiteContent } from "@/lib/cms/content";
import { img } from "@/lib/images.server";

type Props = {
  content: SiteContent["about"];
};

/**
 * Locked about statement — left copy on Behind IST plate.
 */
export function AboutStatement({ content }: Props) {
  const asset = img("about-statement");

  return (
    <section className="section-y bg-ist-bg">
      <Container>
        <Reveal variant="expand">
          <BandCard
            src={asset.src}
            width={asset.width}
            height={asset.height}
            pinRight
            viewportClassName="min-h-[min(70svh,40rem)]"
            contentClassName="items-start justify-center py-10 sm:py-12 lg:py-12"
          >
            {/* Black edge gradient on the text side — no blur */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black via-black/75 to-transparent sm:via-black/70"
            />

            <div className="relative z-10 w-full max-w-xl text-left lg:max-w-2xl">
              <p className="font-mono text-[0.72rem] font-medium uppercase tracking-[0.16em] text-ist-accent-bright">
                {content.statementEyebrow}
              </p>
              <div className="mt-8 flex flex-col gap-5 sm:mt-10 sm:gap-6">
                {content.statement.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-[0.95rem] leading-relaxed text-ist-text/90 sm:text-[1.05rem] sm:leading-[1.65]"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </BandCard>
        </Reveal>
      </Container>
    </section>
  );
}
