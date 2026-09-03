import { LinkRule, type LinkState } from "@/components/ui/LinkRule";
import { STATUS_LABELS, type LayerStatus } from "@/lib/home";

/**
 * Shipping layers land on a solid accent rule; unreleased ones land dashed.
 * Hovering a dashed row resolves it to solid — the interaction is the product
 * metaphor, and it is the only place on the page that behaviour appears twice.
 */
const RULE_STATE: Record<LayerStatus, LinkState> = {
  current: "connected",
  "in-development": "intermittent",
  "coming-soon": "intermittent",
};

type Props = {
  layer: string;
  /** `null` for the unreleased layers — they carry no name, by design. */
  product: string | null;
  status: LayerStatus;
};

/** Renders the row contents only; the caller owns the `<li>` and the `group` class. */

export function StackLayer({ layer, product, status }: Props) {
  const current = status === "current";

  return (
    <>
      <div className="grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-2 py-6 sm:grid-cols-[1fr_8rem_8rem] sm:gap-8">
        <p className={`t-h3 ${current ? "text-ist-text" : "text-ist-muted"}`}>{layer}</p>

        {/* The dash only makes sense as a column placeholder. Once the table
            reflows to a stacked list it reads as a stray character, so it drops
            out and the status tag carries the meaning. */}
        {product ? (
          <p className="t-tag order-3 font-mono text-ist-text sm:order-none">{product}</p>
        ) : (
          <p aria-hidden="true" className="t-tag order-3 hidden font-mono text-ist-dim sm:order-none sm:block">
            —
          </p>
        )}

        <p className="tag t-tag justify-self-end sm:justify-self-start" data-status={status}>
          {STATUS_LABELS[status]}
        </p>
      </div>

      <LinkRule state={RULE_STATE[status]} tone={current ? "accent" : "line"} resolveOnHover />
    </>
  );
}
