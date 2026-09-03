"use client";

import Link from "next/link";
import { useState } from "react";

import {
  AdminField,
  AdminSectionForm,
  adminInputClass,
  joinLines,
  split2,
} from "@/components/admin/form-shared";
import { AutoTextarea } from "@/components/admin/AutoTextarea";
import type { SiteContent } from "@/lib/cms/content";
import { newId, slugify } from "@/lib/cms/id";
import { ROLE_TYPES, type RoleType } from "@/lib/cms/types";
import { DEFAULT_CAREERS_ROLES } from "@/lib/careers";

type Props = {
  content: SiteContent["careers"];
};

type Role = SiteContent["careers"]["roles"][number];

function emptyRole(): Role {
  const id = newId("role");
  return {
    id,
    slug: id,
    title: "",
    team: "",
    location: "",
    type: "Full-time",
    summary: "",
    body: "",
  };
}

export function AdminCareersEditor({ content }: Props) {
  const [v, setV] = useState(() => ({
    ...content,
    roles: content.roles.length > 0 ? content.roles : DEFAULT_CAREERS_ROLES.map((r) => ({
      id: r.id ?? r.slug,
      slug: r.slug,
      title: r.title,
      team: r.team,
      location: r.location,
      type: r.type,
      summary: r.summary,
      body: r.body ?? "",
    })),
  }));
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  function set<K extends keyof typeof v>(key: K, value: (typeof v)[K]) {
    setV((prev) => ({ ...prev, [key]: value }));
  }

  function updateRole(i: number, patch: Partial<Role>) {
    set(
      "roles",
      v.roles.map((r, j) => (j === i ? { ...r, ...patch } : r)),
    );
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setMessage(null);

    const roles = v.roles.map((role, i) => {
      const slug = slugify(role.slug || role.title) || `role-${i + 1}`;
      return {
        id: role.id || slug,
        slug,
        title: role.title.trim(),
        team: role.team.trim(),
        location: role.location.trim(),
        type: role.type,
        summary: role.summary.trim(),
        body: role.body.trim(),
      };
    });

    const patch = {
      careers: {
        eyebrow: v.eyebrow,
        title: v.title,
        titleLine1: v.titleLine1,
        titleLine2: v.titleLine2,
        lead: v.lead,
        roles,
      },
    };

    const res = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setStatus("error");
      setMessage(data?.error ?? "Save failed.");
      return;
    }
    setStatus("saved");
    setMessage("Saved. Open /careers in a new tab (hard refresh) to see the role.");
    setV((prev) => ({ ...prev, roles }));
  }

  return (
    <form onSubmit={onSave} className="max-w-4xl">
      <h1 className="text-[1.75rem] font-semibold tracking-tight">Careers</h1>
      <p className="mt-2 text-[0.95rem] text-ist-muted">
        Add, edit, or remove open roles. Summary shows on the careers list; body is the full
        detail page at <code className="text-ist-text">/careers/[slug]</code>. Click{" "}
        <strong className="text-ist-text">Save careers</strong> to publish.
      </p>

      <div className="mt-8 flex flex-col gap-8">
        <AdminSectionForm title="Hero">
          <div className="grid gap-4">
            <AdminField label="Eyebrow" value={v.eyebrow} onChange={(x) => set("eyebrow", x)} />
            <AdminField
              label="Title (two lines)"
              value={joinLines([v.titleLine1, v.titleLine2])}
              onChange={(x) => {
                const [a, b] = split2(x);
                setV((prev) => ({
                  ...prev,
                  titleLine1: a,
                  titleLine2: b,
                  title: [a, b].filter(Boolean).join(" "),
                }));
              }}
              multiline
              rows={2}
            />
            <AdminField label="Lead" value={v.lead} onChange={(x) => set("lead", x)} multiline rows={4} />
          </div>
        </AdminSectionForm>

        <AdminSectionForm
          title="Open roles"
          hint="List cards use summary. Detail pages use body (blank line = paragraph; lines starting with • = bullets)."
        >
          <div className="flex flex-col gap-6">
            {v.roles.length === 0 ? (
              <p className="text-[0.9rem] text-ist-muted">No roles yet. Add one when you have an opening.</p>
            ) : null}

            {v.roles.map((role, i) => (
              <div key={role.id} className="grid gap-4 border border-ist-line/70 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[0.85rem] font-medium text-ist-accent-bright">Role {i + 1}</p>
                  <div className="flex flex-wrap items-center gap-3">
                    {role.slug ? (
                      <Link
                        href={`/careers/${role.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[0.8rem] text-ist-muted underline-offset-2 hover:text-ist-accent-bright hover:underline"
                      >
                        View page
                      </Link>
                    ) : null}
                    <button
                      type="button"
                      className="text-[0.8rem] text-ist-muted underline-offset-2 hover:text-ist-accent-bright hover:underline"
                      onClick={() => set("roles", v.roles.filter((_, j) => j !== i))}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <AdminField
                  label="Title"
                  value={role.title}
                  onChange={(x) =>
                    updateRole(i, {
                      title: x,
                      slug:
                        !role.slug || role.slug === slugify(role.title)
                          ? slugify(x)
                          : role.slug,
                    })
                  }
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <AdminField
                    label="Slug (URL: /careers/…)"
                    value={role.slug}
                    onChange={(x) => updateRole(i, { slug: slugify(x) || x })}
                  />
                  <AdminField
                    label="Team"
                    value={role.team}
                    onChange={(x) => updateRole(i, { team: x })}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <AdminField
                    label="Location"
                    value={role.location}
                    onChange={(x) => updateRole(i, { location: x })}
                  />
                  <label className="flex flex-col gap-2 text-[0.85rem]">
                    <span className="text-ist-muted">Type</span>
                    <select
                      className={adminInputClass}
                      value={role.type}
                      onChange={(e) =>
                        updateRole(i, { type: e.target.value as RoleType })
                      }
                    >
                      {ROLE_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <AdminField
                  label="Summary (list card)"
                  value={role.summary}
                  onChange={(x) => updateRole(i, { summary: x })}
                  multiline
                  rows={3}
                />
                <label className="block">
                  <span className="mb-1.5 block text-[0.7rem] font-medium uppercase tracking-[0.08em] text-ist-dim">
                    Body (detail page)
                  </span>
                  <AutoTextarea
                    value={role.body}
                    minRows={10}
                    onChange={(x) => updateRole(i, { body: x })}
                    className={adminInputClass}
                  />
                </label>
              </div>
            ))}

            <button
              type="button"
              className="btn btn--secondary self-start"
              onClick={() => set("roles", [...v.roles, emptyRole()])}
            >
              Add role
            </button>
          </div>
        </AdminSectionForm>
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-ist-line/60 pt-6">
        <button type="submit" className="btn btn--primary" disabled={status === "saving"}>
          {status === "saving" ? "Saving…" : "Save careers"}
        </button>
        {message ? (
          <p className={status === "error" ? "text-ist-accent-bright" : "text-ist-muted"}>{message}</p>
        ) : null}
      </div>
    </form>
  );
}
