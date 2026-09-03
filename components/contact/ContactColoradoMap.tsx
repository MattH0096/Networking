import Image from "next/image";

import { CONTACT_OFFICE } from "@/lib/contact";
import { img } from "@/lib/images.server";

/**
 * Contact office map — uses the processed Colorado HQ plate as-is.
 */
export function ContactColoradoMap({
  className,
  mapAlt = CONTACT_OFFICE.mapAlt,
}: {
  className?: string;
  mapAlt?: string;
}) {
  const map = img("map-denver");

  return (
    <div className={className}>
      <Image
        src={map.src}
        width={map.width}
        height={map.height}
        alt={mapAlt}
        sizes="(min-width: 1024px) 28rem, 100vw"
        className="aspect-[5/4] w-full object-cover"
      />
    </div>
  );
}
