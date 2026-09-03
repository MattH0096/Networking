import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/cn";

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
};

export function Card({ as: Tag = "div", children, className }: Props) {
  return <Tag className={cn("card", className)}>{children}</Tag>;
}
