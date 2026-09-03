"use client";

import { useMemo, useState } from "react";

import type { ImageAsset, ImageKey } from "@/lib/images";

type Props = {
  keys: ImageKey[];
  current: Record<string, ImageAsset>;
  defaults: Record<string, ImageAsset>;
};

export function AdminImageEditor({ keys, current, defaults }: Props) {
  const [assets, setAssets] = useState(current);
  const [filter, setFilter] = useState("");
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const list = useMemo(() => {
    const q = filter.trim().toLowerCase();
    return keys.filter((k) => !q || k.toLowerCase().includes(q));
  }, [keys, filter]);

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
    setMessage(`Updated ${key}.`);
  }

  return (
    <div>
      <h1 className="text-[1.75rem] font-semibold tracking-tight">Images</h1>
      <p className="mt-2 max-w-2xl text-[0.95rem] text-ist-muted">
        Upload a new file to replace any site image. Replacements save immediately (converted to
        WebP). You can also replace images on each page editor — same result.
      </p>

      <input
        type="search"
        placeholder="Filter by key…"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="mt-6 w-full max-w-md border border-ist-line bg-black px-3 py-2.5 text-[0.95rem] outline-none focus:border-ist-accent"
      />

      {message ? <p className="mt-3 text-[0.85rem] text-ist-muted">{message}</p> : null}

      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {list.map((key) => {
          const asset = assets[key] ?? defaults[key];
          return (
            <li key={key} className="border border-ist-line bg-black p-4">
              <p className="font-mono text-[0.75rem] text-ist-accent-bright">{key}</p>
              <div className="relative mt-3 aspect-[4/3] overflow-hidden border border-ist-line bg-[#050505]">
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
              <label className="mt-3 inline-flex cursor-pointer items-center gap-2 text-[0.85rem] text-ist-muted hover:text-ist-text">
                <span className="border border-ist-line px-3 py-1.5">
                  {busyKey === key ? "Uploading…" : "Replace image"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  disabled={busyKey === key}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void onUpload(key, file);
                    e.target.value = "";
                  }}
                />
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
