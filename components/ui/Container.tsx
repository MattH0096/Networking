import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/cn";

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
};

export function Container({ as: Tag = "div", children, className }: Props) {
  return <Tag className={cn("container-ist", className)}>{children}</Tag>;
}
