import {
  CareersNetworkMark,
  CareersPersonIcon,
  CareersShieldIcon,
  CareersStarIcon,
} from "@/components/careers/CareersIcons";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import { HIRING_BAND } from "@/lib/careers";

function TraitIcon({ name }: { name: (typeof HIRING_BAND.traits)[number]["icon"] }) {
  switch (name) {
    case "person":
      return <CareersPersonIcon size={40} />;
    case "shield":
      return <CareersShieldIcon size={40} />;
    case "star":
      return <CareersStarIcon size={40} />;
  }
}

/**
 * Hiring plate — one box: locked line left, three traits right.
 */
export function CareersHiringBand() {
  return (
    <section className="section-y bg-ist-bg pt-0">
      <Container>
        <Reveal variant="expand">
          <div className="rounded-sm border border-ist-accent/45 bg-black">
            <div className="grid lg:grid-cols-2 lg:items-stretch">
              <div className="flex items-center gap-4 px-5 py-8 sm:gap-5 sm:px-7 sm:py-9 lg:gap-6 lg:px-8 lg:py-10 xl:px-10">
                <div className="shrink-0 text-ist-accent-bright">
                  <CareersNetworkMark
                    size={96}
                    className="drop-shadow-[0_0_24px_rgba(250,98,40,0.45)]"
                  />
                </div>
                <p className="min-w-0 text-[1.05rem] font-semibold leading-[1.3] tracking-tight sm:text-[1.15rem] lg:text-[1.25rem]">
                  <span className="block text-ist-text">{HIRING_BAND.before}</span>
                  <span className="mt-0.5 block text-ist-accent-bright">{HIRING_BAND.accent}</span>
                </p>
              </div>

              <ul className="grid border-t border-white/10 sm:grid-cols-3 lg:border-l lg:border-t-0 lg:border-white/10">
                {HIRING_BAND.traits.map((trait, index) => (
                  <li
                    key={trait.id}
                    className={cn(
                      "flex flex-col items-center justify-center px-5 py-8 text-center sm:px-5 lg:px-6",
                      index > 0 &&
                        "border-t border-white/10 sm:border-t-0 sm:border-l sm:border-white/10",
                    )}
                  >
                    <span className="inline-flex text-ist-accent-bright drop-shadow-[0_0_12px_rgba(250,98,40,0.35)]">
                      <TraitIcon name={trait.icon} />
                    </span>
                    <p className="mt-4 text-[0.92rem] font-semibold text-ist-accent-bright">
                      {trait.title}
                    </p>
                    <p className="mt-1.5 text-[0.8rem] leading-snug text-ist-muted">{trait.body}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
