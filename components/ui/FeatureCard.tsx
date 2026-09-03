import type { ReactNode } from "react";

import { ChassisFrame } from "@/components/ui/ChassisFrame";
import { cn } from "@/lib/cn";

type Props = {
  title: string;
  body?: string;
  /** Accent icon (rendered inside the shared plate). */
  icon?: ReactNode;
  /** Large step index — flow cards. */
  index?: string | number;
  /** Mono / tracked label under index (e.g. STORE). */
  eyebrow?: string;
  /** Muted line under the title (e.g. team name). */
  meta?: string;
  align?: "left" | "center";
  inert?: boolean;
  standby?: boolean;
  /** Floor reflection under the card (default on). */
  reflect?: boolean;
  footer?: ReactNode;
  className?: string;
  /** Extra classes on the viewport face. */
  faceClassName?: string;
};

function CardFace({
  title,
  body,
  icon,
  index,
  eyebrow,
  meta,
  align,
  footer,
  faceClassName,
}: Omit<Props, "inert" | "standby" | "reflect" | "className">) {
  const centered = align === "center";

  return (
    <div
      className={cn(
        "feature-card flex h-full flex-col px-5 py-7 sm:px-6 sm:py-8",
        centered && "items-center text-center",
        faceClassName,
      )}
    >
      {index != null ? (
        <p className="text-[1.65rem] font-bold leading-none tracking-tight text-ist-accent-bright sm:text-[1.85rem]">
          {index}
        </p>
      ) : null}

      {icon != null ? (
        <span
          aria-hidden="true"
          className={cn(
            "feature-card__icon inline-flex h-20 w-20 shrink-0 items-center justify-center",
            "border border-ist-accent/35 bg-black/40 text-ist-accent-bright",
            "transition-colors duration-[180ms] ease-ist group-hover:border-ist-accent/65",
            index != null && "mt-5",
          )}
        >
          {icon}
        </span>
      ) : null}

      {eyebrow ? (
        <p
          className={cn(
            "text-[0.8rem] font-semibold tracking-[0.12em] text-ist-accent-bright sm:text-[0.85rem]",
            index != null || icon != null ? "mt-6" : null,
          )}
        >
          {eyebrow}
        </p>
      ) : null}

      <h3
        className={cn(
          "text-[1.02rem] font-semibold leading-snug tracking-tight text-ist-text sm:text-[1.08rem]",
          eyebrow ? "mt-2" : icon != null || index != null ? "mt-6" : null,
        )}
      >
        {title}
      </h3>

      {meta ? <p className="mt-1 text-[0.85rem] text-ist-muted">{meta}</p> : null}

      {body ? (
        <p className="t-small mt-3 flex-1 text-pretty leading-relaxed text-ist-muted">{body}</p>
      ) : null}

      {footer ? <div className="mt-auto pt-5">{footer}</div> : null}
    </div>
  );
}

/**
 * Canonical content card — thin corner frame + optional floor reflection.
 */
export function FeatureCard({
  title,
  body,
  icon,
  index,
  eyebrow,
  meta,
  align = "left",
  inert = false,
  standby = false,
  reflect = true,
  footer,
  className,
  faceClassName,
}: Props) {
  const face = (
    <CardFace
      title={title}
      body={body}
      icon={icon}
      index={index}
      eyebrow={eyebrow}
      meta={meta}
      align={align}
      footer={footer}
      faceClassName={faceClassName}
    />
  );

  return (
    <div className={cn("feature-card-shell group h-full", className)}>
      <ChassisFrame
        as="article"
        inert={inert}
        standby={standby}
        className="h-full"
        viewportClassName="h-full"
      >
        {face}
      </ChassisFrame>

      {reflect ? (
        <div aria-hidden="true" className="feature-card-shell__reflect">
          <div className="feature-card-shell__reflect-inner">
            <ChassisFrame inert standby={standby} className="h-full" viewportClassName="h-full">
              <CardFace
                title={title}
                body={body}
                icon={icon}
                index={index}
                eyebrow={eyebrow}
                meta={meta}
                align={align}
                footer={footer}
                faceClassName={faceClassName}
              />
            </ChassisFrame>
          </div>
        </div>
      ) : null}
    </div>
  );
}
