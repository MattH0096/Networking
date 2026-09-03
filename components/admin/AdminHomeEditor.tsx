"use client";

import { useState } from "react";

import { AutoTextarea } from "@/components/admin/AutoTextarea";
import type { SiteContent } from "@/lib/cms/content";
import type { ImageAsset, ImageKey } from "@/lib/images";

type Props = {
  content: SiteContent["home"];
  images: Record<string, ImageAsset>;
  defaults: Record<string, ImageAsset>;
};

const inputClass =
  "w-full border border-ist-line bg-black px-3 py-2 text-[0.95rem] text-ist-text outline-none focus:border-ist-accent";

/** Join display lines for a single admin field. */
function joinLines(lines: string[]): string {
  return lines.join("\n");
}

/** Split a multiline field back into a fixed number of display lines. */
function splitLines(value: string, count: number): string[] {
  const parts = value.replace(/\r\n/g, "\n").split("\n");
  return Array.from({ length: count }, (_, i) => {
    if (i < count - 1) return parts[i] ?? "";
    return parts.slice(i).join("\n");
  });
}

function split2(value: string): [string, string] {
  const [a = "", b = ""] = splitLines(value, 2);
  return [a, b];
}

function split3(value: string): [string, string, string] {
  const [a = "", b = "", c = ""] = splitLines(value, 3);
  return [a, b, c];
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-1.5 block text-[0.7rem] font-medium uppercase tracking-[0.08em] text-ist-dim">
      {children}
    </span>
  );
}

function Field({
  label,
  value,
  onChange,
  multiline,
  rows = 3,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  rows?: number;
  className?: string;
}) {
  return (
    <label className={className ?? "block"}>
      <Label>{label}</Label>
      {multiline ? (
        <AutoTextarea
          value={value}
          onChange={onChange}
          minRows={rows}
          className={inputClass}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
        />
      )}
    </label>
  );
}

function SectionForm({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="border border-ist-line bg-black/40 p-5 sm:p-6">
      <legend className="px-1 text-[1.05rem] font-semibold tracking-tight text-ist-text">
        {title}
      </legend>
      {hint ? <p className="mt-1 text-[0.85rem] text-ist-muted">{hint}</p> : null}
      <div className="mt-5">{children}</div>
    </fieldset>
  );
}

function ImageSlot({
  imageKey,
  label,
  asset,
  busy,
  onUpload,
  compact,
}: {
  imageKey: ImageKey;
  label?: string;
  asset: ImageAsset | undefined;
  busy: boolean;
  onUpload: (key: ImageKey, file: File) => void;
  compact?: boolean;
}) {
  return (
    <div className="min-w-0">
      {label ? <Label>{label}</Label> : null}
      <div
        className={`relative overflow-hidden border border-ist-line bg-[#050505] ${
          compact ? "aspect-[3/2] max-h-28" : "aspect-[4/3]"
        }`}
      >
        {asset?.src ? (
          // eslint-disable-next-line @next/next/no-img-element -- admin preview; may be Blob URL
          <img
            src={asset.src}
            width={asset.width}
            height={asset.height}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : null}
      </div>
      <label className="mt-2 inline-flex cursor-pointer text-[0.8rem] text-ist-muted hover:text-ist-text">
        <span className="border border-ist-line px-2.5 py-1">
          {busy ? "Uploading…" : "Replace"}
        </span>
        <input
          type="file"
          accept="image/*"
          className="sr-only"
          disabled={busy}
          form="ist-admin-upload"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onUpload(imageKey, file);
            e.target.value = "";
          }}
        />
      </label>
      <p className="mt-1.5 text-[0.7rem] leading-snug text-ist-dim">
        Saves immediately — no need to click Save.
      </p>
    </div>
  );
}

