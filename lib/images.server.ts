import "server-only";

import { readFileSync } from "fs";
import path from "path";

import { peekOverrides } from "@/lib/cms/store";
import {
  imgManifest,
  resolveImg,
  tryResolveImg,
  type ImageAsset,
  type ImageKey,
} from "@/lib/images";

export type { ImageAsset, ImageKey };

function imageOverrides(): Partial<Record<string, ImageAsset>> {
  const live = peekOverrides()?.images;
  if (live) return live;
  try {
    const raw = readFileSync(path.join(process.cwd(), "content", "overrides.json"), "utf8");
    const data = JSON.parse(raw) as { images?: Partial<Record<string, ImageAsset>> };
    return data.images ?? {};
  } catch {
    return {};
  }
}

/** Manifest + CMS upload overrides. Server Components / Route Handlers only. */
export function img(key: ImageKey | string): ImageAsset {
  return resolveImg(key, imageOverrides());
}

export function tryImg(key: string | undefined | null): ImageAsset | null {
  return tryResolveImg(key, imageOverrides());
}

export { imgManifest };
