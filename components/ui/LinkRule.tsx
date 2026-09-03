import { cn } from "@/lib/cn";

export type LinkState = "connected" | "intermittent" | "absent";

type Props = {
  /**
   * connected    — established, shipping, current
   * intermittent — in development, forward-looking
   * absent       — not yet, no connection
   */
  state?: LinkState;
  tone?: "line" | "accent" | "dim";
  axis?: "horizontal" | "vertical";
  /**
   * When true, an intermittent rule animates to solid on hover of the nearest
   * ancestor marked `group` (or of the rule itself).
   */
  resolveOnHover?: boolean;
  className?: string;
};

export function LinkRule({
  state = "connected",
  tone = "line",
  axis = "horizontal",
  resolveOnHover = false,
  className,
}: Props) {
  return (
    <div
      aria-hidden="true"
      className={cn("link-rule", className)}
      data-state={state}
      data-tone={tone}
      data-axis={axis}
    >
      {resolveOnHover && state !== "connected" ? <span className="link-rule__resolve" /> : null}
    </div>
  );
}
