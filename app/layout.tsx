import type { Metadata, Viewport } from "next";

import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { AerospaceField } from "@/components/ui/AerospaceField";
import { RouteLoader } from "@/components/ui/RouteLoader";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { readOverrides } from "@/lib/cms/store";
import { fontVariables } from "@/lib/fonts";
import { COMPANY_NAME } from "@/lib/site";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${COMPANY_NAME} — Every Device. Any Network.`,
    template: `%s — IST`,
  },
  description:
    "IST builds resilient networking for environments where connectivity breaks. Information keeps moving through dynamic, intermittently connected networks until every intended destination receives what it needs.",
  applicationName: "IST",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  other: {
    "msapplication-config": "/browserconfig.xml",
  },
  // Deliberately no organisation schema here: it would require an email address.
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
};

/**
 * Lenis owns smooth scrolling (see SmoothScroll). Keep scroll-padding for
 * sticky nav; native CSS smooth scroll is disabled while Lenis is active.
 */
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  await readOverrides();
  const gaId = process.env.GA_MEASUREMENT_ID?.trim() ?? "";
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <body>
        {gaId ? <GoogleAnalytics measurementId={gaId} /> : null}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var r=window.matchMedia('(prefers-reduced-motion: reduce)').matches;document.documentElement.setAttribute('data-motion',r?'reduce':'on');}catch(e){document.documentElement.setAttribute('data-motion','on');}})();`,
          }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-100 focus:rounded-sm focus:bg-ist-raised focus:px-4 focus:py-3 focus:text-ist-text"
        >
          Skip to content
        </a>

        <SmoothScroll>
          <RouteLoader />
          {/* Site-wide aerospace body background */}
          <AerospaceField className="aerospace-field--site" />

          <div className="relative z-10 bg-transparent">
            <Nav />
            <main id="main" className="bg-transparent">
              {children}
            </main>
            <Footer />
          </div>
        </SmoothScroll>
      </body>
    </html>
  );
}
