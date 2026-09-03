import {
  ContactNetworkIcon,
  ContactPinIcon,
} from "@/components/contact/ContactIcons";
import { ContactColoradoMap } from "@/components/contact/ContactColoradoMap";
import { COMPANY_NAME, SOCIALS } from "@/lib/site";
import { CONTACT_OFFICE, CONTACT_SOCIAL } from "@/lib/contact";

function SocialMark({ label }: { label: string }) {
  if (label === "LinkedIn") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C20.3 8.65 22 10.6 22 14.1V21h-4v-6.1c0-1.5-.54-2.5-1.86-2.5-1.02 0-1.63.68-1.9 1.34-.1.23-.12.56-.12.9V21H9V9Z" />
      </svg>
    );
  }
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M17.53 3h3.2l-6.99 7.99L22 21h-6.31l-4.6-6.02L5.8 21H2.6l7.35-8.4L2 3h6.31l4.34 5.73L17.53 3Zm-1.12 16h1.77L7.68 4.9H5.78L16.41 19Z" />
    </svg>
  );
}

type Props = {
  officeTitle?: string;
  location?: string;
  description?: string;
  mapAlt?: string;
  socialTitle?: string;
  socialLead?: string;
};

/**
 * Right column — office location, Colorado map, LinkedIn.
 */
export function ContactAside({
  officeTitle = CONTACT_OFFICE.title,
  location = CONTACT_OFFICE.location,
  description = CONTACT_OFFICE.description,
  mapAlt = CONTACT_OFFICE.mapAlt,
  socialTitle = CONTACT_SOCIAL.title,
  socialLead = CONTACT_SOCIAL.lead,
}: Props) {
  return (
    <aside className="flex h-full flex-col border border-ist-line bg-[#0a0a0a] p-5 sm:p-6 lg:p-7">
      <div>
        <p className="flex items-center gap-2 text-[1rem] font-semibold text-ist-text">
          <span className="text-ist-accent-bright">
            <ContactPinIcon size={18} />
          </span>
          {officeTitle}
        </p>

        <p className="mt-5 text-[1.35rem] font-semibold tracking-tight text-ist-text sm:text-[1.5rem]">
          {location}
        </p>
        <div aria-hidden="true" className="mt-2 h-px w-14 bg-ist-accent" />

        <p className="mt-4 text-[0.9rem] leading-relaxed text-ist-muted">{description}</p>

        <div className="relative mt-5 overflow-hidden border border-ist-line bg-black">
          <ContactColoradoMap mapAlt={mapAlt} />
        </div>
      </div>

      <div className="mt-auto border-t border-ist-line pt-5">
        <p className="flex items-center gap-2 text-[1rem] font-semibold text-ist-text">
          <span className="text-ist-accent-bright">
            <ContactNetworkIcon size={18} />
          </span>
          {socialTitle}
        </p>
        <p className="mt-2 text-[0.875rem] leading-relaxed text-ist-muted">{socialLead}</p>

        <ul className="mt-4 divide-y divide-ist-line border-y border-ist-line">
          {SOCIALS.map((social) => {
            const row =
              "group flex w-full items-center gap-3 py-3.5 text-ist-text transition-colors duration-[180ms] ease-ist";

            const inner = (
              <>
                <span className="flex h-9 w-9 items-center justify-center border border-ist-line text-ist-text">
                  <SocialMark label={social.label} />
                </span>
                <span className="flex-1 text-[0.95rem] font-medium">{social.label}</span>
                <span aria-hidden="true" className="text-ist-accent-bright">
                  →
                </span>
              </>
            );

            return (
              <li key={social.label}>
                {social.href ? (
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={`${COMPANY_NAME} on ${social.label}`}
                    className={`${row} hover:text-ist-accent-bright`}
                  >
                    {inner}
                  </a>
                ) : (
                  <span
                    className={`${row} cursor-default opacity-70`}
                    title="Profile link coming soon"
                    aria-label={`${COMPANY_NAME} on ${social.label} — link coming soon`}
                  >
                    {inner}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
