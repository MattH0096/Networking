"use client";

import { AutoTextarea } from "@/components/admin/AutoTextarea";
import type { ImageAsset } from "@/lib/images";

export const adminInputClass =
  "w-full border border-ist-line bg-black px-3 py-2 text-[0.95rem] text-ist-text outline-none focus:border-ist-accent";

export function joinLines(lines: string[]): string {
  return lines.join("\n");
}

export function splitLines(value: string, count: number): string[] {
  const parts = value.replace(/\r\n/g, "\n").split("\n");
  return Array.from({ length: count }, (_, i) => {
    if (i < count - 1) return parts[i] ?? "";
    return parts.slice(i).join("\n");
  });
}

export function split2(value: string): [string, string] {
  const [a = "", b = ""] = splitLines(value, 2);
  return [a, b];
}

export function split3(value: string): [string, string, string] {
  const [a = "", b = "", c = ""] = splitLines(value, 3);
  return [a, b, c];
}

export function AdminLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-1.5 block text-[0.7rem] font-medium uppercase tracking-[0.08em] text-ist-dim">
      {children}
    </span>
  );
}

export function AdminField({
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
      <AdminLabel>{label}</AdminLabel>
      {multiline ? (
        <AutoTextarea
          value={value}
          onChange={onChange}
          minRows={rows}
          className={adminInputClass}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={adminInputClass}
        />
      )}
    </label>
  );
}

export function AdminSectionForm({
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

export function AdminImageSlot({
  imageKey,
  label,
  asset,
  busy,
  onUpload,
  compact,
}: {
  imageKey: string;
  label?: string;
  asset: ImageAsset | undefined;
  busy: boolean;
  onUpload: (key: string, file: File) => void;
  compact?: boolean;
}) {
  return (
    <div className="min-w-0">
      {label ? <AdminLabel>{label}</AdminLabel> : null}
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
          // Keep uploads out of the parent text-save form submit path.
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
