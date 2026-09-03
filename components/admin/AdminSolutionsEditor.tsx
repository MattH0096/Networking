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
  content: SiteContent["solutions"];
  images: Record<string, ImageAsset>;
  defaults: Record<string, ImageAsset>;
};

export function AdminSolutionsEditor({ content, images, defaults }: Props) {
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
      solutions: {
        eyebrow: v.eyebrow,
        titleLine1: v.titleLine1,
        titleLine2: v.titleLine2,
        lead: v.lead,
        columns: v.columns.map((c) => ({
          eyebrow: c.eyebrow,
          title: c.title,
          body: c.body,
          cta: c.cta,
          alt: c.alt,
        })),
        hardwareNote: v.hardwareNote,
        missingEyebrow: v.missingEyebrow,
        missingTitle: v.missingTitle,
        missingLead: v.missingLead,
        missingGapLabel: v.missingGapLabel,
        missingProblem: v.missingProblem,
        missingAnswerLabel: v.missingAnswerLabel,
        missingInsight: v.missingInsight,
        missingStackLabel: v.missingStackLabel,
        missingStackCaption: v.missingStackCaption,
        missingStackHighlightNote: v.missingStackHighlightNote,
        missingStackLayers: v.missingStackLayers.map((l) => ({ label: l.label })),
        missingImageAlt: v.missingImageAlt,
        missingOutcomesLabel: v.missingOutcomesLabel,
        missingFeatures: v.missingFeatures.map((f) => ({ title: f.title, body: f.body })),
        missingBridgeLabel: v.missingBridgeLabel,
        missingBridgeLead: v.missingBridgeLead,
        missingFlow: v.missingFlow.map((f) => ({ label: f.label, detail: f.detail })),
        missingCta: v.missingCta,
        missingCtaNote: v.missingCtaNote,
        fullStackEyebrow: v.fullStackEyebrow,
        fullStackTitle: v.fullStackTitle,
        fullStackLead: v.fullStackLead,
        fullStackItems: v.fullStackItems.map((i) => ({ title: i.title, body: i.body })),
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
    setMessage("Saved text. (Images save when you click Replace — not with this button.)");
  }

  const img = (key: string) => assets[key] ?? defaults[key];

  return (
    <form onSubmit={onSave} className="max-w-4xl">
      <h1 className="text-[1.75rem] font-semibold tracking-tight">Solutions</h1>
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
              label="Lead"
              value={v.lead}
              onChange={(x) => set("lead", x)}
              multiline
              rows={4}
            />
          </div>
        </AdminSectionForm>

        <AdminSectionForm title="The Missing Layer">
          <div className="grid gap-6 lg:grid-cols-[1fr_220px]">
            <div className="grid gap-4">
              <AdminField
                label="Eyebrow"
                value={v.missingEyebrow}
                onChange={(x) => set("missingEyebrow", x)}
              />
              <AdminField
                label="Title"
                value={v.missingTitle}
                onChange={(x) => set("missingTitle", x)}
                multiline
                rows={2}
              />
              <AdminField
                label="Lead"
                value={v.missingLead}
                onChange={(x) => set("missingLead", x)}
                multiline
                rows={2}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <AdminField
                  label="Gap label"
                  value={v.missingGapLabel}
                  onChange={(x) => set("missingGapLabel", x)}
                />
                <AdminField
                  label="Answer label"
                  value={v.missingAnswerLabel}
                  onChange={(x) => set("missingAnswerLabel", x)}
                />
              </div>
              <AdminField
                label="The gap"
                value={v.missingProblem}
                onChange={(x) => set("missingProblem", x)}
                multiline
                rows={4}
              />
              <AdminField
                label="The answer"
                value={v.missingInsight}
                onChange={(x) => set("missingInsight", x)}
                multiline
                rows={4}
              />
              <AdminField
                label="Stack label"
                value={v.missingStackLabel}
                onChange={(x) => set("missingStackLabel", x)}
              />
              <AdminField
                label="Stack layers"
                value={joinLines(v.missingStackLayers.map((l) => l.label))}
                onChange={(x) => {
                  const lines = splitLinesFixed(x, v.missingStackLayers.length);
                  set(
                    "missingStackLayers",
                    v.missingStackLayers.map((layer, i) => ({
                      ...layer,
                      label: lines[i] ?? "",
                    })),
                  );
                }}
                multiline
                rows={6}
              />
              <AdminField
                label="Highlight note"
                value={v.missingStackHighlightNote}
                onChange={(x) => set("missingStackHighlightNote", x)}
                multiline
                rows={2}
              />
              <AdminField
                label="Stack caption"
                value={v.missingStackCaption}
                onChange={(x) => set("missingStackCaption", x)}
                multiline
                rows={2}
              />
              <AdminField
                label="Image alt"
                value={v.missingImageAlt}
                onChange={(x) => set("missingImageAlt", x)}
                multiline
                rows={2}
              />
            </div>
            <AdminImageSlot
              imageKey="section-missing-layer"
              label="Section image"
              asset={img("section-missing-layer")}
              busy={busyKey === "section-missing-layer"}
              onUpload={onUpload}
            />
          </div>

          <div className="mt-6 grid gap-4">
            <AdminField
              label="Outcomes label"
              value={v.missingOutcomesLabel}
              onChange={(x) => set("missingOutcomesLabel", x)}
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
                  {v.missingFeatures.map((f, i) => (
                    <tr key={f.id} className="border-b border-ist-line/60 align-top">
                      <td className="py-3 pr-3">
                        <input
                          type="text"
                          value={f.title}
                          onChange={(e) =>
                            set(
                              "missingFeatures",
                              v.missingFeatures.map((item, j) =>
                                j === i ? { ...item, title: e.target.value } : item,
                              ),
                            )
                          }
                          className={adminInputClass}
                        />
                      </td>
                      <td className="py-3">
                        <AutoTextarea
                          value={f.body}
                          minRows={2}
                          onChange={(x) =>
                            set(
                              "missingFeatures",
                              v.missingFeatures.map((item, j) =>
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
              label="Bridge label"
              value={v.missingBridgeLabel}
              onChange={(x) => set("missingBridgeLabel", x)}
            />
            <AdminField
              label="Bridge lead"
              value={v.missingBridgeLead}
              onChange={(x) => set("missingBridgeLead", x)}
              multiline
              rows={2}
            />
            <div className="overflow-x-auto">
              <table className="w-full min-w-[28rem] border-collapse text-left">
                <thead>
                  <tr className="border-b border-ist-line text-[0.7rem] uppercase tracking-[0.08em] text-ist-dim">
                    <th className="pb-2 pr-3 font-medium">Flow label</th>
                    <th className="pb-2 font-medium">Detail</th>
                  </tr>
                </thead>
                <tbody>
                  {v.missingFlow.map((step, i) => (
                    <tr key={step.id} className="border-b border-ist-line/60">
                      <td className="py-3 pr-3">
                        <input
                          type="text"
                          value={step.label}
                          onChange={(e) =>
                            set(
                              "missingFlow",
                              v.missingFlow.map((item, j) =>
                                j === i ? { ...item, label: e.target.value } : item,
                              ),
                            )
                          }
                          className={adminInputClass}
                        />
                      </td>
                      <td className="py-3">
                        <input
                          type="text"
                          value={step.detail}
                          onChange={(e) =>
                            set(
                              "missingFlow",
                              v.missingFlow.map((item, j) =>
                                j === i ? { ...item, detail: e.target.value } : item,
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
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField
                label="CTA"
                value={v.missingCta}
                onChange={(x) => set("missingCta", x)}
              />
              <AdminField
                label="CTA note"
                value={v.missingCtaNote}
                onChange={(x) => set("missingCtaNote", x)}
              />
            </div>
          </div>
        </AdminSectionForm>

        <AdminSectionForm
          title="Solution columns"
          hint="Locus, Crucible, and Hardware — copy and image per column."
        >
          <div className="flex flex-col gap-6">
            {v.columns.map((col, i) => (
              <div
                key={col.image}
                className="grid gap-4 border-t border-ist-line/60 pt-6 first:border-t-0 first:pt-0 lg:grid-cols-[1fr_200px]"
              >
                <div className="grid gap-4">
                  <p className="text-[0.85rem] font-medium text-ist-accent-bright">
                    Column {i + 1}
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <AdminField
                      label="Eyebrow"
                      value={col.eyebrow}
                      onChange={(x) =>
                        set(
                          "columns",
                          v.columns.map((item, j) =>
                            j === i ? { ...item, eyebrow: x } : item,
                          ),
                        )
                      }
                    />
                    <AdminField
                      label="CTA (blank for hardware note)"
                      value={col.cta ?? ""}
                      onChange={(x) =>
                        set(
                          "columns",
                          v.columns.map((item, j) =>
                            j === i
                              ? { ...item, cta: x.trim() ? x : null }
                              : item,
                          ),
                        )
                      }
                    />
                  </div>
                  <AdminField
                    label="Title"
                    value={col.title}
                    onChange={(x) =>
                      set(
                        "columns",
                        v.columns.map((item, j) =>
                          j === i ? { ...item, title: x } : item,
                        ),
                      )
                    }
                    multiline
                    rows={2}
                  />
                  <AdminField
                    label="Body"
                    value={col.body}
                    onChange={(x) =>
                      set(
                        "columns",
                        v.columns.map((item, j) =>
                          j === i ? { ...item, body: x } : item,
                        ),
                      )
                    }
                    multiline
                    rows={3}
                  />
                  <AdminField
                    label="Image alt"
                    value={col.alt}
                    onChange={(x) =>
                      set(
                        "columns",
                        v.columns.map((item, j) =>
                          j === i ? { ...item, alt: x } : item,
                        ),
                      )
                    }
                    multiline
                    rows={2}
                  />
                </div>
                <AdminImageSlot
                  imageKey={col.image as ImageKey}
                  label="Image"
                  asset={img(col.image)}
                  busy={busyKey === col.image}
                  onUpload={onUpload}
                />
              </div>
            ))}
            <AdminField
              label="Hardware note (when CTA is blank)"
              value={v.hardwareNote}
              onChange={(x) => set("hardwareNote", x)}
            />
          </div>
        </AdminSectionForm>

        <AdminSectionForm title="Full-stack approach">
          <div className="grid gap-4">
            <AdminField
              label="Eyebrow"
              value={v.fullStackEyebrow}
              onChange={(x) => set("fullStackEyebrow", x)}
            />
            <AdminField
              label="Title"
              value={v.fullStackTitle}
              onChange={(x) => set("fullStackTitle", x)}
              multiline
              rows={2}
            />
            <AdminField
              label="Lead"
              value={v.fullStackLead}
              onChange={(x) => set("fullStackLead", x)}
              multiline
              rows={3}
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
                  {v.fullStackItems.map((item, i) => (
                    <tr key={item.id} className="border-b border-ist-line/60 align-top">
                      <td className="py-3 pr-3">
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) =>
                            set(
                              "fullStackItems",
                              v.fullStackItems.map((row, j) =>
                                j === i ? { ...row, title: e.target.value } : row,
                              ),
                            )
                          }
                          className={adminInputClass}
                        />
                      </td>
                      <td className="py-3">
                        <AutoTextarea
                          value={item.body}
                          minRows={2}
                          onChange={(x) =>
                            set(
                              "fullStackItems",
                              v.fullStackItems.map((row, j) =>
                                j === i ? { ...row, body: x } : row,
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
            {status === "saving" ? "Saving…" : "Save all Solutions text"}
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

function splitLinesFixed(value: string, count: number): string[] {
  const parts = value.replace(/\r\n/g, "\n").split("\n");
  return Array.from({ length: count }, (_, i) => {
    if (i < count - 1) return parts[i] ?? "";
    return parts.slice(i).join("\n");
  });
}
