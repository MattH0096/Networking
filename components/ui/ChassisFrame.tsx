import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/cn";

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  media?: boolean;
  inert?: boolean;
  standby?: boolean;
  viewportClassName?: string;
};

/** @deprecated No overlay — frame is CSS ::before/::after on .chassis */
export function ChassisPlate(_props?: { className?: string }) {
  return null;
}

/** Thin wrapper — accent corner frame via `.chassis` CSS. */
export function ChassisFrame({
  as: Tag = "div",
  children,
  className,
  media = false,
  inert = false,
  standby = false,
  viewportClassName,
}: Props) {
  return (
    <Tag
      className={cn(
        "chassis",
        media && "chassis--media",
        inert && "chassis--inert",
        standby && "chassis--standby",
        className,
      )}
    >
      <div className={cn("chassis__viewport", viewportClassName)}>{children}</div>
    </Tag>
  );
}
