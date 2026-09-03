import { GlassSupportPanel } from "@/components/ui/GlassSupportPanel";
import { getSiteContent } from "@/lib/cms/content";

type Props = {
  mobile?: boolean;
  delay?: string;
  className?: string;
};

/** Sitewide support panel — copy comes from CMS overrides when set. */
export async function CmsSupportPanel(props: Props) {
  const content = await getSiteContent();
  return (
    <GlassSupportPanel
      {...props}
      lines={content.home.supportLines}
      closer={content.home.supportCloser}
    />
  );
}
