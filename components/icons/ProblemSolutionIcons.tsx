import type { ReactNode, SVGProps } from "react";

/**
 * Premium line icons for the Problem / Solution mix.
 * 32×32 grid, 1.35 stroke, round caps — engineering precision, not clip-art.
 */

export type PsIconName =
  | "mark"
  | "markSolution"
  | "satellite"
  | "mountains"
  | "ship"
  | "robotArm"
  | "radioTower"
  | "laptop"
  | "serverRack"
  | "drone"
  | "chevron";

const VB = 32;

const paths: Record<PsIconName, ReactNode> = {
  mark: (
    <>
      <path d="M16 3.5 26 9.2v13.6L16 28.5 6 22.8V9.2z" />
      <path d="M16 11v10" />
      <path d="M12.2 13.8 16 16.2l3.8-2.4" />
      <circle cx="16" cy="16.2" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  markSolution: (
    <>
      <circle cx="16" cy="16" r="3.2" />
      <circle cx="16" cy="16" r="7.5" strokeOpacity="0.45" />
      <path d="M16 4.5v3.2M16 24.3v3.2M4.5 16h3.2M24.3 16h3.2" />
      <path d="M8.2 8.2l2.3 2.3M21.5 21.5l2.3 2.3M23.8 8.2l-2.3 2.3M10.5 21.5l-2.3 2.3" />
    </>
  ),
  satellite: (
    <>
      {/* Bus */}
      <rect x="12.5" y="11" width="7" height="10" rx="1.2" />
      <path d="M14.2 13.5h3.6M14.2 16h3.6M14.2 18.5h2.2" strokeOpacity="0.55" />
      {/* Solar arrays */}
      <rect x="3.5" y="13.2" width="8" height="5.6" rx="0.6" />
      <rect x="20.5" y="13.2" width="8" height="5.6" rx="0.6" />
      <path d="M5.5 13.2v5.6M7.5 13.2v5.6M9.5 13.2v5.6" strokeOpacity="0.4" />
      <path d="M22.5 13.2v5.6M24.5 13.2v5.6M26.5 13.2v5.6" strokeOpacity="0.4" />
      {/* Antenna */}
      <path d="M16 11V7.2" />
      <path d="M13.8 7.2h4.4" />
      <circle cx="16" cy="5.8" r="1.35" />
      {/* Orbit hint */}
      <path d="M5.5 8.5c2.2-2.8 5.2-4 8-3.2" strokeOpacity="0.35" />
      <path d="M18.5 26.7c2.8.8 5.8-.4 8-3.2" strokeOpacity="0.35" />
    </>
  ),
  mountains: (
    <>
      {/* Far ridge */}
      <path d="M2.5 24.5 9.5 12.5l4 6.5 3.2-4.8L22 22l7.5 2.5H2.5z" />
      {/* Near peak cut */}
      <path d="M9.5 12.5 12.2 17.2" strokeOpacity="0.55" />
      <path d="M16.7 14.2 18.8 17.8" strokeOpacity="0.45" />
      {/* Drone on flight path */}
      <path d="M6.5 9.2c3.8-4.2 10.2-4.4 14.5-.4" />
      <path d="M19.2 7.6 21.4 8.6l-1.5 1.9" />
      <rect x="19.6" y="7.2" width="3.2" height="1.8" rx="0.4" />
      <path d="M19.6 7.8 17.4 6.4M22.8 7.8 25 6.4" />
    </>
  ),
  ship: (
    <>
      {/* Hull */}
      <path d="M3 18.5h26l-3.2 5.2H6.2z" />
      {/* Superstructure */}
      <path d="M8.5 18.5V12.2h9.5l3.2 3.4H8.5" />
      <rect x="10.2" y="13.5" width="2.4" height="2.2" rx="0.3" strokeOpacity="0.55" />
      <rect x="13.6" y="13.5" width="2.4" height="2.2" rx="0.3" strokeOpacity="0.55" />
      {/* Bridge / mast */}
      <path d="M12.8 12.2V8.4" />
      <path d="M11.2 8.4h5.2" />
      <path d="M15.2 8.4V6.6h2.6" />
      {/* Stack */}
      <path d="M18.8 12.2v-2.8h2.2v2.8" />
      {/* Waterline */}
      <path d="M3 18.5c2.4 1.8 6.2 2.8 13 2.8s10.6-1 13-2.8" strokeOpacity="0.35" />
    </>
  ),
  robotArm: (
    <>
      {/* Base */}
      <path d="M5.5 27h9.5v-3.2H5.5z" />
      <path d="M7.2 23.8h6.1" strokeOpacity="0.4" />
      {/* Lower arm */}
      <path d="M10.2 23.8V16.5" />
      <circle cx="10.2" cy="16.5" r="1.7" />
      {/* Upper arm */}
      <path d="M10.2 16.5 17.8 9.2" />
      <circle cx="17.8" cy="9.2" r="1.7" />
      {/* Wrist + gripper */}
      <path d="M17.8 9.2 24.2 11.4" />
      <circle cx="24.2" cy="11.4" r="1.4" />
      <path d="M24.2 11.4 27.5 8.6M24.2 11.4 28 13.2" />
      <path d="M26.8 7.8h2.2M27.2 14h2.4" />
    </>
  ),
  drone: (
    <>
      {/* Body */}
      <rect x="13.2" y="13.6" width="5.6" height="4.8" rx="1" />
      <circle cx="16" cy="16" r="1.2" fill="currentColor" stroke="none" />
      {/* Arms */}
      <path d="M13.2 14.4 7.2 9.2M18.8 14.4 24.8 9.2M13.2 17.6 7.2 22.8M18.8 17.6 24.8 22.8" />
      {/* Rotors */}
      <ellipse cx="6.2" cy="8.6" rx="3.4" ry="1.3" />
      <ellipse cx="25.8" cy="8.6" rx="3.4" ry="1.3" />
      <ellipse cx="6.2" cy="23.4" rx="3.4" ry="1.3" />
      <ellipse cx="25.8" cy="23.4" rx="3.4" ry="1.3" />
    </>
  ),
  radioTower: (
    <>
      <path d="M16 28V11.5" />
      <path d="M9.5 28h13" />
      <path d="M12.2 22.5 16 11.5l3.8 11" />
      <path d="M13.5 19h5" strokeOpacity="0.5" />
      {/* Dish / tip */}
      <path d="M16 11.5 12.5 6.5h7z" />
      <circle cx="16" cy="5.2" r="1.2" />
      {/* Signal arcs */}
      <path d="M9.8 13.5a7.2 7.2 0 0 1 12.4 0" />
      <path d="M7.2 16.2a10.5 10.5 0 0 1 17.6 0" strokeOpacity="0.55" />
    </>
  ),
  laptop: (
    <>
      <rect x="6" y="7.5" width="20" height="13" rx="1.4" />
      <path d="M8.2 9.5h15.6v8.2H8.2z" strokeOpacity="0.45" />
      <path d="M3.5 22.5h25" />
      <path d="M3.5 22.5 6 20.5h20l2.5 2" />
      <path d="M13.5 20.5h5" strokeOpacity="0.55" />
    </>
  ),
  serverRack: (
    <>
      <rect x="8" y="4" width="16" height="24" rx="1.6" />
      <rect x="10.2" y="6.5" width="11.6" height="5.2" rx="0.7" />
      <rect x="10.2" y="13.4" width="11.6" height="5.2" rx="0.7" />
      <rect x="10.2" y="20.3" width="11.6" height="5.2" rx="0.7" />
      <circle cx="12.2" cy="9.1" r="0.85" fill="currentColor" stroke="none" />
      <circle cx="12.2" cy="16" r="0.85" fill="currentColor" stroke="none" />
      <circle cx="12.2" cy="22.9" r="0.85" fill="currentColor" stroke="none" />
      <path d="M14.5 9.1h5.5M14.5 16h5.5M14.5 22.9h5.5" strokeOpacity="0.4" />
    </>
  ),
  chevron: <path d="M11 6.5 20.5 16 11 25.5" />,
};

function GlyphGroup({
  children,
  ...rest
}: SVGProps<SVGGElement> & { children: ReactNode }) {
  return (
    <g
      fill="none"
      stroke="currentColor"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      {children}
    </g>
  );
}

/** Inline glyph for use inside a parent `<svg>`. */
export function PsGlyph({
  name,
  x = 0,
  y = 0,
  size = 32,
}: {
  name: PsIconName;
  x?: number;
  y?: number;
  size?: number;
}) {
  const s = size / VB;
  return (
    <GlyphGroup
      transform={`translate(${x - size / 2} ${y - size / 2}) scale(${s})`}
      vectorEffect="non-scaling-stroke"
    >
      {paths[name]}
    </GlyphGroup>
  );
}

export function PsIcon({
  name,
  size = 32,
  className,
}: {
  name: PsIconName;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${VB} ${VB}`}
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {paths[name]}
    </svg>
  );
}
