"use client";

import { useState } from "react";

import { AutoTextarea } from "@/components/admin/AutoTextarea";

export type AdminField = {
  name: string;
  label: string;
  value: string;
  multiline?: boolean;
  rows?: number;
};

type Props = {
  title: string;
  description?: string;
  fields: AdminField[];
  /** Serializable page key used to build the PUT payload on the client. */
  page: "home" | "solutions" | "locus" | "crucible" | "about" | "contact" | "insights";
};

function buildPatch(
  page: Props["page"],
  values: Record<string, string>,
): Record<string, unknown> {
  switch (page) {
    case "home":
      return {
        home: {
          supportLines: [values.supportLine1, values.supportLine2],
          supportCloser: values.supportCloser,
          problemCloser: values.problemCloser,
          solutionBody: values.solutionBody,
          locusTagline: values.locusTagline,
          locusBody: values.locusBody,
          locusPull: values.locusPull,
          locusPullLead: values.locusPullLead,
          crucibleTagline: values.crucibleTagline,
          crucibleBody: values.crucibleBody,
          cruciblePull: values.cruciblePull,
          cruciblePullLead: values.cruciblePullLead,
          applicationsHeading: values.applicationsHeading,
          applicationsLead: values.applicationsLead,
          visionAccent: values.visionAccent,
        },
      };
    case "solutions":
      return { solutions: { lead: values.lead } };
    case "locus":
      return {
        locus: {
          lead: values.lead,
          integrityBody: values.integrityBody,
          impactHeading: values.impactHeading,
        },
      };
    case "crucible":
      return { crucible: { leadIntro: values.leadIntro, lead: values.lead } };
    case "about":
      return { about: { title: values.title, lead: values.lead } };
    case "contact":
      return {
        contact: {
          title: values.title,
          lead: values.lead,
          officeLocation: values.officeLocation,
          officeDescription: values.officeDescription,
        },
      };
    case "insights":
      return { insights: { intro: values.intro } };
  }
}

export function AdminCopyEditor({ title, description, fields, page }: Props) {
  const [values, setValues] = useState(() =>
    Object.fromEntries(fields.map((f) => [f.name, f.value])),
  );
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setMessage(null);
    const res = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildPatch(page, values)),
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setStatus("error");
      setMessage(data?.error ?? "Save failed.");
      return;
    }
    setStatus("saved");
    setMessage("Saved. Refresh the public page to see changes.");
  }

  return (
    <form onSubmit={onSave} className="max-w-2xl">
      <h1 className="text-[1.75rem] font-semibold tracking-tight">{title}</h1>
      {description ? <p className="mt-2 text-[0.95rem] text-ist-muted">{description}</p> : null}

      <div className="mt-8 flex flex-col gap-5">
        {fields.map((field) => (
          <label key={field.name} className="block">
            <span className="text-[0.75rem] font-medium uppercase tracking-[0.08em] text-ist-dim">
              {field.label}
            </span>
            {field.multiline ? (
              <AutoTextarea
                value={values[field.name] ?? ""}
                minRows={field.rows ?? 4}
                onChange={(x) => setValues((v) => ({ ...v, [field.name]: x }))}
                className="mt-2 w-full border border-ist-line bg-black px-3 py-2.5 text-[0.95rem] text-ist-text outline-none focus:border-ist-accent"
              />
            ) : (
              <input
                type="text"
                value={values[field.name] ?? ""}
                onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))}
                className="mt-2 w-full border border-ist-line bg-black px-3 py-2.5 text-[0.95rem] text-ist-text outline-none focus:border-ist-accent"
              />
            )}
          </label>
        ))}
      </div>

      <div className="mt-8 flex items-center gap-4">
        <button
          type="submit"
          disabled={status === "saving"}
          className="bg-ist-accent px-5 py-2.5 text-[0.95rem] font-medium text-white hover:bg-ist-accent-deep disabled:opacity-60"
        >
          {status === "saving" ? "Saving…" : "Save changes"}
        </button>
        {message ? (
          <p
            className={`text-[0.85rem] ${status === "error" ? "text-ist-accent-bright" : "text-ist-muted"}`}
          >
            {message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
