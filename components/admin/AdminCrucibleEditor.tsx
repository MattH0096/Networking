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
  content: SiteContent["crucible"];
  images: Record<string, ImageAsset>;
  defaults: Record<string, ImageAsset>;
};

export function AdminCrucibleEditor({ content, images, defaults }: Props) {
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
      crucible: {
        eyebrow: v.eyebrow,
        titleLine1: v.titleLine1,
        titleLine2: v.titleLine2,
        leadIntro: v.leadIntro,
        lead: v.lead,
        flowTag: v.flowTag,
        flowHeading: v.flowHeading,
        flow: v.flow.map((f) => ({ key: f.key, title: f.title, body: f.body })),
        pullLead: v.pullLead,
        pullLine: v.pullLine,
        questionsHeading: v.questionsHeading,
        questions: v.questions,
        questionsAlt: v.questionsAlt,
        futureTag: v.futureTag,
        futureEyebrow: v.futureEyebrow,
        futureHeading: v.futureHeading,
        pillars: v.pillars.map((p) => ({ title: p.title, body: p.body })),
        visionLine1: v.visionLine1,
        visionLine2: v.visionLine2,
        visionAccent: v.visionAccent,
        visionAfter1: v.visionAfter1,
        visionAfter2: v.visionAfter2,
        visionPrimaryCta: v.visionPrimaryCta,
        visionSecondaryCta: v.visionSecondaryCta,
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
    setMessage("Saved. Refresh the public Crucible page to see text changes.");
  }

  const img = (key: string) => assets[key] ?? defaults[key];

  return (
    <form onSubmit={onSave} className="max-w-4xl">
      <h1 className="text-[1.75rem] font-semibold tracking-tight">Crucible</h1>
      <p className="mt-2 text-[0.95rem] text-ist-muted">
        One form per section. Multi-line titles stay as one field — press Enter where the site
        breaks a line. Images upload immediately; save text at the bottom.
      </p>

      <div className="mt-8 flex flex-col gap-8">
        <AdminSectionForm title="Hero" hint="Use a line break where the site shows a new line.">
          <div className="grid gap-4">
            <AdminField label="Eyebrow" value={v.eyebrow} onChange={(x) => set("eyebrow", x)} />
            <AdminField
              label="Title"
              value={joinLines([v.titleLine1, v.titleLine2])}
              onChange={(x) => {
                const [a, b] = split2(x);
                setV((prev) => ({ ...prev, titleLine1: a, titleLine2: b }));
              }}
              multiline
              rows={2}
            />
            <AdminField
              label="Lead intro"
              value={v.leadIntro}
              onChange={(x) => set("leadIntro", x)}
            />
            <AdminField
              label="Lead"
              value={v.lead}
              onChange={(x) => set("lead", x)}
              multiline
              rows={4}
            />
          </div>
        </AdminSectionForm>

        <AdminSectionForm title="Workflow">
          <div className="grid gap-4">
            <AdminField label="Tag" value={v.flowTag} onChange={(x) => set("flowTag", x)} />
            <AdminField
              label="Heading"
              value={v.flowHeading}
              onChange={(x) => set("flowHeading", x)}
            />
            <div className="overflow-x-auto">
              <table className="w-full min-w-[36rem] border-collapse text-left">
                <thead>
                  <tr className="border-b border-ist-line text-[0.7rem] uppercase tracking-[0.08em] text-ist-dim">
                    <th className="pb-2 pr-3 font-medium">Key</th>
                    <th className="pb-2 pr-3 font-medium">Title</th>
                    <th className="pb-2 font-medium">Body</th>
                  </tr>
                </thead>
                <tbody>
                  {v.flow.map((step, i) => (
                    <tr key={i} className="border-b border-ist-line/60 align-top">
                      <td className="py-3 pr-3">
                        <input
                          type="text"
                          value={step.key}
                          onChange={(e) =>
                            set(
                              "flow",
                              v.flow.map((item, j) =>
                                j === i ? { ...item, key: e.target.value } : item,
                              ),
                            )
                          }
                          className={adminInputClass}
                        />
                      </td>
                      <td className="py-3 pr-3">
                        <input
                          type="text"
                          value={step.title}
                          onChange={(e) =>
                            set(
                              "flow",
                              v.flow.map((item, j) =>
                                j === i ? { ...item, title: e.target.value } : item,
                              ),
                            )
                          }
                          className={adminInputClass}
                        />
                      </td>
                      <td className="py-3">
                        <AutoTextarea
                          value={step.body}
                          minRows={2}
                          onChange={(x) =>
                            set(
                              "flow",
                              v.flow.map((item, j) =>
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
            <AdminField
              label="Pull lead"
              value={v.pullLead}
              onChange={(x) => set("pullLead", x)}
              multiline
              rows={2}
            />
            <AdminField label="Pull line" value={v.pullLine} onChange={(x) => set("pullLine", x)} />
          </div>
        </AdminSectionForm>

        <AdminSectionForm title="Critical questions">
          <div className="grid gap-6 lg:grid-cols-[1fr_220px]">
            <div className="grid gap-4">
              <AdminField
                label="Heading"
                value={v.questionsHeading}
                onChange={(x) => set("questionsHeading", x)}
                multiline
                rows={2}
              />
              <AdminField
                label="Questions (one per line)"
                value={joinLines(v.questions)}
                onChange={(x) =>
                  set(
                    "questions",
                    x
                      .replace(/\r\n/g, "\n")
                      .split("\n")
                      .map((line) => line.trim())
                      .filter(Boolean),
                  )
                }
                multiline
                rows={10}
              />
              <AdminField
                label="Image alt"
                value={v.questionsAlt}
                onChange={(x) => set("questionsAlt", x)}
                multiline
                rows={3}
              />
            </div>
            <AdminImageSlot
              imageKey="crucible-questions-terrain"
              label="Terrain image"
              asset={img("crucible-questions-terrain")}
              busy={busyKey === "crucible-questions-terrain"}
              onUpload={onUpload}
            />
          </div>
        </AdminSectionForm>

        <AdminSectionForm title="Future ecosystem">
          <div className="grid gap-4">
            <AdminField label="Tag" value={v.futureTag} onChange={(x) => set("futureTag", x)} />
            <AdminField
              label="Eyebrow"
              value={v.futureEyebrow}
              onChange={(x) => set("futureEyebrow", x)}
            />
            <AdminField
              label="Heading"
              value={v.futureHeading}
              onChange={(x) => set("futureHeading", x)}
              multiline
              rows={2}
            />
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
                    <tr key={pillar.key} className="border-b border-ist-line/60 align-top">
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
          </div>
        </AdminSectionForm>

        <AdminSectionForm title="Closing CTA">
          <div className="grid gap-6 lg:grid-cols-[1fr_220px]">
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField
                label="Opening"
                value={joinLines([v.visionLine1, v.visionLine2])}
                onChange={(x) => {
                  const [a, b] = split2(x);
                  setV((prev) => ({ ...prev, visionLine1: a, visionLine2: b }));
                }}
                multiline
                rows={2}
                className="block sm:col-span-2"
              />
              <AdminField
                label="Accent line"
                value={v.visionAccent}
                onChange={(x) => set("visionAccent", x)}
                multiline
                rows={2}
                className="block sm:col-span-2"
              />
              <AdminField
                label="Closing"
                value={joinLines([v.visionAfter1, v.visionAfter2])}
                onChange={(x) => {
                  const [a, b] = split2(x);
                  setV((prev) => ({ ...prev, visionAfter1: a, visionAfter2: b }));
                }}
                multiline
                rows={2}
                className="block sm:col-span-2"
              />
              <AdminField
                label="Primary CTA"
                value={v.visionPrimaryCta}
                onChange={(x) => set("visionPrimaryCta", x)}
              />
              <AdminField
                label="Secondary CTA"
                value={v.visionSecondaryCta}
                onChange={(x) => set("visionSecondaryCta", x)}
              />
            </div>
            <AdminImageSlot
              imageKey="band-vision"
              label="Band image"
              asset={img("band-vision")}
              busy={busyKey === "band-vision"}
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
            {status === "saving" ? "Saving…" : "Save all Crucible text"}
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
