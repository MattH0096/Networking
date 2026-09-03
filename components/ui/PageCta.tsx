import { CtaCard } from "@/components/ui/CtaCard";
import type { PageCtaCopy } from "@/lib/cta";

type Props = {
  copy: PageCtaCopy;
};

function CtaCopyBody({ copy }: { copy: PageCtaCopy }) {
  if (copy.lines?.length) {
    return (
      <p className="text-[1.05rem] leading-snug text-ist-text sm:text-[1.25rem] lg:text-[1.45rem]">
        {copy.lines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
        {copy.accentLine ? (
          <span className="mt-1 block text-ist-accent-bright">{copy.accentLine}</span>
        ) : null}
        {copy.afterLines?.map((line) => (
          <span key={line} className="mt-1 block text-ist-text">
            {line}
          </span>
        ))}
      </p>
    );
  }

  return (
    <>
      {copy.heading ? (
        <h2 className="text-[1.15rem] font-semibold leading-snug text-ist-text sm:text-[1.35rem] lg:text-[1.5rem]">
          {copy.heading}
        </h2>
      ) : null}
      {copy.lead ? (
        <p className="mt-4 text-[1.05rem] leading-snug text-ist-text/90 sm:text-[1.2rem] lg:text-[1.35rem]">
          {copy.lead}
        </p>
      ) : null}
    </>
  );
}

/** Shared CTA plate — original vision copy + buttons. */
export function PageCta({ copy }: Props) {
  return (
    <CtaCard
      primaryCta={copy.primaryCta}
      primaryHref={copy.primaryHref}
      secondaryCta={copy.secondaryCta}
      secondaryHref={copy.secondaryHref}
    >
      <CtaCopyBody copy={copy} />
    </CtaCard>
  );
}
