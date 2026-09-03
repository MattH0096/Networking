import type { Metadata } from "next";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { LinkRule } from "@/components/ui/LinkRule";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { verdict } from "@/lib/contrast";
import { ACCENTS, LINES, MOTION, RADII, SPACING, SURFACES, TEXT_COLORS, TYPE_SCALE } from "@/lib/tokens";

export const metadata: Metadata = {
  title: "Design tokens",
  description: "Internal reference for the IST design system.",
  robots: { index: false, follow: false },
};

const BG = "#000000";
const RAISED = "#0A0A0A";

function Swatch({
  name,
  hex,
  use,
  against = BG,
  againstLabel = "on --ist-bg",
  showContrast = true,
}: {
  name: string;
  hex: string;
  use: string;
  against?: string;
  againstLabel?: string;
  showContrast?: boolean;
}) {
  const v = verdict(hex, against);

  return (
    <div className="border border-ist-line bg-ist-surface">
      <div className="h-20 w-full" style={{ backgroundColor: hex }} />
      <div className="p-4">
        <p className="t-tag text-ist-text">{name}</p>
        <p className="t-small mt-1 font-mono text-ist-dim">{hex}</p>
        <p className="t-small mt-3 text-ist-muted">{use}</p>
        {showContrast ? (
          <p className="t-small mt-3 font-mono text-ist-dim">
            {v.label} {againstLabel} ·{" "}
            <span className={v.passesBodyAA ? "text-ist-accent-bright" : "text-ist-muted"}>
              {v.passesBodyAA ? "AA body ✓" : v.passesLargeAA ? "AA large only" : "UI/fills only"}
            </span>
          </p>
        ) : null}
      </div>
    </div>
  );
}

function Block({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="section-y-sm border-t border-ist-line">
      <Container>
        <SectionHeader eyebrow={eyebrow} title={title} lead={lead} />
        <div className="mt-12">{children}</div>
      </Container>
    </section>
  );
}

