import { ContactBroadcastIcon } from "@/components/contact/ContactIcons";
import { BandCard } from "@/components/ui/BandBackdrop";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { CONTACT_HELP } from "@/lib/contact";
import { img } from "@/lib/images.server";

type Props = {
  heading?: string;
  lead?: string;
};

/**
 * Closing help band — “We are here to help you” plate, no CTAs.
 */
export function ContactHelpBand({
  heading = CONTACT_HELP.heading,
  lead = CONTACT_HELP.lead,
}: Props) {
  const asset = img("band-contact-help");

  return (
    <section className="section-y bg-ist-bg pt-0">
      <Container>
        <Reveal variant="expand">
          <BandCard
            src={asset.src}
            width={asset.width}
            height={asset.height}
            viewportClassName="min-h-[min(36svh,20rem)]"
            contentClassName="justify-center py-8 sm:py-10 lg:py-10"
          >
            {/* Soft lift so type stays crisp on the plate */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/35 via-black/25 to-black/45"
            />
            <div className="relative z-10 mx-auto max-w-3xl text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-ist-accent/70 bg-black/40 text-ist-accent-bright backdrop-blur-sm">
                <ContactBroadcastIcon size={22} />
              </span>
              <h2 className="mt-5 text-[1.25rem] font-semibold leading-snug tracking-tight text-ist-text sm:text-[1.45rem] lg:text-[1.6rem]">
                {heading}
              </h2>
              <p className="mt-3 text-[0.95rem] text-ist-muted sm:text-[1.05rem]">{lead}</p>
            </div>
          </BandCard>
        </Reveal>
      </Container>
    </section>
  );
}
