import Image from "next/image";

import { cn } from "@/lib/cn";
import { img } from "@/lib/images.server";

type Props = {
  paper: {
    title: string;
    series: string;
    date: string;
  };
  coverKey?: string;
  className?: string;
};

/**
 * Research book cover — cover art with IST mark, title, and series overlays.
 */
export function ResearchCover({ paper, coverKey = "insights-cover", className }: Props) {
  const cover = img(coverKey);

  return (
    <div
      className={cn(
        "relative isolate flex w-full flex-col overflow-hidden border border-ist-accent/65 bg-black",
        "aspect-[2/3] max-w-sm mx-auto",
        "lg:mx-0 lg:max-w-none lg:aspect-auto lg:h-full",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 z-[3] w-[3px] bg-gradient-to-b from-ist-accent via-ist-accent-deep to-ist-accent/40"
      />

      <Image
        src={cover.src}
        width={cover.width}
        height={cover.height}
        alt=""
        sizes="(min-width: 1024px) 22vw, (min-width: 640px) 40vw, 90vw"
        className="absolute inset-0 h-full w-full object-cover object-center"
        priority
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-black/55 via-black/15 to-black/75"
      />

      <div className="relative z-[2] flex h-full flex-1 flex-col justify-between gap-6 p-4 pl-5 sm:p-5 sm:pl-6">
        <div>
          <p className="text-[1.55rem] font-semibold tracking-[-0.02em] text-ist-text sm:text-[1.7rem]">
            IST
          </p>
          <div aria-hidden="true" className="mt-2 h-px w-8 bg-ist-accent/80" />
        </div>

        <div>
          <p className="text-[0.84rem] font-semibold leading-snug tracking-tight text-ist-text sm:text-[0.9rem]">
            {paper.title}
          </p>
          <p className="mt-2.5 font-mono text-[0.55rem] font-medium uppercase tracking-[0.13em] text-ist-accent-bright">
            {paper.series} · {paper.date}
          </p>
        </div>
      </div>
    </div>
  );
}
