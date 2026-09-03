import { PsIcon } from "@/components/icons/ProblemSolutionIcons";
import { FOOTER_STRIP } from "@/lib/site";

function CubeShield() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 32 32"
      width={28}
      height={28}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 4.5 26 9v6.5c0 6.2-4.2 10.4-10 12.5C10.2 25.9 6 21.7 6 15.5V9z" />
      <path d="M16 11.5 21 14.2v5.2L16 22l-5-2.6v-5.2z" />
      <path d="M16 11.5v10.5M11 14.2l5 2.8 5-2.8" strokeOpacity="0.55" />
    </svg>
  );
}

function GroundVehicle() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 32 32"
      width={28}
      height={28}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 18.5h20l-1.5 4H7.5z" />
      <path d="M8.5 18.5V13h9.5l4 5.5" />
      <circle cx="10.5" cy="23.5" r="1.8" />
      <circle cx="21.5" cy="23.5" r="1.8" />
      <path d="M11 13V9.5h5.5" />
    </svg>
  );
}

function Tools() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 32 32"
      width={28}
      height={28}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 7.5 8.5 11 18.5 21l2.2-.8L12 7.5z" />
      <path d="M8.5 11 6 13.5l3 3L12 14" />
      <path d="M20 8.5c2.2-2.2 5.4-2.5 7.2-.7L22.5 12.5l-2-2 4.2-4.2" />
      <path d="M18.5 21 22 24.5l2.5-2.5-3.5-3.5" />
    </svg>
  );
}

const ICONS = [
  { key: "satellite", node: <PsIcon name="satellite" size={28} /> },
  { key: "shield", node: <CubeShield /> },
  { key: "tower", node: <PsIcon name="radioTower" size={28} /> },
  { key: "ship", node: <PsIcon name="ship" size={28} /> },
  { key: "ground", node: <GroundVehicle /> },
  { key: "tools", node: <Tools /> },
] as const;

/** Vision line + domain icons — full-width strip at the top of the footer. */
export function FooterVision() {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
      <p className="max-w-2xl text-[1.05rem] leading-snug text-ist-muted sm:text-[1.15rem] lg:max-w-3xl lg:text-[1.2rem]">
        {FOOTER_STRIP.lead}{" "}
        <span className="text-ist-accent-bright">{FOOTER_STRIP.accent}</span>
      </p>

      <ul className="flex shrink-0 flex-wrap items-center gap-5 text-ist-accent-bright sm:justify-end sm:gap-6">
        {ICONS.map((icon) => (
          <li key={icon.key} aria-hidden="true">
            {icon.node}
          </li>
        ))}
      </ul>
    </div>
  );
}
