import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";

function Arrow() {
  return (
    <svg
      aria-hidden="true"
      className="btn__arrow"
      viewBox="0 0 16 16"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
    >
      <path d="M2 8h11M9 4l4 4-4 4" />
    </svg>
  );
}

type CommonProps = {
  variant?: Variant;
  size?: "md" | "lg";
  withArrow?: boolean;
  children: ReactNode;
  className?: string;
};

type AsLink = CommonProps & { href: string } & Omit<
    ComponentPropsWithoutRef<typeof Link>,
    "href" | "className" | "children"
  >;

type AsButton = CommonProps & { href?: undefined } & Omit<
    ComponentPropsWithoutRef<"button">,
    "className" | "children"
  >;

export function Button(props: AsLink | AsButton) {
  const {
    variant = "primary",
    size = "md",
    withArrow = variant === "ghost",
    children,
    className,
    ...rest
  } = props;

  const classes = cn(
    "btn",
    `btn--${variant}`,
    size === "lg" && variant !== "ghost" && "btn--lg",
    className,
  );

  const inner = (
    <>
      <span className="btn__label">{children}</span>
      {withArrow ? <Arrow /> : null}
    </>
  );

  if (rest.href !== undefined) {
    const { href, ...linkRest } = rest as AsLink;
    return (
      <Link href={href} className={classes} {...linkRest}>
        {inner}
      </Link>
    );
  }

  return (
    <button className={classes} {...(rest as AsButton)}>
      {inner}
    </button>
  );
}
