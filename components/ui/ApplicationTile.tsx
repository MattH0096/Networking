import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/cn";
import { img, type ImageKey } from "@/lib/images.server";

type Props = {
  label: string;
  line: string;
  image: ImageKey;
  alt: string;
  href: string;
  sizes?: string;
  className?: string;
};

export function ApplicationTile({ label, line, image, alt, href, sizes, className }: Props) {
  const asset = img(image);

  return (
    <Link href={href} className={cn("card group block", className)}>
      <div className="relative overflow-hidden aspect-[4/3] sm:aspect-[3/2] lg:aspect-[4/3]">
        <Image
          src={asset.src}
          width={asset.width}
          height={asset.height}
          alt={alt}
          sizes={sizes ?? "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[180ms] ease-ist group-hover:scale-[1.02]"
        />

        <div className="relative z-[1] flex h-full flex-col justify-end p-6">
          <div aria-hidden="true" className="h-px w-8 bg-ist-accent" />
          <p className="t-tag mt-4 text-ist-accent-bright">{label}</p>
          <p className="t-small mt-2 max-w-[32ch] text-ist-text">{line}</p>
        </div>
      </div>
    </Link>
  );
}
