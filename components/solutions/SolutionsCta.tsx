import { PageCta } from "@/components/ui/PageCta";
import type { SiteContent } from "@/lib/cms/content";

type Props = {
  content: SiteContent["solutions"];
};

export function SolutionsCta({ content }: Props) {
  return (
    <PageCta
      copy={{
        lines: [content.visionLine1, content.visionLine2],
        accentLine: content.visionAccent,
        afterLines: [content.visionAfter1, content.visionAfter2],
        primaryCta: content.visionPrimaryCta,
        primaryHref: content.visionPrimaryHref,
        secondaryCta: content.visionSecondaryCta,
        secondaryHref: content.visionSecondaryHref,
      }}
    />
  );
}
