import Image from "next/image";
import Link from "next/link";

import { MissingLayerIcon } from "@/components/solutions/MissingLayerIcons";
import { Button } from "@/components/ui/Button";
import { ChassisFrame } from "@/components/ui/ChassisFrame";
import { Container } from "@/components/ui/Container";
import { LinkRule } from "@/components/ui/LinkRule";
import { Reveal } from "@/components/ui/Reveal";
import type { SiteContent } from "@/lib/cms/content";
import { cn } from "@/lib/cn";
import { img, type ImageKey } from "@/lib/images.server";

type Props = {
  content: SiteContent["solutions"];
};

/**
 * Distribution Intelligence narrative for Solutions.
 * Editorial, investor-clear: thesis → gap in the stack → outcomes → platform bridge.
 */
export function MissingLayer({ content }: Props) {
  const asset = img(content.missingImage as ImageKey);

  return (
    <section id="missing-layer" className="section-y bg-ist-bg">
      <Container>
        <Reveal variant="expand">
          <header className="mx-auto max-w-3xl text-center">
            <p className="font-mono text-[0.72rem] font-medium uppercase tracking-[0.16em] text-ist-accent-bright">
              {content.missingEyebrow}
            </p>
            <div aria-hidden="true" className="mx-auto mt-4 h-px w-12 bg-ist-accent" />
            <h2 className="t-h2 mx-auto mt-6 max-w-[22ch] text-balance text-ist-text">
              {content.missingTitle}
            </h2>
            <p className="t-lead mx-auto mt-6 max-w-[42ch]">{content.missingLead}</p>
          </header>
        </Reveal>

        <div className="mx-auto mt-12 grid max-w-5xl gap-8 sm:mt-14 md:grid-cols-2 md:gap-12 lg:gap-16">
          <Reveal variant="fromLeft">
            <p className="font-mono text-[0.68rem] font-medium uppercase tracking-[0.14em] text-ist-dim">
              {content.missingGapLabel}
            </p>
            <LinkRule state="intermittent" tone="dim" className="mt-3 max-w-10" />
            <p className="mt-5 text-[1.02rem] leading-relaxed text-ist-muted sm:text-[1.08rem]">
              {content.missingProblem}
            </p>
          </Reveal>
          <Reveal index={1} step={80} variant="fromRight">
            <p className="font-mono text-[0.68rem] font-medium uppercase tracking-[0.14em] text-ist-accent-bright">
              {content.missingAnswerLabel}
            </p>
            <LinkRule state="connected" tone="accent" className="mt-3 max-w-10" />
            <p className="mt-5 text-[1.02rem] leading-relaxed text-ist-text/90 sm:text-[1.08rem]">
              {content.missingInsight}
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid items-center gap-10 lg:mt-20 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
          <Reveal variant="expand">
            <p className="font-mono text-[0.68rem] font-medium uppercase tracking-[0.14em] text-ist-dim">
              {content.missingStackLabel}
            </p>
            <ol className="mt-6 flex flex-col">
              {content.missingStackLayers.map((layer, i) => (
                <li key={layer.id} className="relative">
                  {i > 0 ? (
                    <div
                      aria-hidden="true"
                      className={cn(
                        "absolute left-[1.15rem] top-0 h-3 w-px -translate-y-full",
                        layer.highlight || content.missingStackLayers[i - 1]?.highlight
                          ? "bg-ist-accent/50"
                          : "bg-ist-line",
                      )}
                    />
                  ) : null}
                  <div
                    className={cn(
                      "flex items-center gap-4 py-3.5",
                      layer.highlight
                        ? "relative rounded-md border border-ist-accent/60 bg-ist-accent/[0.07] px-4 py-4 sm:px-5"
                        : "px-1",
                    )}
                  >
                    <span
                      className={cn(
                        "inline-flex h-9 w-9 shrink-0 items-center justify-center",
                        layer.highlight ? "text-ist-accent-bright" : "text-ist-dim",
                      )}
                    >
                      <MissingLayerIcon name={layer.icon} size={layer.highlight ? 22 : 18} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p
                        className={cn(
                          "font-mono text-[0.72rem] font-medium uppercase tracking-[0.12em]",
                          layer.highlight ? "text-ist-text" : "text-ist-muted",
                        )}
                      >
                        {layer.label}
                      </p>
                      {layer.highlight ? (
                        <p className="mt-1 text-[0.88rem] leading-snug text-ist-muted">
                          {content.missingStackHighlightNote}
                        </p>
                      ) : null}
                    </div>
                    {layer.highlight ? (
                      <span className="hidden shrink-0 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-ist-accent-bright sm:inline">
                        IST
                      </span>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-6 max-w-md text-[0.88rem] leading-relaxed text-ist-dim">
              {content.missingStackCaption}
            </p>
          </Reveal>

          <Reveal index={1} step={100} variant="expand">
            <ChassisFrame media inert>
              <Image
                src={asset.src}
                width={asset.width}
                height={asset.height}
                alt={content.missingImageAlt}
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="aspect-[5/4] w-full object-cover lg:aspect-[4/3]"
              />
            </ChassisFrame>
          </Reveal>
        </div>

        <div className="mt-16 sm:mt-20">
          <Reveal variant="expand">
            <p className="font-mono text-[0.68rem] font-medium uppercase tracking-[0.14em] text-ist-dim">
              {content.missingOutcomesLabel}
            </p>
            <LinkRule state="connected" tone="accent" className="mt-3 max-w-10" />
          </Reveal>

          <ul className="mt-8 divide-y divide-ist-line border-y border-ist-line">
            {content.missingFeatures.map((feature, i) => (
              <Reveal key={feature.id} as="li" index={i} step={70} variant="rise">
                <div className="grid gap-3 py-6 sm:grid-cols-[3rem_minmax(0,14rem)_minmax(0,1fr)] sm:items-baseline sm:gap-8 sm:py-7">
                  <span className="font-mono text-[0.85rem] text-ist-accent-bright">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-ist-accent-bright">
                      <MissingLayerIcon name={feature.icon} size={20} />
                    </span>
                    <h3 className="text-[1.02rem] font-semibold tracking-tight text-ist-text">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-[0.98rem] leading-relaxed text-ist-muted sm:text-[1.02rem]">
                    {feature.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>

        <Reveal className="mt-16 sm:mt-20" variant="expand">
          <div className="border-t border-ist-line pt-12 sm:pt-14">
            <p className="text-center font-mono text-[0.68rem] font-medium uppercase tracking-[0.14em] text-ist-dim">
              {content.missingBridgeLabel}
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-center text-[1.05rem] leading-relaxed text-ist-muted sm:text-[1.12rem]">
              {content.missingBridgeLead}
            </p>

            <ol className="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-5 sm:gap-4">
              {content.missingFlow.map((step, i) => {
                const inner = (
                  <>
                    <span className="font-mono text-[0.62rem] text-ist-accent-bright">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="mt-2 block text-[0.95rem] font-semibold tracking-tight text-ist-text">
                      {step.label}
                    </span>
                    <span className="mt-1 block text-[0.8rem] text-ist-dim">{step.detail}</span>
                  </>
                );

                return (
                  <li key={step.id} className="min-w-0 sm:text-center">
                    {step.href ? (
                      <Link
                        href={step.href}
                        className="block transition-colors duration-[180ms] ease-ist hover:[&_span:nth-child(2)]:text-ist-accent-bright"
                      >
                        {inner}
                      </Link>
                    ) : (
                      <div>{inner}</div>
                    )}
                  </li>
                );
              })}
            </ol>

            <div className="mt-12 flex flex-col items-center gap-3">
              <Button href={content.missingCtaHref} variant="primary" size="lg" withArrow>
                {content.missingCta}
              </Button>
              <p className="text-[0.78rem] text-ist-dim">{content.missingCtaNote}</p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
