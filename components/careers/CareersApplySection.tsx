import { Suspense } from "react";

import { CareersApplyForm } from "@/components/careers/CareersApplyForm";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { OPEN_ROLES } from "@/lib/careers";

type Role = {
  slug: string;
  title: string;
};

type Props = {
  roles: Role[];
};

/**
 * Apply section — shown when roles exist; form matches approved application mock.
 */
export function CareersApplySection({ roles }: Props) {
  return (
    <section id="apply" className="section-y bg-ist-bg pt-0 scroll-mt-24">
      <Container>
        <Reveal>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-[1.55rem] font-semibold tracking-tight text-ist-text sm:text-[1.75rem]">
              {OPEN_ROLES.applyHeading}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-[0.95rem] text-ist-muted">
              {OPEN_ROLES.applyLead}
            </p>
            <div className="mt-8 sm:mt-10">
              <Suspense
                fallback={
                  <div
                    className="min-h-[28rem] border border-ist-line bg-black/40"
                    aria-hidden="true"
                  />
                }
              >
                <CareersApplyForm roles={roles} />
              </Suspense>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
