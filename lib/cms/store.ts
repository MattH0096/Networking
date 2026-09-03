import "server-only";

import { promises as fs } from "fs";
import path from "path";

import { del, get, list, put, type PutBlobResult } from "@vercel/blob";

import type { SiteOverrides } from "@/lib/cms/types";

const CONTENT_DIR = path.join(process.cwd(), "content");
const OVERRIDES_PATH = path.join(CONTENT_DIR, "overrides.json");
const BLOB_PREFIX = "cms/overrides/";
const UPLOAD_PREFIX = "cms/uploads/";
const LATEST_PATH = `${BLOB_PREFIX}latest.json`;

let snapshot: SiteOverrides | null = null;

function blobEnabled() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

function onVercel() {
  return Boolean(process.env.VERCEL);
}

async function ensureDir() {
  await fs.mkdir(CONTENT_DIR, { recursive: true });
}

async function readFromFs(): Promise<SiteOverrides> {
  try {
    const raw = await fs.readFile(OVERRIDES_PATH, "utf8");
    return JSON.parse(raw) as SiteOverrides;
  } catch {
    return {};
  }
}

async function readBlobBody(pathnameOrUrl: string): Promise<SiteOverrides | null> {
  for (const access of ["public", "private"] as const) {
    try {
      const result = await get(pathnameOrUrl, { access, useCache: false });
      if (!result?.stream) continue;
      const text = await new Response(result.stream).text();
      return JSON.parse(text) as SiteOverrides;
    } catch {
      /* try next access mode */
    }
  }
  return null;
}

