"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

type Props = {
  /** From server env GA_MEASUREMENT_ID — not NEXT_PUBLIC_ (Vercel Secret/Config friendly). */
  measurementId: string;
};

/**
 * GA4 (Google tag). Skips /admin so CMS edits are not counted as site traffic.
 */
export function GoogleAnalytics({ measurementId }: Props) {
  const pathname = usePathname();
  const gaId = measurementId.trim();

  useEffect(() => {
    if (!gaId || !pathname || pathname.startsWith("/admin")) return;
    window.gtag?.("config", gaId, { page_path: pathname });
  }, [gaId, pathname]);

  if (!gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  );
}