export function AdminHomeEditor({ content, images, defaults }: Props) {
  const [v, setV] = useState(content);
  const [assets, setAssets] = useState(images);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  function set<K extends keyof typeof v>(key: K, value: (typeof v)[K]) {
    setV((prev) => ({ ...prev, [key]: value }));
  }

  async function onUpload(key: ImageKey, file: File) {
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
      home: {
        heroLine1: v.heroLine1,
        heroLine2: v.heroLine2,
        heroCta: v.heroCta,
        supportLines: v.supportLines,
        supportCloser: v.supportCloser,
        problemEyebrow: v.problemEyebrow,
        problemHeading1: v.problemHeading1,
        problemHeading2: v.problemHeading2,
        problemConditions: v.problemConditions.map((c) => c.line) as [
          string,
          string,
          string,
          string,
        ],
        problemCloser: v.problemCloser,
        solutionEyebrow: v.solutionEyebrow,
        solutionHeading1: v.solutionHeading1,
        solutionHeading2: v.solutionHeading2,
        solutionBody: v.solutionBody,
        howItWorksTitle: v.howItWorksTitle,
        howItWorksSteps: v.howItWorksSteps.map((s) => ({ label: s.label, alt: s.alt })),
        locusEyebrow: v.locusEyebrow,
        locusTagline: v.locusTagline,
        locusBody: v.locusBody,
        locusPull: v.locusPull,
        locusPullLead: v.locusPullLead,
        locusAlt: v.locusAlt,
        crucibleEyebrow: v.crucibleEyebrow,
        crucibleTagline: v.crucibleTagline,
        crucibleBody: v.crucibleBody,
        cruciblePull: v.cruciblePull,
        cruciblePullLead: v.cruciblePullLead,
        crucibleAlt: v.crucibleAlt,
        applicationsEyebrow: v.applicationsEyebrow,
        applicationsHeading: v.applicationsHeading,
        applicationsLead: v.applicationsLead,
        applicationsTiles: v.applicationsTiles.map((t) => ({
          label: t.label,
          line: t.line,
          alt: t.alt,
        })),
        applicationsCloserHeading: v.applicationsCloserHeading,
        applicationsCloserBody: v.applicationsCloserBody,
        applicationsCloserCta: v.applicationsCloserCta,
        stackTitle: v.stackTitle,
        stackLayers: v.stackLayers.map((l) => ({
          layer: l.layer,
          product: l.product,
        })),
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
    setMessage("Saved. Refresh the public Home page to see text changes.");
  }

  const img = (key: string) => assets[key] ?? defaults[key];

  return (
    <form onSubmit={onSave} className="max-w-4xl">
      <h1 className="text-[1.75rem] font-semibold tracking-tight">Home</h1>
      <p className="mt-2 text-[0.95rem] text-ist-muted">
        One form per section. Multi-line titles stay as one field � press Enter where the site
        breaks a line. Images upload immediately; save text at the bottom.
      </p>

      <div className="mt-8 flex flex-col gap-8">
        {/* Hero */}
        <SectionForm
          title="Hero"
          hint="Use a line break where the site shows a new line."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Title"
              value={joinLines([v.heroLine1, v.heroLine2])}
              onChange={(x) => {
                const [a, b] = split2(x);
                setV((prev) => ({ ...prev, heroLine1: a, heroLine2: b }));
              }}
              multiline
              rows={2}
              className="block sm:col-span-2"
            />
            <Field label="CTA" value={v.heroCta} onChange={(x) => set("heroCta", x)} />
            <Field
              label="Support panel"
              value={joinLines([v.supportLines[0], v.supportLines[1], v.supportCloser])}
              onChange={(x) => {
                const [a, b, c] = split3(x);
                setV((prev) => ({
                  ...prev,
                  supportLines: [a, b],
                  supportCloser: c,
                }));
              }}
              multiline
              rows={3}
            />
          </div>
        </SectionForm>

        {/* Problem */}
        <SectionForm title="Problem">
          <div className="grid gap-6 lg:grid-cols-[1fr_220px]">
            <div className="grid gap-4">
              <Field
                label="Eyebrow"
                value={v.problemEyebrow}
                onChange={(x) => set("problemEyebrow", x)}
              />
              <Field
                label="Heading"
                value={joinLines([v.problemHeading1, v.problemHeading2])}
                onChange={(x) => {
                  const [a, b] = split2(x);
                  setV((prev) => ({ ...prev, problemHeading1: a, problemHeading2: b }));
                }}
                multiline
                rows={2}
              />
              <Field
                label="Conditions"
                value={joinLines(v.problemConditions.map((c) => c.line))}
                onChange={(x) => {
                  const lines = splitLines(x, v.problemConditions.length);
                  set(
                    "problemConditions",
                    v.problemConditions.map((item, i) => ({
                      ...item,
                      line: lines[i] ?? "",
                    })),
                  );
                }}
                multiline
                rows={4}
              />
              <Field
                label="Closer"
                value={v.problemCloser}
                onChange={(x) => set("problemCloser", x)}
                multiline
                rows={3}
              />
            </div>
            <ImageSlot
              imageKey="section-problem"
              label="Section image"
              asset={img("section-problem")}
              busy={busyKey === "section-problem"}
              onUpload={onUpload}
            />
          </div>
        </SectionForm>

        {/* Solution */}
        <SectionForm title="Solution">
          <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
            <ImageSlot
              imageKey="section-solution"
              label="Section image"
              asset={img("section-solution")}
              busy={busyKey === "section-solution"}
              onUpload={onUpload}
            />
            <div className="grid gap-4">
              <Field
                label="Eyebrow"
                value={v.solutionEyebrow}
                onChange={(x) => set("solutionEyebrow", x)}
              />
              <Field
                label="Heading"
                value={joinLines([v.solutionHeading1, v.solutionHeading2])}
                onChange={(x) => {
                  const [a, b] = split2(x);
                  setV((prev) => ({ ...prev, solutionHeading1: a, solutionHeading2: b }));
                }}
                multiline
                rows={2}
              />
              <Field
                label="Body"
                value={v.solutionBody}
                onChange={(x) => set("solutionBody", x)}
                multiline
                rows={5}
              />
            </div>
          </div>
        </SectionForm>

        {/* How it works */}
        <SectionForm title="How It Works" hint="Four steps — label, alt text, and image per row.">
          <Field
            label="Section title"
            value={v.howItWorksTitle}
            onChange={(x) => set("howItWorksTitle", x)}
            className="mb-5 block max-w-md"
          />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[36rem] border-collapse text-left">
              <thead>
                <tr className="border-b border-ist-line text-[0.7rem] uppercase tracking-[0.08em] text-ist-dim">
                  <th className="pb-2 pr-3 font-medium">#</th>
                  <th className="pb-2 pr-3 font-medium">Label</th>
                  <th className="pb-2 pr-3 font-medium">Alt text</th>
                  <th className="w-36 pb-2 font-medium">Image</th>
                </tr>
              </thead>
              <tbody>
                {v.howItWorksSteps.map((step, i) => (
                  <tr key={step.key} className="border-b border-ist-line/60 align-top">
                    <td className="py-3 pr-3 text-ist-muted">{step.n}</td>
                    <td className="py-3 pr-3">
                      <input
                        type="text"
                        value={step.label}
                        onChange={(e) =>
                          set(
                            "howItWorksSteps",
                            v.howItWorksSteps.map((item, j) =>
                              j === i ? { ...item, label: e.target.value } : item,
                            ),
                          )
                        }
                        className={inputClass}
                      />
                    </td>
                    <td className="py-3 pr-3">
                      <AutoTextarea
                        value={step.alt}
                        minRows={2}
                        onChange={(x) =>
                          set(
                            "howItWorksSteps",
                            v.howItWorksSteps.map((item, j) =>
                              j === i ? { ...item, alt: x } : item,
                            ),
                          )
                        }
                        className={inputClass}
                      />
                    </td>
                    <td className="py-3">
                      <ImageSlot
                        imageKey={step.image as ImageKey}
                        asset={img(step.image)}
                        busy={busyKey === step.image}
                        onUpload={onUpload}
                        compact
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionForm>

        {/* Locus */}
        <SectionForm title="Locus spotlight">
          <div className="grid gap-6 lg:grid-cols-[1fr_220px]">
            <div className="grid gap-4">
              <Field
                label="Eyebrow"
                value={v.locusEyebrow}
                onChange={(x) => set("locusEyebrow", x)}
              />
              <Field
                label="Tagline"
                value={v.locusTagline}
                onChange={(x) => set("locusTagline", x)}
              />
              <Field
                label="Body"
                value={v.locusBody}
                onChange={(x) => set("locusBody", x)}
                multiline
                rows={4}
              />
              <Field
                label="Pull quote"
                value={joinLines([v.locusPullLead, v.locusPull])}
                onChange={(x) => {
                  const [lead, pull] = split2(x);
                  setV((prev) => ({ ...prev, locusPullLead: lead, locusPull: pull }));
                }}
                multiline
                rows={2}
              />
              <Field
                label="Image alt"
                value={v.locusAlt}
                onChange={(x) => set("locusAlt", x)}
                multiline
                rows={2}
              />
            </div>
            <ImageSlot
              imageKey="locus-network-in-action"
              label="Spotlight image"
              asset={img("locus-network-in-action")}
              busy={busyKey === "locus-network-in-action"}
              onUpload={onUpload}
            />
          </div>
        </SectionForm>

        {/* Crucible */}
        <SectionForm title="Crucible spotlight">
          <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
            <ImageSlot
              imageKey="crucible-terrain-sim"
              label="Spotlight image"
              asset={img("crucible-terrain-sim")}
              busy={busyKey === "crucible-terrain-sim"}
              onUpload={onUpload}
            />
            <div className="grid gap-4">
              <Field
                label="Eyebrow"
                value={v.crucibleEyebrow}
                onChange={(x) => set("crucibleEyebrow", x)}
              />
              <Field
                label="Tagline"
                value={v.crucibleTagline}
                onChange={(x) => set("crucibleTagline", x)}
              />
              <Field
                label="Body"
                value={v.crucibleBody}
                onChange={(x) => set("crucibleBody", x)}
                multiline
                rows={4}
              />
              <Field
                label="Pull quote"
                value={joinLines([v.cruciblePullLead, v.cruciblePull])}
                onChange={(x) => {
                  const [lead, pull] = split2(x);
                  setV((prev) => ({
                    ...prev,
                    cruciblePullLead: lead,
                    cruciblePull: pull,
                  }));
                }}
                multiline
                rows={2}
              />
              <Field
                label="Image alt"
                value={v.crucibleAlt}
                onChange={(x) => set("crucibleAlt", x)}
                multiline
                rows={2}
              />
            </div>
          </div>
        </SectionForm>

        {/* Applications */}
        <SectionForm
          title="Applications"
          hint="Header, six tiles, then the closer band — all in this section."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Eyebrow"
              value={v.applicationsEyebrow}
              onChange={(x) => set("applicationsEyebrow", x)}
            />
            <Field
              label="Heading"
              value={v.applicationsHeading}
              onChange={(x) => set("applicationsHeading", x)}
            />
            <Field
              label="Lead"
              value={v.applicationsLead}
              onChange={(x) => set("applicationsLead", x)}
              multiline
              rows={2}
              className="block sm:col-span-2"
            />
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[40rem] border-collapse text-left">
              <thead>
                <tr className="border-b border-ist-line text-[0.7rem] uppercase tracking-[0.08em] text-ist-dim">
                  <th className="pb-2 pr-3 font-medium">Label</th>
                  <th className="pb-2 pr-3 font-medium">Line</th>
                  <th className="pb-2 pr-3 font-medium">Alt</th>
                  <th className="w-36 pb-2 font-medium">Image</th>
                </tr>
              </thead>
              <tbody>
                {v.applicationsTiles.map((tile, i) => (
                  <tr key={tile.id} className="border-b border-ist-line/60 align-top">
                    <td className="py-3 pr-3">
                      <input
                        type="text"
                        value={tile.label}
                        onChange={(e) =>
                          set(
                            "applicationsTiles",
                            v.applicationsTiles.map((item, j) =>
                              j === i ? { ...item, label: e.target.value } : item,
                            ),
                          )
                        }
                        className={inputClass}
                      />
                    </td>
                    <td className="py-3 pr-3">
                      <AutoTextarea
                        value={tile.line}
                        minRows={2}
                        onChange={(x) =>
                          set(
                            "applicationsTiles",
                            v.applicationsTiles.map((item, j) =>
                              j === i ? { ...item, line: x } : item,
                            ),
                          )
                        }
                        className={inputClass}
                      />
                    </td>
                    <td className="py-3 pr-3">
                      <AutoTextarea
                        value={tile.alt}
                        minRows={2}
                        onChange={(x) =>
                          set(
                            "applicationsTiles",
                            v.applicationsTiles.map((item, j) =>
                              j === i ? { ...item, alt: x } : item,
                            ),
                          )
                        }
                        className={inputClass}
                      />
                    </td>
                    <td className="py-3">
                      <ImageSlot
                        imageKey={tile.image as ImageKey}
                        asset={img(tile.image)}
                        busy={busyKey === tile.image}
                        onUpload={onUpload}
                        compact
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_200px]">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Closer heading"
                value={v.applicationsCloserHeading}
                onChange={(x) => set("applicationsCloserHeading", x)}
                className="block sm:col-span-2"
              />
              <Field
                label="Closer body"
                value={v.applicationsCloserBody}
                onChange={(x) => set("applicationsCloserBody", x)}
                multiline
                rows={3}
                className="block sm:col-span-2"
              />
              <Field
                label="Closer CTA"
                value={v.applicationsCloserCta}
                onChange={(x) => set("applicationsCloserCta", x)}
              />
            </div>
            <ImageSlot
              imageKey="band-one-platform"
              label="Closer band"
              asset={img("band-one-platform")}
              busy={busyKey === "band-one-platform"}
              onUpload={onUpload}
            />
          </div>
        </SectionForm>

        {/* Stack */}
        <SectionForm title="Platform Stack">
          <Field
            label="Section title"
            value={v.stackTitle}
            onChange={(x) => set("stackTitle", x)}
            className="mb-5 block max-w-md"
          />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[28rem] border-collapse text-left">
              <thead>
                <tr className="border-b border-ist-line text-[0.7rem] uppercase tracking-[0.08em] text-ist-dim">
                  <th className="pb-2 pr-3 font-medium">Layer name</th>
                  <th className="pb-2 font-medium">Product (blank = none)</th>
                </tr>
              </thead>
              <tbody>
                {v.stackLayers.map((layer, i) => (
                  <tr key={i} className="border-b border-ist-line/60">
                    <td className="py-3 pr-3">
                      <input
                        type="text"
                        value={layer.layer}
                        onChange={(e) =>
                          set(
                            "stackLayers",
                            v.stackLayers.map((item, j) =>
                              j === i ? { ...item, layer: e.target.value } : item,
                            ),
                          )
                        }
                        className={inputClass}
                      />
                    </td>
                    <td className="py-3">
                      <input
                        type="text"
                        value={layer.product ?? ""}
                        onChange={(e) =>
                          set(
                            "stackLayers",
                            v.stackLayers.map((item, j) =>
                              j === i
                                ? {
                                    ...item,
                                    product: e.target.value.trim() ? e.target.value : null,
                                  }
                                : item,
                            ),
                          )
                        }
                        className={inputClass}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionForm>

        {/* Vision */}
        <SectionForm title="Vision / closing CTA">
          <div className="grid gap-6 lg:grid-cols-[1fr_220px]">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
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
              <Field
                label="Accent line"
                value={v.visionAccent}
                onChange={(x) => set("visionAccent", x)}
                multiline
                rows={2}
                className="block sm:col-span-2"
              />
              <Field
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
              <Field
                label="Primary CTA"
                value={v.visionPrimaryCta}
                onChange={(x) => set("visionPrimaryCta", x)}
              />
              <Field
                label="Secondary CTA"
                value={v.visionSecondaryCta}
                onChange={(x) => set("visionSecondaryCta", x)}
              />
            </div>
            <ImageSlot
              imageKey="band-vision"
              label="Band image"
              asset={img("band-vision")}
              busy={busyKey === "band-vision"}
              onUpload={onUpload}
            />
          </div>
        </SectionForm>
      </div>

      <div className="sticky bottom-0 mt-8 border-t border-ist-line bg-ist-bg/95 py-4 backdrop-blur">
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={status === "saving"}
            className="bg-ist-accent px-5 py-2.5 text-[0.95rem] font-medium text-white hover:bg-ist-accent-deep disabled:opacity-60"
          >
            {status === "saving" ? "Saving…" : "Save all Home text"}
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
