import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getSiteContent } from "@/lib/cms/content";
import { OPEN_ROLES, parseRoleBody } from "@/lib/careers";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const content = await getSiteContent();
  const role = content.careers.roles.find((r) => r.slug === slug);
  if (!role) return { title: "Careers" };
  return {
    title: `${role.title} — Careers`,
    description: role.summary,
  };
}

export default async function CareersRolePage({ params }: Props) {
  const { slug } = await params;
  const content = await getSiteContent();
  const role = content.careers.roles.find((r) => r.slug === slug);
  if (!role) notFound();

  const meta = [role.team, role.location, role.type].filter(Boolean).join(" · ");
  const blocks = parseRoleBody(role.body);
  const applyHref = `/careers?role=${encodeURIComponent(role.slug)}#apply`;

  return (
    <article className="section-y bg-ist-bg">
      <Container className="max-w-3xl">
        <p className="mb-8">
          <Link
            href="/careers#open-roles"
            className="text-[0.85rem] text-ist-muted transition-colors hover:text-ist-text"
          >
            ← All open roles
          </Link>
        </p>

        <p className="font-mono text-[0.68rem] font-medium uppercase tracking-[0.16em] text-ist-accent-bright">
          Open role
        </p>
        <h1 className="mt-3 text-[1.75rem] font-semibold leading-tight tracking-tight text-ist-text sm:text-[2.15rem]">
          {role.title}
        </h1>
        {meta ? <p className="mt-3 text-[0.9rem] text-ist-dim">{meta}</p> : null}
        {role.summary ? (
          <p className="mt-6 text-[1.05rem] leading-relaxed text-ist-muted">{role.summary}</p>
        ) : null}

        <div className="mt-8">
          <Button href={applyHref} variant="primary" withArrow>
            {OPEN_ROLES.apply}
          </Button>
        </div>

        <div className="mt-10 flex flex-col gap-5 text-[1rem] leading-relaxed text-ist-text/90">
          {blocks.length > 0 ? (
            blocks.map((block, i) => {
              if (block.type === "heading") {
                return (
                  <h2
                    key={`h-${i}`}
                    className="mt-4 text-[1.25rem] font-semibold tracking-tight text-ist-text first:mt-0"
                  >
                    {block.text}
                  </h2>
                );
              }
              if (block.type === "subheading") {
                return (
                  <h3
                    key={`s-${i}`}
                    className="mt-2 text-[0.95rem] font-semibold uppercase tracking-[0.06em] text-ist-accent-bright"
                  >
                    {block.text}
                  </h3>
                );
              }
              if (block.type === "list") {
                return (
                  <ul key={`l-${i}`} className="flex list-none flex-col gap-2 pl-0">
                    {block.items.map((item) => (
                      <li key={item} className="flex gap-2.5 text-ist-text/90">
                        <span aria-hidden="true" className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-ist-accent" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                );
              }
              return <p key={`p-${i}`}>{block.text}</p>;
            })
          ) : (
            <p className="text-ist-muted">Full role description coming soon.</p>
          )}
        </div>

        <div className="mt-12 border-t border-ist-line pt-8">
          <Button href={applyHref} variant="primary" withArrow>
            {OPEN_ROLES.apply}
          </Button>
        </div>
      </Container>
    </article>
  );
}