export default function TokensPage() {
  return (
    <>
      <Container className="pb-12 pt-40">
        <p className="t-eyebrow">Internal reference · not linked in navigation</p>
        <h1 className="t-h1 mt-6">Design tokens</h1>
        <p className="t-lead mt-6">
          Proof of the colour, type, spacing, and link-state systems. Contrast ratios are computed
          at render time from the token values, not transcribed.
        </p>
      </Container>

      <Block
        eyebrow="01 — Colour"
        title="Surfaces and lines"
        lead="Sections alternate base and surface to create rhythm without bordering everything. No flat medium grey anywhere."
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SURFACES.map((token) => (
            <Swatch key={token.name} {...token} showContrast={false} />
          ))}
          {LINES.map((token) => (
            <Swatch key={token.name} {...token} showContrast={false} />
          ))}
        </div>
      </Block>

      <Block
        eyebrow="02 — Colour"
        title="Text"
        lead="Warm white, never blue-white. --ist-text-dim is the dimmest allowed, and never on anything lighter than --ist-surface-raised."
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TEXT_COLORS.map((token) => (
            <Swatch key={token.name} {...token} />
          ))}
        </div>

        <div className="mt-12 border border-ist-line bg-ist-raised p-6">
          <p className="t-tag text-ist-text">Dim text on --ist-surface-raised</p>
          <p className="t-small mt-3 text-ist-dim">
            {verdict("#8A857E", RAISED).label} — the lightest surface --ist-text-dim may sit on.
          </p>
        </div>
      </Block>

      <Block
        eyebrow="03 — Colour"
        title="Accent"
        lead="Restrained by budget: no more than three orange elements visible in any single viewport. A fourth gets demoted to muted."
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ACCENTS.map((token) => (
            <Swatch key={token.name} {...token} />
          ))}
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="border border-ist-line bg-ist-surface p-6">
            <p className="t-tag text-ist-text">Accent as display type</p>
            <p className="mt-4 text-2xl font-bold text-ist-accent">Not most. All.</p>
            <p className="t-small mt-4 text-ist-muted">
              --ist-accent is {verdict("#FA6228", BG).label} on the page base. Permitted at ≥24px
              bold, and for fills, rules, and icons — never for body-size text.
            </p>
          </div>

          <div className="border border-ist-line bg-ist-surface p-6">
            <p className="t-tag text-ist-text">Accent as a link</p>
            <p className="t-body mt-4 text-ist-muted">
              Inline copy with an{" "}
              <a href="#main" className="text-ist-accent-bright underline underline-offset-4">
                accent-bright link
              </a>{" "}
              at body size.
            </p>
            <p className="t-small mt-4 text-ist-muted">
              --ist-accent-bright is {verdict("#FF7340", BG).label} — clears AA for small text.
            </p>
          </div>
        </div>

        <div className="mt-6 border border-ist-line bg-ist-surface p-6">
          <p className="t-tag text-ist-text">Label colour on an accent fill</p>
          <div className="mt-4 flex flex-wrap gap-4">
            <span
              className="inline-flex min-h-11 items-center px-6 font-medium text-white"
              style={{ backgroundColor: "#FA6228" }}
            >
              #FFFFFF label — {verdict("#FFFFFF", "#FA6228").label} ✓
            </span>
            <span
              className="inline-flex min-h-11 items-center px-6 font-medium"
              style={{ backgroundColor: "#FA6228", color: "#F0EDE8" }}
            >
              --ist-text label — {verdict("#F0EDE8", "#FA6228").label} ✗
            </span>
          </div>
        </div>
      </Block>

      <Block
        eyebrow="04 — Typography"
        title="Type scale"
        lead="Archivo for display and body, IBM Plex Mono for utility. Sentence case for headings; uppercase reserved for eyebrows and tags."
      >
        <div className="flex flex-col gap-10">
          {TYPE_SCALE.map((entry) => (
            <div key={entry.role} className="grid gap-3 lg:grid-cols-[160px_minmax(0,1fr)] lg:gap-8">
              <div>
                <p className="t-tag text-ist-accent-bright">{entry.role}</p>
                <p className="t-small mt-1 font-mono text-ist-dim">{entry.spec}</p>
              </div>
              <div>
                <p className={entry.cls}>
                  {entry.role === "Eyebrow" || entry.role === "Tag"
                    ? "Assured data distribution"
                    : "Networks should adapt. Not break."}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Block>

      <Block
        eyebrow="05 — Signature"
        title="The link-state rule"
        lead="Solid means established and shipping. Dashed means intermittent and in development. Faded means no connection yet. Hover a dashed rule to watch it resolve to solid — the interaction is the product metaphor."
      >
        <div className="grid gap-8 md:grid-cols-3">
          {(
            [
              ["connected", "Connected", "Locus, Crucible, current capabilities"],
              ["intermittent", "Intermittent", "Unnamed stack layers, forward-looking copy"],
              ["absent", "Absent", "Not yet, no connection"],
            ] as const
          ).map(([state, label, use]) => (
            <div key={state} className="group border border-ist-line bg-ist-surface p-6">
              <p className="t-tag text-ist-text">{label}</p>
              <LinkRule state={state} tone="accent" resolveOnHover className="my-6" />
              <p className="t-small text-ist-muted">{use}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 border border-ist-line bg-ist-surface p-6">
          <p className="t-tag text-ist-text">Vertical variant — used by the stack and step flows</p>
          <div className="group mt-6 flex h-24 items-stretch gap-16">
            <LinkRule axis="vertical" state="connected" tone="accent" />
            <LinkRule axis="vertical" state="intermittent" tone="accent" resolveOnHover />
            <LinkRule axis="vertical" state="absent" tone="line" />
          </div>
        </div>
      </Block>

      <Block
        eyebrow="06 — Components"
        title="Buttons"
        lead="Minimum 44×44 tap target. Never full-width on mobile — capped at 88% with margins."
      >
        <div className="flex flex-wrap items-center gap-6">
          <Button href="/tokens">See How It Works</Button>
          <Button href="/tokens" variant="secondary" withArrow>
            Contact IST
          </Button>
          <Button href="/tokens" variant="ghost">
            Explore Locus
          </Button>
          <Button href="/tokens" size="lg">
            Discuss a Mission
          </Button>
        </div>
      </Block>

      <Block
        eyebrow="07 — Layout"
        title="Spacing and radii"
        lead="Nothing off-scale. Section rhythm is clamp(80px, 10vw, 160px), applied on the section element only."
      >
        <div className="flex flex-col gap-3">
          {SPACING.map((step) => (
            <div key={step} className="flex items-center gap-6">
              <span className="t-small w-16 shrink-0 font-mono text-ist-dim">{step}px</span>
              <span className="h-4 bg-ist-accent" style={{ width: `${step}px` }} />
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap gap-6">
          {RADII.map((radius) => (
            <div key={radius.name} className="text-center">
              <div
                className="h-20 w-20 border border-ist-line-strong bg-ist-surface"
                style={{ borderRadius: radius.value }}
              />
              <p className="t-small mt-3 font-mono text-ist-dim">{radius.value}</p>
            </div>
          ))}
        </div>
      </Block>

      <Block
        eyebrow="08 — Motion"
        title="Durations and easing"
        lead="Deliberate and few. Everything remains readable and usable with motion disabled."
      >
        <ul className="flex flex-col">
          {MOTION.map((token) => (
            <li
              key={token.name}
              className="grid gap-1 border-b border-ist-line py-4 sm:grid-cols-[200px_220px_minmax(0,1fr)] sm:gap-6"
            >
              <span className="t-small font-mono text-ist-text">{token.name}</span>
              <span className="t-small font-mono text-ist-accent-bright">{token.value}</span>
              <span className="t-small text-ist-muted">{token.use}</span>
            </li>
          ))}
        </ul>
      </Block>
    </>
  );
}
