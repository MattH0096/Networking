"use client";

import { useState } from "react";

import {
  AdminField,
  AdminImageSlot,
  AdminSectionForm,
  joinLines,
  split2,
} from "@/components/admin/form-shared";
import type { SiteContent } from "@/lib/cms/content";
import { newId, slugify } from "@/lib/cms/id";
import type { ImageAsset } from "@/lib/images";

type Props = {
  content: SiteContent["insights"];
  images: Record<string, ImageAsset>;
  defaults: Record<string, ImageAsset>;
};

type Paper = SiteContent["insights"]["papers"][number];
type Upcoming = SiteContent["insights"]["upcoming"][number];

function emptyPaper(): Paper {
  const id = newId("paper");
  return {
    id,
    slug: id,
    title: "",
    series: "IST Technical Research Series",
    date: "",
    gated: true,
    summary: "",
    tags: [],
    signals: [
      { label: "Technical paper", icon: "doc" },
      { label: "Figures & models", icon: "chart" },
    ],
    coverKey: "insights-cover",
    sort: 0,
  };
}

function emptyUpcoming(): Upcoming {
  return {
    id: newId("upcoming"),
    title: "",
    body: "",
    status: "Coming Soon",
  };
}

export function AdminInsightsEditor({ content, images, defaults }: Props) {
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

    const papers = v.papers.map((p, i) => {
      const slug = slugify(p.slug || p.title) || `paper-${i + 1}`;
      return {
        id: p.id || slug,
        slug,
        title: p.title.trim(),
        series: p.series.trim(),
        date: p.date.trim(),
        gated: p.gated !== false,
        summary: p.summary.trim(),
        tags: p.tags.map((t) => t.trim()).filter(Boolean),
        signals: p.signals
          .map((s) => ({
            label: s.label.trim(),
            icon: s.icon,
          }))
          .filter((s) => s.label),
        coverKey: p.coverKey || "insights-cover",
      };
    });

    const patch = {
      insights: {
        eyebrow: v.eyebrow,
        title: v.title,
        intro: v.intro,
        heroAlt: v.heroAlt,
        featuredLabel: v.featuredLabel,
        papers,
        upcomingHeading: v.upcomingHeading,
        upcoming: v.upcoming.map((u, i) => ({
          id: u.id || `upcoming-${i + 1}`,
          title: u.title.trim(),
          body: u.body.trim(),
          status: u.status.trim() || "Coming Soon",
        })),
        subscribeHeading: v.subscribeHeading,
        subscribeLead: v.subscribeLead,
        subscribeCta: v.subscribeCta,
        subscribeNote: v.subscribeNote,
        subscribeSuccessTitle: v.subscribeSuccessTitle,
        subscribeSuccessBody: v.subscribeSuccessBody,
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
    setMessage("Saved. Refresh Insights to see changes.");
    setV((prev) => ({
      ...prev,
      papers: papers.map((p, i) => ({ ...p, sort: i })),
    }));
  }

  const imgAsset = (key: string) => assets[key] ?? defaults[key];

  return (
    <form onSubmit={onSave} className="max-w-4xl">
      <h1 className="text-[1.75rem] font-semibold tracking-tight">Insights</h1>
      <p className="mt-2 text-[0.95rem] text-ist-muted">
        Add, edit, or remove real papers. The public page only shows what you save here — no
        placeholder cards. PDF downloads still need a matching file on the server for that slug.
      </p>

      <div className="mt-8 flex flex-col gap-8">
        <AdminSectionForm title="Hero">
          <div className="grid gap-6 lg:grid-cols-[1fr_220px]">
            <div className="grid gap-4">
              <AdminField label="Eyebrow" value={v.eyebrow} onChange={(x) => set("eyebrow", x)} />
              <AdminField label="Title" value={v.title} onChange={(x) => set("title", x)} />
              <AdminField
                label="Intro"
                value={v.intro}
                onChange={(x) => set("intro", x)}
                multiline
                rows={4}
              />
              <AdminField
                label="Hero alt"
                value={v.heroAlt}
                onChange={(x) => set("heroAlt", x)}
                multiline
                rows={2}
              />
            </div>
            <AdminImageSlot
              imageKey="insights-hero"
              label="Hero image"
              asset={imgAsset("insights-hero")}
              busy={busyKey === "insights-hero"}
              onUpload={onUpload}
            />
          </div>
        </AdminSectionForm>

        <AdminSectionForm
          title="Papers"
          hint="Published research shown on Insights. First item is treated as featured."
        >
          <AdminField
            label="Featured label"
            value={v.featuredLabel}
            onChange={(x) => set("featuredLabel", x)}
            className="mb-5 block max-w-md"
          />

          <div className="flex flex-col gap-6">
            {v.papers.length === 0 ? (
              <p className="text-[0.9rem] text-ist-muted">No papers yet. Add one to publish research.</p>
            ) : null}

            {v.papers.map((paper, i) => (
              <div
                key={paper.id}
                className="grid gap-4 border border-ist-line/70 p-4 lg:grid-cols-[1fr_180px]"
              >
                <div className="grid gap-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[0.85rem] font-medium text-ist-accent-bright">
                      Paper {i + 1}
                      {i === 0 ? " · Featured" : ""}
                    </p>
                    <button
                      type="button"
                      className="text-[0.8rem] text-ist-muted underline-offset-2 hover:text-ist-accent-bright hover:underline"
                      onClick={() =>
                        set(
                          "papers",
                          v.papers.filter((_, j) => j !== i),
                        )
                      }
                    >
                      Remove
                    </button>
                  </div>
                  <AdminField
                    label="Title"
                    value={paper.title}
                    onChange={(x) =>
                      set(
                        "papers",
                        v.papers.map((p, j) =>
                          j === i
                            ? {
                                ...p,
                                title: x,
                                slug:
                                  !p.slug || p.slug === slugify(p.title)
                                    ? slugify(x)
                                    : p.slug,
                              }
                            : p,
                        ),
                      )
                    }
                    multiline
                    rows={2}
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <AdminField
                      label="Slug (URL / download id)"
                      value={paper.slug}
                      onChange={(x) =>
                        set(
                          "papers",
                          v.papers.map((p, j) =>
                            j === i ? { ...p, slug: slugify(x) || x } : p,
                          ),
                        )
                      }
                    />
                    <AdminField
                      label="Date"
                      value={paper.date}
                      onChange={(x) =>
                        set(
                          "papers",
                          v.papers.map((p, j) => (j === i ? { ...p, date: x } : p)),
                        )
                      }
                    />
                  </div>
                  <AdminField
                    label="Series"
                    value={paper.series}
                    onChange={(x) =>
                      set(
                        "papers",
                        v.papers.map((p, j) => (j === i ? { ...p, series: x } : p)),
                      )
                    }
                  />
                  <AdminField
                    label="Summary"
                    value={paper.summary}
                    onChange={(x) =>
                      set(
                        "papers",
                        v.papers.map((p, j) => (j === i ? { ...p, summary: x } : p)),
                      )
                    }
                    multiline
                    rows={4}
                  />
                  <AdminField
                    label="Tags (one per line)"
                    value={joinLines(paper.tags)}
                    onChange={(x) =>
                      set(
                        "papers",
                        v.papers.map((p, j) =>
                          j === i
                            ? {
                                ...p,
                                tags: x
                                  .replace(/\r\n/g, "\n")
                                  .split("\n")
                                  .map((t) => t.trim())
                                  .filter(Boolean),
                              }
                            : p,
                        ),
                      )
                    }
                    multiline
                    rows={3}
                  />
                  <AdminField
                    label="Signals (one per line)"
                    value={joinLines(paper.signals.map((s) => s.label))}
                    onChange={(x) =>
                      set(
                        "papers",
                        v.papers.map((p, j) =>
                          j === i
                            ? {
                                ...p,
                                signals: x
                                  .replace(/\r\n/g, "\n")
                                  .split("\n")
                                  .map((t) => t.trim())
                                  .filter(Boolean)
                                  .map((label, si) => ({
                                    label,
                                    icon: (["doc", "chart", "review"] as const)[
                                      si % 3
                                    ] as "doc" | "chart" | "review",
                                  })),
                              }
                            : p,
                        ),
                      )
                    }
                    multiline
                    rows={2}
                  />
                </div>
                <AdminImageSlot
                  imageKey={paper.coverKey || "insights-cover"}
                  label="Cover"
                  asset={imgAsset(paper.coverKey || "insights-cover")}
                  busy={busyKey === (paper.coverKey || "insights-cover")}
                  onUpload={onUpload}
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            className="mt-5 border border-ist-line px-4 py-2 text-[0.9rem] text-ist-text hover:border-ist-accent"
            onClick={() => set("papers", [...v.papers, emptyPaper()])}
          >
            + Add paper
          </button>
        </AdminSectionForm>

        <AdminSectionForm
          title="Upcoming (optional)"
          hint="Only shown on the site when you add items. Leave empty to hide the section."
        >
          <AdminField
            label="Section heading"
            value={v.upcomingHeading}
            onChange={(x) => set("upcomingHeading", x)}
            className="mb-5 block max-w-md"
          />
          <div className="flex flex-col gap-4">
            {v.upcoming.map((item, i) => (
              <div key={item.id} className="grid gap-3 border border-ist-line/70 p-4 sm:grid-cols-[1fr_auto]">
                <div className="grid gap-3">
                  <AdminField
                    label="Title"
                    value={item.title}
                    onChange={(x) =>
                      set(
                        "upcoming",
                        v.upcoming.map((u, j) => (j === i ? { ...u, title: x } : u)),
                      )
                    }
                  />
                  <AdminField
                    label="Body"
                    value={item.body}
                    onChange={(x) =>
                      set(
                        "upcoming",
                        v.upcoming.map((u, j) => (j === i ? { ...u, body: x } : u)),
                      )
                    }
                    multiline
                    rows={2}
                  />
                  <AdminField
                    label="Status"
                    value={item.status}
                    onChange={(x) =>
                      set(
                        "upcoming",
                        v.upcoming.map((u, j) => (j === i ? { ...u, status: x } : u)),
                      )
                    }
                  />
                </div>
                <button
                  type="button"
                  className="self-start text-[0.8rem] text-ist-muted hover:text-ist-accent-bright"
                  onClick={() =>
                    set(
                      "upcoming",
                      v.upcoming.filter((_, j) => j !== i),
                    )
                  }
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="mt-4 border border-ist-line px-4 py-2 text-[0.9rem] text-ist-text hover:border-ist-accent"
            onClick={() => set("upcoming", [...v.upcoming, emptyUpcoming()])}
          >
            + Add upcoming item
          </button>
        </AdminSectionForm>

        <AdminSectionForm title="Subscribe strip">
          <div className="grid gap-4">
            <AdminField
              label="Heading"
              value={v.subscribeHeading}
              onChange={(x) => set("subscribeHeading", x)}
              multiline
              rows={2}
            />
            <AdminField
              label="Lead"
              value={v.subscribeLead}
              onChange={(x) => set("subscribeLead", x)}
              multiline
              rows={2}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField
                label="CTA"
                value={v.subscribeCta}
                onChange={(x) => set("subscribeCta", x)}
              />
              <AdminField
                label="Note"
                value={v.subscribeNote}
                onChange={(x) => set("subscribeNote", x)}
              />
            </div>
          </div>
        </AdminSectionForm>

        <AdminSectionForm title="Closing CTA">
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
        </AdminSectionForm>
      </div>

      <div className="sticky bottom-0 mt-8 border-t border-ist-line bg-ist-bg/95 py-4 backdrop-blur">
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={status === "saving"}
            className="bg-ist-accent px-5 py-2.5 text-[0.95rem] font-medium text-white hover:bg-ist-accent-deep disabled:opacity-60"
          >
            {status === "saving" ? "Saving…" : "Save Insights"}
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
