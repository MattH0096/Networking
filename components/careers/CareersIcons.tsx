type IconProps = { size?: number; className?: string };

function svg(size: number, className?: string) {
  return {
    viewBox: "0 0 48 48",
    width: size,
    height: size,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.55,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
    className,
  };
}

/** Atom / orbital — Why Build */
export function CareersAtomIcon({ size = 36, className }: IconProps) {
  return (
    <svg {...svg(size, className)}>
      <circle cx="24" cy="24" r="3.2" fill="currentColor" stroke="none" />
      <ellipse cx="24" cy="24" rx="18" ry="7" />
      <ellipse cx="24" cy="24" rx="18" ry="7" transform="rotate(60 24 24)" />
      <ellipse cx="24" cy="24" rx="18" ry="7" transform="rotate(120 24 24)" />
      <circle cx="40" cy="20" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="12" cy="32" r="1.4" fill="currentColor" stroke="none" opacity="0.85" />
    </svg>
  );
}

/** Branching network — Why Build */
export function CareersNodesIcon({ size = 36, className }: IconProps) {
  return (
    <svg {...svg(size, className)}>
      <circle cx="24" cy="24" r="3.4" fill="currentColor" stroke="none" />
      <circle cx="10" cy="12" r="2.4" />
      <circle cx="38" cy="12" r="2.4" />
      <circle cx="8" cy="34" r="2.4" />
      <circle cx="40" cy="34" r="2.4" />
      <circle cx="24" cy="8" r="2.2" />
      <path d="M12.2 13.6 21.2 22.2M35.8 13.6 26.8 22.2M10.2 32.2 21 26.2M37.8 32.2 27 26.2M24 11.2v9" />
    </svg>
  );
}

/** Three people — Why Build / How We Work */
export function CareersPeopleIcon({ size = 36, className }: IconProps) {
  return (
    <svg {...svg(size, className)}>
      <circle cx="24" cy="14" r="5" />
      <path d="M12 36c1.4-6 5.2-9 12-9s10.6 3 12 9" />
      <circle cx="11" cy="18" r="3.6" opacity="0.9" />
      <path d="M4 34c1-4 3.4-6.2 7-6.6" opacity="0.9" />
      <circle cx="37" cy="18" r="3.6" opacity="0.9" />
      <path d="M44 34c-1-4-3.4-6.2-7-6.6" opacity="0.9" />
    </svg>
  );
}

/** Compass — Why Build */
export function CareersCompassIcon({ size = 36, className }: IconProps) {
  return (
    <svg {...svg(size, className)}>
      <circle cx="24" cy="24" r="16" />
      <circle cx="24" cy="24" r="1.8" fill="currentColor" stroke="none" />
      <path d="m28.8 16.5-3.4 11.2-11.2 3.4 3.4-11.2z" />
      <path d="M24 8v3.2M24 36.8V40M8 24h3.2M36.8 24H40" opacity="0.55" />
    </svg>
  );
}

/** Wireframe globe — Why Build */
export function CareersGlobeIcon({ size = 36, className }: IconProps) {
  return (
    <svg {...svg(size, className)}>
      <circle cx="24" cy="24" r="16" />
      <ellipse cx="24" cy="24" rx="7" ry="16" />
      <path d="M8.5 18h31M8.5 30h31M8 24h32" />
    </svg>
  );
}

/** Glowing network hex mark — hiring card */
export function CareersNetworkMark({ size = 112, className }: IconProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <filter id="careersGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2.2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g stroke="currentColor" strokeWidth="1.15" filter="url(#careersGlow)">
        <path d="M60 18 92 36.5v37L60 92 28 73.5v-37z" />
        <path d="M60 34 78 44.5v21L60 76 42 65.5v-21z" opacity="0.9" />
        <path d="M60 18v16M92 36.5 78 44.5M92 73.5 78 65.5M60 92v-16M28 73.5 42 65.5M28 36.5 42 44.5" opacity="0.55" />
        {[
          [60, 18],
          [92, 36.5],
          [92, 73.5],
          [60, 92],
          [28, 73.5],
          [28, 36.5],
          [60, 34],
          [78, 44.5],
          [78, 65.5],
          [60, 76],
          [42, 65.5],
          [42, 44.5],
          [60, 55],
        ].map(([cx, cy], i) => (
          <circle
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r={i === 12 ? 3.4 : 2.1}
            fill="currentColor"
            stroke="none"
            opacity={i === 12 ? 1 : 0.85}
          />
        ))}
      </g>
    </svg>
  );
}

export function CareersPersonIcon({ size = 40, className }: IconProps) {
  return (
    <svg {...svg(size, className)}>
      <circle cx="24" cy="15" r="6.5" />
      <path d="M8 40c2.4-8 7.2-12 16-12s13.6 4 16 12" />
      <circle cx="24" cy="28.5" r="2" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function CareersShieldIcon({ size = 40, className }: IconProps) {
  return (
    <svg {...svg(size, className)}>
      <path d="M24 5 40 11v11.5c0 9.2-6.6 16.2-16 18.5C14.6 38.7 8 31.7 8 22.5V11z" />
      <path d="m17.5 23.5 4.2 4.2 9-9.2" />
    </svg>
  );
}

export function CareersStarIcon({ size = 40, className }: IconProps) {
  return (
    <svg {...svg(size, className)}>
      <path d="m24 6 4.7 9.6 10.6 1.55-7.65 7.45 1.8 10.5L24 30.2l-9.45 4.9 1.8-10.5-7.65-7.45 10.6-1.55z" />
      <circle cx="24" cy="24" r="2" fill="currentColor" stroke="none" opacity="0.85" />
    </svg>
  );
}

/** Mountain + flag — How We Work */
export function CareersFlagIcon({ size = 32, className }: IconProps) {
  return (
    <svg {...svg(size, className)}>
      <path d="m6 38 12-18 7 9 6-12 11 21" />
      <path d="M25 12V6.5" />
      <path d="M25 6.5h10l-2.2 3.2L35 13H25" />
    </svg>
  );
}

export function CareersTargetIcon({ size = 32, className }: IconProps) {
  return (
    <svg {...svg(size, className)}>
      <circle cx="24" cy="24" r="15" />
      <circle cx="24" cy="24" r="9" />
      <circle cx="24" cy="24" r="3.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function CareersChatIcon({ size = 32, className }: IconProps) {
  return (
    <svg {...svg(size, className)}>
      <path d="M8 12h18v12H18l-5 5v-5H8z" />
      <path d="M20 18h12v10h-4.5L24 32.5V28H20z" opacity="0.75" />
    </svg>
  );
}

export function CareersBoltIcon({ size = 32, className }: IconProps) {
  return (
    <svg {...svg(size, className)}>
      <path d="M27 6 14 26h8L19 42 36 20h-8z" />
    </svg>
  );
}

export function CareersChartIcon({ size = 32, className }: IconProps) {
  return (
    <svg {...svg(size, className)}>
      <path d="M8 38V22M18 38V16M28 38V26" />
      <path d="m24 14 8-8 6 4" />
      <path d="M8 38h30" opacity="0.45" />
    </svg>
  );
}

export function CareersRoleMark({ size = 22, className }: IconProps) {
  return (
    <svg {...svg(size, className)} viewBox="0 0 24 24" width={size} height={size} strokeWidth={1.4}>
      <path d="M12 2.4 20.2 7v10L12 21.6 3.8 17V7z" />
      <path d="M12 7.8 16.2 10.2v5.2L12 17.8 7.8 15.4v-5.2z" opacity="0.7" />
      <circle cx="12" cy="12.8" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}