async function readFromBlob(): Promise<SiteOverrides | null> {
  const latest = await readBlobBody(LATEST_PATH);
  if (latest) return latest;

  const { blobs } = await list({ prefix: BLOB_PREFIX, limit: 1000 });
  if (blobs.length === 0) return null;
  const sorted = [...blobs].sort(
    (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
  );
  const newest = sorted[0];
  if (!newest) return null;
  return readBlobBody(newest.pathname);
}

async function putBlob(
  pathname: string,
  body: string | Buffer,
  contentType: string,
): Promise<PutBlobResult> {
  let lastError: unknown;
  for (const access of ["public", "private"] as const) {
    try {
      return await put(pathname, body, {
        access,
        contentType,
        addRandomSuffix: false,
        allowOverwrite: true,
        cacheControlMaxAge: 60,
      });
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError instanceof Error
    ? lastError
    : new Error("Blob upload failed for both public and private access.");
}

function mergeOverrides(base: SiteOverrides, overlay: SiteOverrides): SiteOverrides {
  const overlayNewsPosts = overlay.news?.posts;
  const overlayCareerRoles = overlay.careers?.roles;

  return {
    ...base,
    ...overlay,
    home: { ...base.home, ...overlay.home },
    solutions: { ...base.solutions, ...overlay.solutions },
    locus: { ...base.locus, ...overlay.locus },
    crucible: { ...base.crucible, ...overlay.crucible },
    about: { ...base.about, ...overlay.about },
    contact: { ...base.contact, ...overlay.contact },
    insights: { ...base.insights, ...overlay.insights },
    news: {
      ...base.news,
      ...overlay.news,
      // Prefer Blob lists only when they actually contain items.
      posts:
        overlayNewsPosts && overlayNewsPosts.length > 0
          ? overlayNewsPosts
          : (base.news?.posts ?? overlayNewsPosts),
    },
    careers: {
      ...base.careers,
      ...overlay.careers,
      roles:
        overlayCareerRoles && overlayCareerRoles.length > 0
          ? overlayCareerRoles
          : (base.careers?.roles ?? overlayCareerRoles),
    },
    images: { ...base.images, ...overlay.images },
  };
}

/** Last loaded overrides (layout primes this so `img()` stays sync). */
export function peekOverrides(): SiteOverrides | null {
  return snapshot;
}

export async function readOverrides(): Promise<SiteOverrides> {
  const fromFs = await readFromFs();

  if (blobEnabled()) {
    try {
      const fromBlob = await readFromBlob();
      if (fromBlob) {
        // Blob wins for CMS edits; committed file seeds empty news/careers lists.
        const merged = mergeOverrides(fromFs, fromBlob);
        snapshot = merged;
        return merged;
      }
    } catch (error) {
      console.error("[cms] blob read failed, falling back to committed file", error);
    }
  }

  snapshot = fromFs;
  return fromFs;
}

export async function writeOverrides(next: SiteOverrides): Promise<SiteOverrides> {
  const payload: SiteOverrides = {
    ...next,
    updatedAt: new Date().toISOString(),
  };
  const body = `${JSON.stringify(payload, null, 2)}\n`;

  if (blobEnabled()) {
    await putBlob(LATEST_PATH, body, "application/json");
    snapshot = payload;
    return payload;
  }

  if (onVercel()) {
    throw new Error(
      "Admin cannot save on Vercel without Blob storage. In the Vercel project: Storage → Create Blob → connect it, then redeploy.",
    );
  }

  await ensureDir();
  await fs.writeFile(OVERRIDES_PATH, body, "utf8");
  snapshot = payload;
  return payload;
}

export async function patchOverrides(patch: SiteOverrides): Promise<SiteOverrides> {
  // Fresh read every time (no reliance on in-memory snapshot alone).
  const current = await readOverrides();
  const merged: SiteOverrides = {
    ...current,
    ...patch,
    home: { ...current.home, ...patch.home },
    solutions: { ...current.solutions, ...patch.solutions },
    locus: { ...current.locus, ...patch.locus },
    crucible: { ...current.crucible, ...patch.crucible },
    about: { ...current.about, ...patch.about },
    contact: { ...current.contact, ...patch.contact },
    insights: { ...current.insights, ...patch.insights },
    news: { ...current.news, ...patch.news },
    careers: { ...current.careers, ...patch.careers },
    images: { ...current.images, ...patch.images },
  };

  // Text save must not wipe a concurrent image upload.
  // Re-read Blob images right before write; latest blob + this patch win.
  if (blobEnabled()) {
    try {
      const latest = await readFromBlob();
      if (latest?.images) {
        merged.images = {
          ...merged.images,
          ...latest.images,
          ...(patch.images ?? {}),
        };
      }
      // Same for news/careers lists if this patch isn't replacing them.
      if (!patch.news?.posts && latest?.news?.posts?.length) {
        merged.news = { ...merged.news, posts: latest.news.posts };
      }
      if (!patch.careers?.roles && latest?.careers?.roles?.length) {
        merged.careers = { ...merged.careers, roles: latest.careers.roles };
      }
    } catch (error) {
      console.warn("[cms] pre-write refresh failed", error);
    }
  }

  return writeOverrides(merged);
}

export function uploadsDir() {
  return path.join(process.cwd(), "public", "uploads");
}

export async function putUpload(filename: string, data: Buffer, contentType: string) {
  if (blobEnabled()) {
    const blob = await putBlob(`${UPLOAD_PREFIX}${filename}`, data, contentType);
    return blob.url;
  }

  if (onVercel()) {
    throw new Error(
      "Image uploads need Vercel Blob. Create a Blob store on the project and redeploy.",
    );
  }

  const dir = uploadsDir();
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, filename), data);
  return `/uploads/${filename}`;
}

/** Best-effort cleanup of old timestamped override files from earlier CMS versions. */
export async function pruneOldOverrideBlobs() {
  if (!blobEnabled()) return;
  try {
    const { blobs } = await list({ prefix: BLOB_PREFIX, limit: 1000 });
    const stale = blobs.filter((b) => b.pathname !== LATEST_PATH);
    if (stale.length) await del(stale.map((b) => b.url));
  } catch (error) {
    console.warn("[cms] could not prune old override blobs", error);
  }
}
