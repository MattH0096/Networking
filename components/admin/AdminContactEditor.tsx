"use client";

import { useState } from "react";

import {
  AdminField,
  AdminImageSlot,
  AdminSectionForm,
  adminInputClass,
  joinLines,
  split2,
} from "@/components/admin/form-shared";
import { AutoTextarea } from "@/components/admin/AutoTextarea";
import type { SiteContent } from "@/lib/cms/content";
import type { ImageAsset, ImageKey } from "@/lib/images";

type Props = {
  content: SiteContent["contact"];
  images: Record<string, ImageAsset>;
  defaults: Record<string, ImageAsset>;
};

export function AdminContactEditor({ content, images, defaults }: Props) {
  const [v, setV] = useState(content);
  const [assets, setAssets] = useState(images);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  function set<K extends keyof typeof v>(key: K, value: (typeof v)[K]) {
    setV((prev) => ({ ...prev, [key]: value }));
  }

  async function onUpload(key: string, file: File) {
    setBusyKey(key);
    setMessage(null);
    const body = new FormData();
    body.set("key", key);
    body.set("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body });
    setBusyKey(null);
    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setMessage(data?.error ?? "Upload failed.");
      return;
    }
    const data = (await res.json()) as { asset: ImageAsset };
    setAssets((prev) => ({ ...prev, [key]: data.asset }));
    setMessage("Image saved to the live site. You do not need to click Save for images.");
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setMessage(null);

    const patch = {
      contact: {
        eyebrow: v.eyebrow,
        title: [v.titleLine1, v.titleLine2].filter(Boolean).join(" "),
        titleLine1: v.titleLine1,
        titleLine2: v.titleLine2,
        lead: v.lead,
        formTitle: v.formTitle,
        formLead: v.formLead,
        formSecure: v.formSecure,
        formSubmit: v.formSubmit,
        placeholders: { ...v.placeholders },
        officeTitle: v.officeTitle,
        officeLocation: v.officeLocation,
        officeDescription: v.officeDescription,
        mapAlt: v.mapAlt,
        socialTitle: v.socialTitle,
        socialLead: v.socialLead,
        pillars: v.pillars.map((p) => ({ title: p.title, body: p.body })),
        helpHeading: v.helpHeading,
        helpLead: v.helpLead,
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
    setMessage("Saved. Refresh the public Contact page to see text changes.");
  }

  const img = (key: string) => assets[key] ?? defaults[key];

  return (
    <form onSubmit={onSave} className="max-w-4xl">
      <h1 className="text-[1.75rem] font-semibold tracking-tight">Contact</h1>
      <p className="mt-2 text-[0.95rem] text-ist-muted">
        Form chrome and page copy only — interest options stay in code. Images upload immediately;
        save text at the bottom.
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
            <AdminField
              label="Lead"
              value={v.lead}
              onChange={(x) => set("lead", x)}
              multiline
              rows={3}
            />
          </div>
        </AdminSectionForm>

        <AdminSectionForm title="Form chrome">
          <div className="grid gap-4">
            <AdminField
              label="Form title"
              value={v.formTitle}
              onChange={(x) => set("formTitle", x)}
            />
            <AdminField
              label="Form lead"
              value={v.formLead}
              onChange={(x) => set("formLead", x)}
              multiline
              rows={2}
            />
            <AdminField
              label="Submit label"
              value={v.formSubmit}
              onChange={(x) => set("formSubmit", x)}
            />
            <AdminField
              label="Security note"
              value={v.formSecure}
              onChange={(x) => set("formSecure", x)}
              multiline
              rows={2}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField
                label="Placeholder — full name"
                value={v.placeholders.fullName}
                onChange={(x) =>
                  set("placeholders", { ...v.placeholders, fullName: x })
                }
              />
              <AdminField
                label="Placeholder — work email"
                value={v.placeholders.workEmail}
                onChange={(x) =>
                  set("placeholders", { ...v.placeholders, workEmail: x })
                }
              />
              <AdminField
                label="Placeholder — organization"
                value={v.placeholders.organization}
                onChange={(x) =>
                  set("placeholders", { ...v.placeholders, organization: x })
                }
              />
              <AdminField
                label="Placeholder — interest"
                value={v.placeholders.interest}
                onChange={(x) =>
                  set("placeholders", { ...v.placeholders, interest: x })
                }
              />
            </div>
            <AdminField
              label="Placeholder — message"
              value={v.placeholders.message}
              onChange={(x) => set("placeholders", { ...v.placeholders, message: x })}
              multiline
              rows={2}
            />
          </div>
        </AdminSectionForm>

        <AdminSectionForm title="Office & social">
          <div className="grid gap-6 lg:grid-cols-[1fr_220px]">
            <div className="grid gap-4">
              <AdminField
                label="Office title"
                value={v.officeTitle}
                onChange={(x) => set("officeTitle", x)}
              />
              <AdminField
                label="Location"
                value={v.officeLocation}
                onChange={(x) => set("officeLocation", x)}
              />
              <AdminField
                label="Description"
                value={v.officeDescription}
                onChange={(x) => set("officeDescription", x)}
                multiline
                rows={3}
              />
              <AdminField
                label="Map alt"
                value={v.mapAlt}
                onChange={(x) => set("mapAlt", x)}
                multiline
                rows={2}
              />
              <AdminField
                label="Social title"
                value={v.socialTitle}
                onChange={(x) => set("socialTitle", x)}
              />
              <AdminField
                label="Social lead"
                value={v.socialLead}
                onChange={(x) => set("socialLead", x)}
                multiline
                rows={2}
              />
            </div>
            <AdminImageSlot
              imageKey="map-denver"
              label="Map"
              asset={img("map-denver")}
              busy={busyKey === "map-denver"}
              onUpload={onUpload}
            />
          </div>
        </AdminSectionForm>

        <AdminSectionForm title="Pillars">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[32rem] border-collapse text-left">
              <thead>
                <tr className="border-b border-ist-line text-[0.7rem] uppercase tracking-[0.08em] text-ist-dim">
                  <th className="pb-2 pr-3 font-medium">Title</th>
                  <th className="pb-2 font-medium">Body</th>
                </tr>
              </thead>
              <tbody>
                {v.pillars.map((pillar, i) => (
                  <tr key={pillar.id} className="border-b border-ist-line/60 align-top">
                    <td className="py-3 pr-3">
                      <input
                        type="text"
                        value={pillar.title}
                        onChange={(e) =>
                          set(
                            "pillars",
                            v.pillars.map((item, j) =>
                              j === i ? { ...item, title: e.target.value } : item,
                            ),
                          )
                        }
                        className={adminInputClass}
                      />
                    </td>
                    <td className="py-3">
                      <AutoTextarea
                        value={pillar.body}
                        minRows={2}
                        onChange={(x) =>
                          set(
                            "pillars",
                            v.pillars.map((item, j) =>
                              j === i ? { ...item, body: x } : item,
                            ),
                          )
                        }
                        className={adminInputClass}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AdminSectionForm>

        <AdminSectionForm title="Help band">
          <div className="grid gap-6 lg:grid-cols-[1fr_220px]">
            <div className="grid gap-4">
              <AdminField
                label="Heading"
                value={v.helpHeading}
                onChange={(x) => set("helpHeading", x)}
                multiline
                rows={2}
              />
              <AdminField
                label="Lead"
                value={v.helpLead}
                onChange={(x) => set("helpLead", x)}
                multiline
                rows={2}
              />
            </div>
            <AdminImageSlot
              imageKey="band-contact-help"
              label="Band image"
              asset={img("band-contact-help")}
              busy={busyKey === "band-contact-help"}
              onUpload={onUpload}
            />
          </div>
        </AdminSectionForm>
      </div>

      <div className="sticky bottom-0 mt-8 border-t border-ist-line bg-ist-bg/95 py-4 backdrop-blur">
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={status === "saving"}
            className="bg-ist-accent px-5 py-2.5 text-[0.95rem] font-medium text-white hover:bg-ist-accent-deep disabled:opacity-60"
          >
            {status === "saving" ? "Saving…" : "Save all Contact text"}
          </button>
          {message ? (
            <p
              className={`text-[0.85rem] ${status === "error" ? "text-ist-accent-bright" : "text-ist-muted"}`}
            >
              {message}
            </p>
          ) : null}
        </div>
      </div>
    </form>
  );
}
