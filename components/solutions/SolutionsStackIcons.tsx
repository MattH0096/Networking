type IconProps = { size?: number; className?: string };

function svg(size: number, className?: string) {
  return {
    viewBox: "0 0 48 48",
    width: size,
    height: size,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
    className,
  };
}

/** Software — layered distribution nodes */
export function SolutionsStackCodeIcon({ size = 56, className }: IconProps) {
  return (
    <svg {...svg(size, className)}>
      <circle cx="24" cy="12" r="3.2" />
      <circle cx="10" cy="34" r="3.2" />
      <circle cx="38" cy="34" r="3.2" />
      <circle cx="24" cy="26" r="3.6" />
      <path d="M24 15.2v7.2M21.4 28.6 12.4 32.6M26.6 28.6l9 4" />
      <circle cx="24" cy="26" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Simulation — waveform / scope */
export function SolutionsStackCubeIcon({ size = 56, className }: IconProps) {
  return (
    <svg {...svg(size, className)}>
      <rect x="7" y="9" width="34" height="26" rx="2.5" />
      <path d="M12 28 17 18l5 12 5-16 5 10 4-6" />
      <path d="M16 41h16M24 35v6" opacity="0.7" />
      <circle cx="36" cy="15" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Hardware — rugged module with connectors */
export function SolutionsStackChipIcon({ size = 56, className }: IconProps) {
  return (
    <svg {...svg(size, className)}>
      <rect x="12" y="12" width="24" height="24" rx="2.5" />
      <rect x="17" y="17" width="14" height="14" rx="1.5" opacity="0.85" />
      <circle cx="24" cy="24" r="2.4" fill="currentColor" stroke="none" />
      <path d="M18 12V7M24 12V7M30 12V7M18 41v-5M24 41v-5M30 41v-5M12 18H7M12 24H7M12 30H7M41 18h-5M41 24h-5M41 30h-5" />
    </svg>
  );
}

/** Integration — interlocking links */
export function SolutionsStackPuzzleIcon({ size = 56, className }: IconProps) {
  return (
    <svg {...svg(size, className)}>
      <path d="M14 18.5a6.5 6.5 0 0 1 9.2-9.2l1.6 1.6" />
      <path d="M34 29.5a6.5 6.5 0 0 1-9.2 9.2l-1.6-1.6" />
      <path d="M20.5 16.5 31.5 27.5" />
      <circle cx="16.5" cy="14.5" r="2.2" fill="currentColor" stroke="none" />
      <circle cx="31.5" cy="33.5" r="2.2" fill="currentColor" stroke="none" />
      <path d="M28 12h8v8M20 36h-8v-8" opacity="0.75" />
    </svg>
  );
}

export function SolutionsStackIcon({
  name,
  size = 56,
}: {
  name: "code" | "cube" | "chip" | "puzzle";
  size?: number;
}) {
  switch (name) {
    case "code":
      return <SolutionsStackCodeIcon size={size} />;
    case "cube":
      return <SolutionsStackCubeIcon size={size} />;
    case "chip":
      return <SolutionsStackChipIcon size={size} />;
    case "puzzle":
      return <SolutionsStackPuzzleIcon size={size} />;
  }
}
