/**
 * Line icon set — crisp 24×24 marks for FeatureCards.
 * Colour is inherited so parents can tint on hover.
 */

export type IconName =
  // Locus flow
  | "store"
  | "route"
  | "adapt"
  | "deliver"
  // Crucible flow
  | "build"
  | "model"
  | "simulate"
  | "validate"
  // Feature tiles
  | "degraded"
  | "bandwidth"
  | "integrity"
  | "mission"
  | "missionFirst"
  | "platform"
  | "insertion"
  | "simulation"
  | "check";

/** Default FeatureCard glyph size (2× prior 26). */
export const FEATURE_ICON_SIZE = 52;

const paths: Record<IconName, React.ReactNode> = {
  store: (
    <>
      <path d="M3.5 8 12 3.5 20.5 8v8.5L12 21 3.5 16.5z" />
      <path d="M3.5 8 12 12.5 20.5 8" />
      <path d="M12 12.5V21" />
      <circle cx="12" cy="12.5" r="1.35" fill="currentColor" stroke="none" />
    </>
  ),
  route: (
    <>
      <circle cx="5" cy="6" r="2.25" />
      <circle cx="19" cy="6" r="2.25" />
      <circle cx="19" cy="18" r="2.25" />
      <path d="M7.2 6.4h3.3a4.2 4.2 0 0 1 4.2 4.2v3.2a4.2 4.2 0 0 0 4.2 4.2" />
      <path d="M16.8 6.4H14" opacity="0.7" />
    </>
  ),
  adapt: (
    <>
      <path d="M3 8.5h10.5a4.5 4.5 0 0 1 4.5 4.5" />
      <path d="M15 5.2 18.8 9 15 12.8" />
      <path d="M21 15.5H10.5A4.5 4.5 0 0 1 6 11" />
      <path d="M9 18.8 5.2 15 9 11.2" />
    </>
  ),
  deliver: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M7.8 12.4 10.8 15.4 16.4 9" />
    </>
  ),
  build: (
    <>
      <path d="M3.5 17.5 9.2 8.2l3.8 5.2 3.2-4.4 4.3 8.5z" />
      <path d="M3 21h18" />
      <circle cx="9.2" cy="8.2" r="1.2" fill="currentColor" stroke="none" />
    </>
  ),
  model: (
    <>
      <circle cx="12" cy="5" r="2.2" />
      <circle cx="5" cy="18.5" r="2.2" />
      <circle cx="19" cy="18.5" r="2.2" />
      <circle cx="12" cy="13.5" r="2" />
      <path d="M12 7.2v4.2M10.4 15 6.8 17.3M13.6 15l3.6 2.3" />
    </>
  ),
  simulate: (
    <>
      <path d="M3.5 12h2.8l2.4-5.8 2.8 11.6 2.4-5.8H20.5" />
      <path d="M3.5 4v16" />
      <circle cx="20.5" cy="12" r="1.2" fill="currentColor" stroke="none" />
    </>
  ),
  validate: (
    <>
      <rect x="4.5" y="3.5" width="15" height="17" rx="2" />
      <path d="M8.2 11.2 10.8 13.8 15.8 8.2" />
      <path d="M9 16.5h6" opacity="0.7" />
    </>
  ),
  degraded: (
    <>
      <path d="M12 20.5V9.5" />
      <path d="M7.5 20.5h9" />
      <path d="M12 9.5 8.2 5.7M12 9.5l3.8-3.8" />
      <path d="M5.2 8a8.5 8.5 0 0 1 0 8M18.8 8a8.5 8.5 0 0 0 0 8" />
      <path d="M7.6 10a5.2 5.2 0 0 1 0 4M16.4 10a5.2 5.2 0 0 0 0 4" />
    </>
  ),
  bandwidth: (
    <>
      <path d="M4.5 18.5V10M9 18.5V7M13.5 18.5v-6" />
      <path d="M16.5 13 19.5 10 22.5 13" />
      <path d="M19.5 10v8.5" />
      <path d="M3.5 21h12" opacity="0.55" />
    </>
  ),
  integrity: (
    <>
      <path d="M12 3.2 20 6.2v5.8c0 4.6-3.3 8-8 9.2-4.7-1.2-8-4.6-8-9.2V6.2z" />
      <path d="M8.4 12.2 11.1 14.9 15.8 9.6" />
    </>
  ),
  mission: (
    <>
      <rect x="5.5" y="10.5" width="13" height="10.5" rx="2" />
      <path d="M8.5 10.5V7.8a3.5 3.5 0 0 1 7 0v2.7" />
      <circle cx="12" cy="15.8" r="1.35" fill="currentColor" stroke="none" />
    </>
  ),
  missionFirst: (
    <>
      <path d="M4 9.2 12 4.8l8 4.4v9L12 22.6 4 18.2z" />
      <path d="M4 9.2l8 4.4 8-4.4M12 13.6v9" />
      <path d="m12 3.2.95 2 2.2.25-1.65 1.5.5 2.15L12 8.1l-2 .95.5-2.15-1.65-1.5 2.2-.25z" />
    </>
  ),
  platform: (
    <>
      <path d="M12 3.2 20.2 7.6v8.8L12 20.8 3.8 16.4V7.6z" />
      <path d="M12 3.2v17.6M3.8 7.6l8.2 4.4 8.2-4.4" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
    </>
  ),
  insertion: (
    <>
      <path d="M9.2 14.6 7.6 16.2a3.8 3.8 0 1 1 0-5.4l1.8-1.8" />
      <path d="M14.8 9.4 16.4 7.8a3.8 3.8 0 1 1 0 5.4l-1.8 1.8" />
      <path d="M10 14.2 14 10.2" />
    </>
  ),
  simulation: (
    <>
      <rect x="3.2" y="4" width="17.6" height="12.5" rx="2" />
      <path d="M8 21h8M12 16.5V21" />
      <path d="M7 13 10.2 9.6l2.8 2.4 3.8-4.6" />
    </>
  ),
  check: <path d="M4 12.5 9.6 18 20 6.2" />,
};

export function Icon({ name, size = FEATURE_ICON_SIZE }: { name: IconName; size?: number }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}
