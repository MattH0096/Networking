import { PageCta } from "@/components/ui/PageCta";
import type { PageCtaCopy } from "@/lib/cta";

type Props = {
  copy: PageCtaCopy;
};

/** Homepage closing CTA — shared plate; homepage vision copy. */
export function Vision({ copy }: Props) {
  return <PageCta copy={copy} />;
}
