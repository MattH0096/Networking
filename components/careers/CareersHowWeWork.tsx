import {
  CareersBoltIcon,
  CareersChartIcon,
  CareersChatIcon,
  CareersFlagIcon,
  CareersPeopleIcon,
  CareersRoleMark,
  CareersTargetIcon,
} from "@/components/careers/CareersIcons";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { HOW_WE_WORK } from "@/lib/careers";

function WorkIcon({ name }: { name: (typeof HOW_WE_WORK.items)[number]["icon"] }) {
  switch (name) {
    case "flag":
      return <CareersFlagIcon size={28} />;
    case "target":
      return <CareersTargetIcon size={28} />;
    case "chat":
      return <CareersChatIcon size={28} />;
    case "bolt":
      return <CareersBoltIcon size={28} />;
    case "chart":
      return <CareersChartIcon size={28} />;
    case "people":
      return <CareersPeopleIcon size={28} />;
  }
}

/**
 * How We Work — horizontal process flow with icon nodes on a connecting rail.
 */
export function CareersHowWeWork() {
  return (
    <section className="section-y bg-ist-bg pt-0">
      <Container>
        <Reveal variant="expand">
          <h2 className="text-center text-[1.45rem] font-semibold tracking-tight text-ist-text sm:text-[1.65rem]">
            {HOW_WE_WORK.title}
          </h2>

          <ol className="relative mt-12 list-none p-0 sm:mt-14">
            {/* Connecting rail — desktop */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-[8%] right-[8%] top-8 hidden h-px bg-gradient-to-r from-transparent via-ist-accent/55 to-transparent lg:block"
            />

            <div className="grid gap-10 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-12 lg:grid-cols-6 lg:gap-x-4 lg:gap-y-0">
              {HOW_WE_WORK.items.map((item, index) => (
                <li key={item.id} className="relative flex flex-col items-center text-center">
                  {/* Mobile / tablet connector stubs */}
                  {index < HOW_WE_WORK.items.length - 1 ? (
                    <span
                      aria-hidden="true"
                      className="absolute left-1/2 top-16 h-10 w-px -translate-x-1/2 bg-ist-accent/35 sm:hidden"
                    />
                  ) : null}

                  <span className="relative z-[1] flex h-16 w-16 items-center justify-center rounded-full border border-ist-line-strong bg-[#0a0a0a] text-ist-accent-bright shadow-[0_0_0_6px_#000] ring-1 ring-ist-accent/25">
                    <WorkIcon name={item.icon} />
                  </span>

                  <h3 className="mt-5 text-[0.98rem] font-semibold tracking-tight text-ist-text sm:text-[1.02rem]">
                    {item.title}
                  </h3>
                  <p className="mt-2 max-w-[14rem] text-[0.84rem] leading-relaxed text-ist-muted lg:max-w-none">
                    {item.body}
                  </p>
                </li>
              ))}
            </div>
          </ol>

          <p className="mt-10 flex items-center justify-center gap-2.5 text-center text-[0.92rem] text-ist-muted sm:mt-12">
            <span className="text-ist-accent-bright">
              <CareersRoleMark size={18} />
            </span>
            {HOW_WE_WORK.footer}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
