import { CareersRoleMark } from "@/components/careers/CareersIcons";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { Reveal } from "@/components/ui/Reveal";
import { OPEN_ROLES } from "@/lib/careers";

export type CareersRoleCard = {
  slug: string;
  title: string;
  team: string;
  location: string;
  type: string;
  summary: string;
};

function RuleTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-4">
      <div aria-hidden="true" className="h-px flex-1 bg-ist-accent/55" />
      <h2 className="shrink-0 text-[1.55rem] font-semibold tracking-tight text-ist-text sm:text-[1.75rem]">
        {title}
      </h2>
      <div aria-hidden="true" className="h-px flex-1 bg-ist-accent/55" />
    </div>
  );
}

function RoleCard({ role }: { role: CareersRoleCard }) {
  const meta = [role.team, role.location, role.type].filter(Boolean).join(" · ");

  return (
    <FeatureCard
      title={role.title}
      meta={meta}
      body={role.summary}
      icon={<CareersRoleMark size={44} />}
      footer={
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <Button
            href={`/careers/${role.slug}`}
            variant="ghost"
            withArrow
            className="!min-h-0 !px-0 text-ist-accent-bright"
          >
            {OPEN_ROLES.learnMore}
          </Button>
          <Button
            href={`/careers?role=${encodeURIComponent(role.slug)}#apply`}
            variant="ghost"
            withArrow
            className="!min-h-0 !px-0 text-ist-text"
          >
            {OPEN_ROLES.apply}
          </Button>
        </div>
      }
    />
  );
}

type Props = {
  roles: CareersRoleCard[];
};

/**
 * Open roles grid — only real CMS roles; empty state when none.
 */
export function CareersOpenRoles({ roles }: Props) {
  return (
    <section id="open-roles" className="section-y bg-ist-bg">
      <Container>
        <Reveal>
          <RuleTitle title={OPEN_ROLES.title} />
        </Reveal>

        {roles.length > 0 ? (
          <ul className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {roles.map((role, i) => (
              <Reveal as="li" key={role.slug} index={i % 3} className="h-full">
                <RoleCard role={role} />
              </Reveal>
            ))}
          </ul>
        ) : (
          <div className="mt-10 max-w-xl">
            <p className="text-[1.15rem] font-semibold text-ist-text">{OPEN_ROLES.emptyTitle}</p>
            <p className="mt-3 text-[0.95rem] text-ist-muted">{OPEN_ROLES.emptyBody}</p>
          </div>
        )}
      </Container>
    </section>
  );
}
