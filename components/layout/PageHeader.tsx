import { CmsSupportPanel } from "@/components/ui/CmsSupportPanel";
import { Container } from "@/components/ui/Container";

type Props = {
  eyebrow?: string;
  title: string;
  lead?: string;
};

/**
 * Full-viewport typed header for pages without hero media (News, Insights,
 * Contact). Same `t-hero` display type and desktop support panel as the homepage.
 */
export function PageHeader({ eyebrow, title, lead }: Props) {
  return (
    <header className="relative isolate flex h-svh min-h-svh items-center overflow-hidden border-b border-ist-line bg-ist-surface pt-18">
      <Container className="relative z-10 py-24">
        <div className="mt-[100px]">
          {eyebrow ? <p className="t-eyebrow hero-in">{eyebrow}</p> : null}
          {eyebrow ? (
            <div aria-hidden="true" className="hero-in mt-4 h-px w-12 bg-ist-accent" />
          ) : null}
          <h1
            className={`t-hero hero-in text-ist-text ${eyebrow ? "mt-6" : ""}`}
            style={{ "--hero-delay": "120ms" } as React.CSSProperties}
          >
            {title}
          </h1>
          {lead ? (
            <p
              className="t-lead hero-in mt-8 max-w-3xl"
              style={{ "--hero-delay": "240ms" } as React.CSSProperties}
            >
              {lead}
            </p>
          ) : null}
        </div>
      </Container>

      <CmsSupportPanel />
    </header>
  );
}
