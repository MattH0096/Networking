type IconName = "doc" | "chart" | "review" | "lock" | "shield";

export function InsightIcon({ name, size = 16 }: { name: IconName; size?: number }) {
  const common = {
    viewBox: "0 0 24 24",
    width: size,
    height: size,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  switch (name) {
    case "doc":
      return (
        <svg {...common}>
          <path d="M7 3h7l5 5v13H7z" />
          <path d="M14 3v5h5M9 13h6M9 17h6" />
        </svg>
      );
    case "chart":
      return (
        <svg {...common}>
          <path d="M4 19V9M10 19V5M16 19v-7M22 19H2" />
        </svg>
      );
    case "review":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M8 12.5 10.5 15 16 9" />
        </svg>
      );
    case "lock":
      return (
        <svg {...common}>
          <rect x="5" y="11" width="14" height="10" rx="1.5" />
          <path d="M8 11V8a4 4 0 0 1 8 0v3" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path d="M12 3 20 6v6c0 4.5-3.2 7.9-8 9-4.8-1.1-8-4.5-8-9V6z" />
        </svg>
      );
  }
}
