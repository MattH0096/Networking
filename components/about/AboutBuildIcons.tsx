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

export function AboutBuildShieldIcon({ size = 56, className }: IconProps) {
  return (
    <svg {...svg(size, className)}>
      <path d="M24 5 40 11v11.5c0 9.2-6.6 16.2-16 18.5C14.6 38.7 8 31.7 8 22.5V11z" />
      <path d="m17.5 23.5 4.2 4.2 9-9.2" />
      <circle cx="24" cy="16" r="1.5" fill="currentColor" stroke="none" opacity="0.9" />
    </svg>
  );
}

export function AboutBuildNetworkIcon({ size = 56, className }: IconProps) {
  return (
    <svg {...svg(size, className)}>
      <circle cx="24" cy="24" r="4" />
      <circle cx="10" cy="12" r="3" />
      <circle cx="38" cy="12" r="3" />
      <circle cx="10" cy="36" r="3" />
      <circle cx="38" cy="36" r="3" />
      <path d="M12.8 14.2 20.4 21.2M35.2 14.2 27.6 21.2M12.8 33.8 20.4 26.8M35.2 33.8 27.6 26.8" />
      <circle cx="24" cy="24" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function AboutBuildStackIcon({ size = 56, className }: IconProps) {
  return (
    <svg {...svg(size, className)}>
      <path d="M24 8 40 16 24 24 8 16z" />
      <path d="M8 22 24 30 40 22" />
      <path d="M8 30 24 38 40 30" />
      <circle cx="24" cy="16" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function AboutBuildLockIcon({ size = 56, className }: IconProps) {
  return (
    <svg {...svg(size, className)}>
      <rect x="12" y="22" width="24" height="18" rx="2.5" />
      <path d="M17 22v-5.5a7 7 0 0 1 14 0V22" />
      <circle cx="24" cy="31" r="2.2" fill="currentColor" stroke="none" />
      <path d="M24 33.2v3.3" />
    </svg>
  );
}

export function AboutBuildChartIcon({ size = 56, className }: IconProps) {
  return (
    <svg {...svg(size, className)}>
      <path d="M8 38V22M18 38V16M28 38V26" />
      <path d="m24 14 8-8 6 4" />
      <path d="M8 38h30" opacity="0.45" />
      <circle cx="32" cy="8" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function AboutBuildIcon({
  name,
  size = 56,
}: {
  name: "shield" | "network" | "stack" | "lock" | "chart";
  size?: number;
}) {
  switch (name) {
    case "shield":
      return <AboutBuildShieldIcon size={size} />;
    case "network":
      return <AboutBuildNetworkIcon size={size} />;
    case "stack":
      return <AboutBuildStackIcon size={size} />;
    case "lock":
      return <AboutBuildLockIcon size={size} />;
    case "chart":
      return <AboutBuildChartIcon size={size} />;
  }
}
