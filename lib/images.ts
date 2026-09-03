/**
 * Shared image types + manifest lookup (safe for client and server).
 *
 * CMS upload overrides are applied in `lib/images.server.ts` (Node `fs` only).
 */

import manifest from "@/lib/generated/image-manifest.json";

export type ImageKey = keyof typeof manifest;

export type ImageAsset = {
  src: string;
  width: number;
  height: number;
};

const MANIFEST = manifest as Record<string, ImageAsset>;

/** Resolve from the built manifest only (no CMS overrides). */
export function imgManifest(key: ImageKey | string): ImageAsset {
  return MANIFEST[key] ?? { src: "", width: 0, height: 0 };
}

/**
 * Merge optional override map over the manifest.
 * Prefer `img` from `@/lib/images.server` in Server Components.
 */
export function resolveImg(
  key: ImageKey | string,
  overrides?: Partial<Record<string, ImageAsset>> | null,
): ImageAsset {
  if (overrides?.[key]) return overrides[key]!;
  return imgManifest(key);
}

export function tryResolveImg(
  key: string | undefined | null,
  overrides?: Partial<Record<string, ImageAsset>> | null,
): ImageAsset | null {
  if (!key) return null;
  const asset = resolveImg(key, overrides);
  return asset.src ? asset : null;
}
