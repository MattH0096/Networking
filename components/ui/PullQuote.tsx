import { ChassisFrame } from "@/components/ui/ChassisFrame";
import { cn } from "@/lib/cn";

type Props = {
  lead: string;
  line: string;
  className?: string;
};

/**
 * Product-page pull statement — chassis frame, centered hierarchy.
 */
export function PullQuote({ lead, line, className }: Props) {
  return (
    <ChassisFrame
      as="figure"
      inert
      className={cn("mx-auto w-full max-w-4xl", className)}
      viewportClassName="flex flex-col items-center px-8 py-10 text-center sm:px-12 lg:px-16"
    >
      <span
        aria-hidden="true"
        className="mb-6 h-px w-14 bg-ist-accent sm:mb-8 sm:w-16"
      />
      <blockquote className="max-w-2xl">
        <p className="text-[0.95rem] leading-relaxed text-ist-muted sm:text-[1.05rem]">
          {lead}
        </p>
        <p className="mt-5 text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-[1.15] tracking-tight text-ist-accent sm:mt-6">
          {line}
        </p>
      </blockquote>
      <span
        aria-hidden="true"
        className="mt-8 flex items-center gap-2 text-ist-accent/60 sm:mt-10"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
        <span className="h-px w-8 bg-current" />
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
      </span>
    </ChassisFrame>
  );
}
