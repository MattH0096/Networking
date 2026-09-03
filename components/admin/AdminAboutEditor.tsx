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
  content: SiteContent["about"];
  images: Record<string, ImageAsset>;
  defaults: Record<string, ImageAsset>;
};

export function AdminAboutEditor({ content, images, defaults }: Props) {
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
      about: {
        eyebrow: v.eyebrow,
        title: v.title,
        lead: v.lead,
        statementEyebrow: v.statementEyebrow,
        statement: v.statement,
        cards: v.cards.map((c) => ({ title: c.title, body: c.body })),
        howEyebrow: v.howEyebrow,
        howTitleLine1: v.howTitleLine1,
        howTitleLine2: v.howTitleLine2,
        howItems: v.howItems.map((i) => ({ title: i.title, body: i.body })),
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
    setMessage("Saved. Refresh the public About page to see text changes.");
  }

  const img = (key: string) => assets[key] ?? defaults[key];

  return (
    <form onSubmit={onSave} className="max-w-4xl">
      <h1 className="text-[1.75rem] font-semibold tracking-tight">About</h1>
      <p className="mt-2 text-[0.95rem] text-ist-muted">
        One form per section. Images upload immediately; save text at the bottom.
      </p>

      <div className="mt-8 flex flex-col gap-8">
        <AdminSectionForm title="Hero">
          <div className="grid gap-4">
            <AdminField label="Eyebrow" value={v.eyebrow} onChange={(x) => set("eyebrow", x)} />
            <AdminField label="Title" value={v.title} onChange={(x) => set("title", x)} />
            <AdminField
              label="Lead"
              value={v.lead}
              onChange={(x) => set("lead", x)}
              multiline
              rows={3}
            />
          </div>
        </AdminSectionForm>

        <AdminSectionForm title="Statement">
          <div className="grid gap-6 lg:grid-cols-[1fr_220px]">
            <div className="grid gap-4">
              <AdminField
                label="Eyebrow"
                value={v.statementEyebrow}
                onChange={(x) => set("statementEyebrow", x)}
              />
              <AdminField
                label="Paragraphs (blank line between)"
                value={v.statement.join("\n\n")}
                onChange={(x) =>
                  set(
                    "statement",
                    x
                      .replace(/\r\n/g, "\n")
                      .split(/\n\s*\n/)
                      .map((p) => p.trim())
                      .filter(Boolean),
                  )
                }
                multiline
                rows={10}
              />
            </div>
            <AdminImageSlot
              imageKey="about-statement"
              label="Statement plate"
              asset={img("about-statement")}
              busy={busyKey === "about-statement"}
              onUpload={onUpload}
            />
          </div>
        </AdminSectionForm>

        <AdminSectionForm title="Mission & vision">
          <div className="flex flex-col gap-6">
            {v.cards.map((card, i) => (
              <div
                key={card.id}
                className="grid gap-4 border-t border-ist-line/60 pt-6 first:border-t-0 first:pt-0 lg:grid-cols-[1fr_200px]"
              >
                <div className="grid gap-4">
                  <p className="text-[0.85rem] font-medium text-ist-accent-bright">{card.id}</p>
                  <AdminField
                    label="Title"
                    value={card.title}
                    onChange={(x) =>
                      set(
                        "cards",
                        v.cards.map((item, j) => (j === i ? { ...item, title: x } : item)),
                      )
                    }
                  />
                  <AdminField
                    label="Body"
                    value={card.body}
                    onChange={(x) =>
                      set(
                        "cards",
                        v.cards.map((item, j) => (j === i ? { ...item, body: x } : item)),
                      )
                    }
                    multiline
                    rows={3}
                  />
                </div>
                <AdminImageSlot
                  imageKey={card.image as ImageKey}
                  label="Image"
                  asset={img(card.image)}
                  busy={busyKey === card.image}
                  onUpload={onUpload}
                />
              </div>
            ))}
          </div>
        </AdminSectionForm>

        <AdminSectionForm title="How we build">
          <div className="grid gap-4">
            <AdminField
              label="Eyebrow"
              value={v.howEyebrow}
              onChange={(x) => set("howEyebrow", x)}
            />
            <AdminField
              label="Title"
              value={joinLines([v.howTitleLine1, v.howTitleLine2])}
              onChange={(x) => {
                const [a, b] = split2(x);
                setV((prev) => ({ ...prev, howTitleLine1: a, howTitleLine2: b }));
              }}
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
                  {v.howItems.map((item, i) => (
                    <tr key={item.id} className="border-b border-ist-line/60 align-top">
                      <td className="py-3 pr-3">
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) =>
                            set(
                              "howItems",
                              v.howItems.map((row, j) =>
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
                              "howItems",
                              v.howItems.map((row, j) =>
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
            {status === "saving" ? "Saving…" : "Save all About text"}
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
