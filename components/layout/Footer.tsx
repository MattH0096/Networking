import Link from "next/link";

import { Logo } from "@/components/brand/Logo";
import { FooterVision } from "@/components/layout/FooterStrip";
import { Button } from "@/components/ui/Button";
import { HeroVideoBackground } from "@/components/ui/HeroVideoBackground";
import { LinkRule } from "@/components/ui/LinkRule";
import {
  COMPANY_NAME,
  CTA,
  FOOTER_BRAND,
  FOOTER_COLUMNS,
  OFFICE_LOCATION,
  SOCIALS,
} from "@/lib/site";

function SocialIcon({ label }: { label: string }) {
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

/**
 * Site footer — vision strip, brand + full platform sitemap, legal.
 * No public email; contact routes through /contact.
 */
export function Footer() {
  return (
    <footer className="relative isolate overflow-hidden border-t border-ist-line">
      <HeroVideoBackground sources={["/video/Footer.mp4"]} rate={0.75} fadeBottom={false} />
      <div className="absolute inset-0 -z-[5] bg-ist-bg/75" aria-hidden="true" />

      <div className="container-ist relative z-10 py-20 sm:py-24">
        {/* Vision — full-width platform statement */}
        <FooterVision />

        <LinkRule state="connected" tone="dim" className="mt-12 sm:mt-14" />

        {/* Brand + sitemap */}
        <div className="mt-12 grid gap-12 lg:mt-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,2.85fr)] lg:gap-16 xl:gap-20">
          <div className="min-w-0">
            <Logo size="footer" />
            <p className="t-small mt-5 max-w-sm text-ist-muted">{FOOTER_BRAND.tagline}</p>

            <p className="t-eyebrow mt-8">Office</p>
            <p className="t-small mt-2 text-ist-muted">{OFFICE_LOCATION}</p>

            <ul className="mt-8 flex items-center gap-3">
              {SOCIALS.map((social) => {
                const chrome =
                  "flex h-11 w-11 items-center justify-center rounded-sm border border-ist-line text-ist-muted";

                if (!social.href) {
                  return (
                    <li key={social.label}>
                      <span className={`${chrome} opacity-50`} title="Profile link coming soon">
                        <span className="sr-only">
                          {`${COMPANY_NAME} on ${social.label} — link coming soon`}
                        </span>
                        <SocialIcon label={social.label} />
                      </span>
                    </li>
                  );
                }

                return (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className={`${chrome} transition-colors duration-[180ms] ease-ist hover:border-ist-accent hover:text-ist-accent-bright`}
                    >
                      <span className="sr-only">{`${COMPANY_NAME} on ${social.label}`}</span>
                      <SocialIcon label={social.label} />
                    </a>
                  </li>
                );
              })}
            </ul>

            <div className="mt-8">
              <Button href="/contact" variant="secondary" withArrow>
                {CTA.contact}
              </Button>
            </div>
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 sm:gap-x-6 lg:gap-x-8"
          >
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.heading} className="min-w-0">
                <p className="t-eyebrow">{column.heading}</p>
                <LinkRule state="connected" tone="dim" className="mt-3 max-w-10" />
                <ul className="mt-4 flex flex-col gap-2.5 sm:gap-3">
                  {column.links.map((link) => (
                    <li key={`${column.heading}-${link.href}`}>
                      <Link
                        href={link.href}
                        className="t-small text-ist-muted transition-colors duration-[180ms] ease-ist hover:text-ist-accent-bright"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <LinkRule state="connected" tone="dim" className="mt-14 sm:mt-16" />

        <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="t-small text-ist-dim">
            © {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.
          </p>
          <p className="t-small text-ist-dim">{OFFICE_LOCATION}</p>
        </div>
      </div>
    </footer>
  );
}
