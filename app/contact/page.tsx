import type { Metadata } from "next";

import { ContactAside } from "@/components/contact/ContactAside";
import { ContactHelpBand } from "@/components/contact/ContactHelpBand";
import { ContactPillars } from "@/components/contact/ContactPillars";
import { ContactForm } from "@/components/forms/ContactForm";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { getSiteContent } from "@/lib/cms/content";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return {
    title: "Contact IST",
    description: content.contact.lead,
  };
}

/**
 * §9.10. There is no email address anywhere on this page, in the markup, or in
 * schema — the form is the only route in.
 */
export default async function ContactPage() {
  const content = await getSiteContent();
  const c = content.contact;

  return (
    <>
      <PageHero
        eyebrow={c.eyebrow}
        title={[c.titleLine1, c.titleLine2]}
        lead={c.lead}
        video={["/video/contact-1.mp4", "/video/contact-2.mp4"]}
      />

      <section className="section-y bg-ist-bg">
        <Container>
          <div className="grid items-stretch gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-6">
            <Reveal className="h-full">
              <h2 className="sr-only">Send a message</h2>
              <ContactForm
                copy={{
                  title: c.formTitle,
                  lead: c.formLead,
                  secure: c.formSecure,
                  submit: c.formSubmit,
                  placeholders: c.placeholders,
                }}
              />
            </Reveal>

            <Reveal index={1} className="h-full">
              <ContactAside
                officeTitle={c.officeTitle}
                location={c.officeLocation}
                description={c.officeDescription}
                mapAlt={c.mapAlt}
                socialTitle={c.socialTitle}
                socialLead={c.socialLead}
              />
            </Reveal>
          </div>

          <Reveal index={2} className="mt-5 lg:mt-6">
            <ContactPillars pillars={c.pillars} />
          </Reveal>
        </Container>
      </section>

      <ContactHelpBand heading={c.helpHeading} lead={c.helpLead} />
    </>
  );
}
