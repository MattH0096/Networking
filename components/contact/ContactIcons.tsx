type IconProps = { size?: number; className?: string };

const base = (size: number) =>
  ({
    viewBox: "0 0 24 24",
    width: size,
    height: size,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  }) as const;

export function ContactMessageIcon({ size = 22, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M4 6h16v10H8l-4 3V6z" />
      <path d="M8 10h5M8 13h8" />
    </svg>
  );
}

export function ContactPinIcon({ size = 20, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.25" />
    </svg>
  );
}

export function ContactNetworkIcon({ size = 20, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="6" cy="12" r="2.25" />
      <circle cx="18" cy="7" r="2.25" />
      <circle cx="18" cy="17" r="2.25" />
      <path d="M8.1 11.2 15.9 7.8M8.1 12.8 15.9 16.2" />
    </svg>
  );
}

export function ContactSendIcon({ size = 16, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M4 11.5 20 4l-6.5 16-2.2-6.3L4 11.5z" />
    </svg>
  );
}

export function ContactShieldIcon({ size = 14, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M12 3 20 6v6c0 4.5-3.2 7.9-8 9-4.8-1.1-8-4.5-8-9V6z" />
    </svg>
  );
}

export function ContactLockIcon({ size = 22, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <rect x="5" y="11" width="14" height="10" rx="1.5" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export function ContactPeopleIcon({ size = 22, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="9" cy="8" r="2.5" />
      <circle cx="16" cy="9" r="2" />
      <path d="M3.5 18c.6-2.6 2.7-4 5.5-4s4.9 1.4 5.5 4" />
      <path d="M14 14.2c1.7-.2 3.3.5 4.2 2.3" />
    </svg>
  );
}

export function ContactBroadcastIcon({ size = 22, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="12" cy="12" r="1.75" fill="currentColor" stroke="none" />
      <path d="M8.2 8.2a5.5 5.5 0 0 0 0 7.6M15.8 8.2a5.5 5.5 0 0 1 0 7.6" />
      <path d="M5.5 5.5a9.5 9.5 0 0 0 0 13M18.5 5.5a9.5 9.5 0 0 1 0 13" />
    </svg>
  );
}

/** Premium pillar marks — larger canvas, thinner stroke, node accents */
function pillarSvg(size: number, className?: string) {
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

export function ContactPillarShield({ size = 44, className }: IconProps) {
  return (
    <svg {...pillarSvg(size, className)}>
      <path d="M24 5 40 11v11.5c0 9.2-6.6 16.2-16 18.5C14.6 38.7 8 31.7 8 22.5V11z" />
      <path d="m17.5 23.5 4.2 4.2 9-9.2" />
      <circle cx="24" cy="16" r="1.5" fill="currentColor" stroke="none" opacity="0.9" />
    </svg>
  );
}

export function ContactPillarNetwork({ size = 44, className }: IconProps) {
  return (
    <svg {...pillarSvg(size, className)}>
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

export function ContactPillarLock({ size = 44, className }: IconProps) {
  return (
    <svg {...pillarSvg(size, className)}>
      <rect x="12" y="22" width="24" height="18" rx="2.5" />
      <path d="M17 22v-5.5a7 7 0 0 1 14 0V22" />
      <circle cx="24" cy="31" r="2.2" fill="currentColor" stroke="none" />
      <path d="M24 33.2v3.3" />
    </svg>
  );
}

export function ContactPillarPeople({ size = 44, className }: IconProps) {
  return (
    <svg {...pillarSvg(size, className)}>
      <circle cx="24" cy="14" r="5.2" />
      <path d="M11 38c1.6-6.4 5.6-9.5 13-9.5S34.4 31.6 36 38" />
      <circle cx="11" cy="18" r="3.8" opacity="0.95" />
      <path d="M4 36c1.1-4.2 3.6-6.5 7.2-7" opacity="0.95" />
      <circle cx="37" cy="18" r="3.8" opacity="0.95" />
      <path d="M44 36c-1.1-4.2-3.6-6.5-7.2-7" opacity="0.95" />
    </svg>
  );
}

export function ContactPillarIcon({
  name,
  size = 44,
}: {
  name: "shield" | "network" | "lock" | "people";
  size?: number;
}) {
  switch (name) {
    case "shield":
      return <ContactPillarShield size={size} />;
    case "network":
      return <ContactPillarNetwork size={size} />;
    case "lock":
      return <ContactPillarLock size={size} />;
    case "people":
      return <ContactPillarPeople size={size} />;
  }
}
