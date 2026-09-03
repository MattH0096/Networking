import { Container } from "@/components/ui/Container";
import { ChassisFrame } from "@/components/ui/ChassisFrame";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import type { SiteContent } from "@/lib/cms/content";
import type { LayerStatus } from "@/lib/home";

type StackIcon = "distribution" | "simulation" | "hardware" | "interop" | "ecosystem";

const LAYER_ICONS: StackIcon[] = [
  "distribution",
  "simulation",
  "hardware",
  "interop",
  "ecosystem",
];

function StackGlyph({ name }: { name: StackIcon }) {
  const common = {
    viewBox: "0 0 24 24",
    width: 28,
    height: 28,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "distribution":
      return (
        <svg {...common}>
          <circle cx="12" cy="5" r="2.2" />
          <circle cx="5" cy="19" r="2.2" />
          <circle cx="19" cy="19" r="2.2" />
          <circle cx="12" cy="12.5" r="2.2" />
          <path d="M12 7.2v3M10.4 14.2 6.6 17.6M13.6 14.2l3.8 3.4" />
        </svg>
      );
    case "simulation":
      return (
        <svg {...common}>
          <path d="M12 3.2 20.2 7.6v8.8L12 20.8 3.8 16.4V7.6z" />
          <path d="M12 3.2v17.6M3.8 7.6l8.2 4.4 8.2-4.4" />
          <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
        </svg>
      );
    case "hardware":
      return (
        <svg {...common}>
          <rect x="6.5" y="6.5" width="11" height="11" rx="1.5" />
          <path d="M10 6.5V3.5M14 6.5V3.5M10 20.5v-3M14 20.5v-3M6.5 10H3.5M6.5 14H3.5M20.5 10h-3M20.5 14h-3" />
        </svg>
      );
    case "interop":
      return (
        <svg {...common}>
          <path d="M10 3.8H5.5V10H10" />
          <path d="M14 20.2h4.5V14H14" />
          <path d="M7.5 14.2a4.5 4.5 0 0 0 4.5 4.5" />
          <path d="M16.5 9.8a4.5 4.5 0 0 0-4.5-4.5" />
          <path d="M9 11.2 12 14.2 15 11.2" />
        </svg>
      );
    case "ecosystem":
      return (
        <svg {...common}>
          <circle cx="9" cy="8" r="2.6" />
          <circle cx="16.5" cy="9" r="2.2" />
          <path d="M3.8 19.5c0-3.2 2.3-5.3 5.2-5.3s5.2 2.1 5.2 5.3" />
          <path d="M13.2 19.5c.3-2.1 1.7-3.6 3.6-3.6 1.3 0 2.4.55 3 1.4" />
        </svg>
      );
  }
}

function DiamondTile({
  layer,
  product,
  status,
  icon,
  index,
}: {
  layer: string;
  product: string | null;
  status: LayerStatus;
  icon: StackIcon;
  index: number;
}) {
  const current = status === "current";

  return (
    <Reveal
      as="li"
      index={index}
      step={140}
      variant="rise"
      className={cn("stack-diamond", `stack-diamond--${index}`)}
    >
      <div className="stack-diamond__anchor">
        <div className="stack-diamond__rotator">
          <ChassisFrame
            as="article"
            standby={!current}
            className="stack-diamond__chassis"
            viewportClassName="stack-diamond__viewport"
          >
            <div className="stack-diamond__face">
              <span
                aria-hidden="true"
                className="feature-card__icon inline-flex shrink-0 items-center justify-center border border-ist-accent/35 bg-black/40 text-ist-accent-bright"
              >
                <StackGlyph name={icon} />
              </span>
              <h3 className="stack-diamond__title">{layer}</h3>
              {product ? <p className="stack-diamond__product">{product}</p> : null}
            </div>
          </ChassisFrame>
        </div>
      </div>
    </Reveal>
  );
}

type Props = {
  title: string;
  layers: SiteContent["home"]["stackLayers"];
};

/**
 * §9.1.9 — five-layer platform signal as a 2+3 diamond mesh.
 */
export function StackSignal({ title, layers }: Props) {
  return (
    <section id="stack" className="section-y bg-ist-bg">
      <Container>
        <Reveal variant="expand">
          <header className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <h2 className="t-h2 text-ist-text">{title}</h2>
          </header>
        </Reveal>

        <div className="stack-diamond-board mt-10 lg:mt-12">
          <ul className="stack-diamond-board__grid">
            {layers.map((layer, i) => (
              <DiamondTile
                key={`${layer.layer}-${i}`}
                layer={layer.layer}
                product={layer.product}
                status={layer.status}
                icon={LAYER_ICONS[i] ?? "distribution"}
                index={i}
              />
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
