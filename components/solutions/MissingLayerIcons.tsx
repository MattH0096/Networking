type IconProps = { size?: number; className?: string };

function svg(size: number, className?: string) {
  return {
    viewBox: "0 0 32 32",
    width: size,
    height: size,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
    className,
  };
}

export type MissingLayerIconName =
  | "applications"
  | "distribution"
  | "transport"
  | "network"
  | "datalink"
  | "physical"
  | "mission"
  | "adaptive"
  | "persistent"
  | "cross"
  | "thesis"
  | "locus"
  | "crucible"
  | "hardware";

function ApplicationsIcon({ size = 22, className }: IconProps) {
  return (
    <svg {...svg(size, className)}>
      <rect x="5" y="7" width="22" height="16" rx="2" />
      <path d="M5 12h22" />
      <circle cx="9" cy="9.5" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="12.5" cy="9.5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function DistributionIcon({ size = 22, className }: IconProps) {
  return (
    <svg {...svg(size, className)}>
      <path d="M16 6 24 10.5v9L16 24l-8-4.5v-9z" />
      <circle cx="16" cy="15" r="2.2" />
      <path d="M16 8.5v4.2M11.2 12.2l3.4 2M20.8 12.2l-3.4 2" opacity="0.75" />
    </svg>
  );
}

function TransportIcon({ size = 22, className }: IconProps) {
  return (
    <svg {...svg(size, className)}>
      <path d="M16 5v22M10 11l6-6 6 6M10 21l6 6 6-6" />
    </svg>
  );
}

function NetworkIcon({ size = 22, className }: IconProps) {
  return (
    <svg {...svg(size, className)}>
      <circle cx="8" cy="22" r="2.4" />
      <circle cx="24" cy="22" r="2.4" />
      <circle cx="16" cy="8" r="2.4" />
      <path d="M9.8 20.2 14.2 10.2M22.2 20.2 17.8 10.2M10.4 22h11.2" />
    </svg>
  );
}

function DataLinkIcon({ size = 22, className }: IconProps) {
  return (
    <svg {...svg(size, className)}>
      <path d="M13 12a4.5 4.5 0 0 1 6.4-6.4l2 2" />
      <path d="M19 20a4.5 4.5 0 0 1-6.4 6.4l-2-2" />
      <path d="M12.5 13.5 19.5 20.5" />
    </svg>
  );
}

function PhysicalIcon({ size = 22, className }: IconProps) {
  return (
    <svg {...svg(size, className)}>
      <path d="M4 16h4l3-7 4 14 3-7h6" />
    </svg>
  );
}

function MissionIcon({ size = 22, className }: IconProps) {
  return (
    <svg {...svg(size, className)}>
      <circle cx="16" cy="16" r="9" />
      <circle cx="16" cy="16" r="4.5" />
      <circle cx="16" cy="16" r="1.4" fill="currentColor" stroke="none" />
      <path d="M16 4v3M16 25v3M4 16h3M25 16h3" opacity="0.7" />
    </svg>
  );
}

function AdaptiveIcon({ size = 22, className }: IconProps) {
  return (
    <svg {...svg(size, className)}>
      <path d="M6 16h8" />
      <path d="M14 16 22 8M14 16l8 8M14 16l8 0" />
      <path d="M22 8h4M22 16h4M22 24h4" opacity="0.7" />
    </svg>
  );
}

function PersistentIcon({ size = 22, className }: IconProps) {
  return (
    <svg {...svg(size, className)}>
      <path d="M16 4.5 25 8v6.2c0 5.6-3.8 9.4-9 11.3C10.8 23.6 7 19.8 7 14.2V8z" />
      <path d="m11.5 15.5 3 3 6-6.5" />
    </svg>
  );
}

function CrossIcon({ size = 22, className }: IconProps) {
  return (
    <svg {...svg(size, className)}>
      <circle cx="16" cy="16" r="9" />
      <path d="M7 16h18M16 7c2.8 2.6 4.2 5.4 4.2 9S18.8 22.4 16 25c-2.8-2.6-4.2-5.4-4.2-9S13.2 9.6 16 7z" />
      <circle cx="11" cy="12" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="22" cy="18" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ThesisIcon({ size = 22, className }: IconProps) {
  return (
    <svg {...svg(size, className)}>
      <path d="M9 5h11l5 5v17H9z" />
      <path d="M20 5v5h5M12 15h10M12 19h10M12 23h7" />
    </svg>
  );
}

function LocusIcon({ size = 22, className }: IconProps) {
  return (
    <svg {...svg(size, className)}>
      <path d="M16 5 26 16 16 27 6 16z" />
      <path d="M16 11 21 16 16 21 11 16z" opacity="0.75" />
    </svg>
  );
}

function CrucibleIcon({ size = 22, className }: IconProps) {
  return (
    <svg {...svg(size, className)}>
      <path d="M10 8h12l2 6H8z" />
      <path d="M9 14h14l-2 11H11z" />
      <path d="M14 8V5h4v3M13 19h6" opacity="0.75" />
    </svg>
  );
}

function HardwareIcon({ size = 22, className }: IconProps) {
  return (
    <svg {...svg(size, className)}>
      <rect x="9" y="9" width="14" height="14" rx="1.5" />
      <rect x="12" y="12" width="8" height="8" rx="1" opacity="0.85" />
      <path d="M12 9V6M16 9V6M20 9V6M12 26v-3M16 26v-3M20 26v-3M9 12H6M9 16H6M9 20H6M26 12h-3M26 16h-3M26 20h-3" />
    </svg>
  );
}

export function MissingLayerIcon({
  name,
  size = 22,
  className,
}: {
  name: MissingLayerIconName;
  size?: number;
  className?: string;
}) {
  switch (name) {
    case "applications":
      return <ApplicationsIcon size={size} className={className} />;
    case "distribution":
      return <DistributionIcon size={size} className={className} />;
    case "transport":
      return <TransportIcon size={size} className={className} />;
    case "network":
      return <NetworkIcon size={size} className={className} />;
    case "datalink":
      return <DataLinkIcon size={size} className={className} />;
    case "physical":
      return <PhysicalIcon size={size} className={className} />;
    case "mission":
      return <MissionIcon size={size} className={className} />;
    case "adaptive":
      return <AdaptiveIcon size={size} className={className} />;
    case "persistent":
      return <PersistentIcon size={size} className={className} />;
    case "cross":
      return <CrossIcon size={size} className={className} />;
    case "thesis":
      return <ThesisIcon size={size} className={className} />;
    case "locus":
      return <LocusIcon size={size} className={className} />;
    case "crucible":
      return <CrucibleIcon size={size} className={className} />;
    case "hardware":
      return <HardwareIcon size={size} className={className} />;
  }
}
