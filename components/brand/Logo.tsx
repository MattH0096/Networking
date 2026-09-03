import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/cn";
import { COMPANY_NAME } from "@/lib/site";

const LOGO = {
  src: "/img/logo.png",
  width: 1240,
  height: 262,
} as const;

type LogoSize = "nav" | "footer";

const SIZE_CLASS: Record<LogoSize, string> = {
  /* Cap width so the lockup cannot crush the nav CTA on laptop widths. */
  nav: "h-9 w-auto max-w-[11.5rem] object-contain object-left sm:h-10 sm:max-w-[13.5rem]",
  footer: "h-11 w-auto sm:h-12",
};

/**
 * Official IST lockup (`public/img/logo.png`). Nav + footer share this mark;
 * keep heights modest so the stacked wordmark stays legible on phone.
 */
export function Logo({
  className,
  size = "nav",
}: {
  className?: string;
  size?: LogoSize;
}) {
  return (
    <Link href="/" className={cn("group/logo inline-flex items-center", className)}>
      <Image
        src={LOGO.src}
        alt={COMPANY_NAME}
        width={LOGO.width}
        height={LOGO.height}
        priority={size === "nav"}
        className={cn(
          SIZE_CLASS[size],
          "transition-opacity duration-[180ms] ease-ist group-hover/logo:opacity-90",
        )}
      />
    </Link>
  );
}
