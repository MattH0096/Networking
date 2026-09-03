import { PageCta } from "@/components/ui/PageCta";
import type { PageCtaCopy } from "@/lib/cta";
import { ABOUT_CTA } from "@/lib/cta";

type Props = {
  /** Unique copy for this page — plate chrome stays shared. */
  copy?: PageCtaCopy;
};

/**
 * Closing CTA for interior pages — same inset band-vision plate as homepage;
 * copy is page-specific.
 */
export function ClosingCta({ copy = ABOUT_CTA }: Props) {
  return <PageCta copy={copy} />;
}
