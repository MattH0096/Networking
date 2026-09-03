import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";

/**
 * Server-side resolution of gated papers.
 *
 * Files live in `private/papers/`, outside `public/`, so nothing in this
 * directory is reachable by URL. The only way to obtain one is to pass the gate
 * in `app/api/insights/[slug]/download`, which streams the bytes back rather
 * than redirecting to a location the visitor could then share.
 *
 * {{TBD}} — the PDF itself has not been supplied. Drop it at the `file` path
 * below and the flow works with no code change; until then the route answers
 * with an honest "not yet available" rather than a broken download.
 */

const PAPER_DIR = path.join(process.cwd(), "private", "papers");

const FILES: Record<string, { file: string; downloadAs: string }> = {
  "distribution-completeness": {
    file: "distribution-completeness-in-dynamic-mesh-networks.pdf",
    downloadAs: "IST-Distribution-Completeness-in-Dynamic-Mesh-Networks.pdf",
  },
};

export type PaperFile = { bytes: Buffer; downloadAs: string };

export async function loadPaper(slug: string): Promise<PaperFile | null> {
  const entry = FILES[slug];
  if (!entry) return null;

  // Guard against a slug that tries to climb out of the directory, even though
  // the lookup above already restricts us to known keys.
  const resolved = path.join(PAPER_DIR, entry.file);
  if (!resolved.startsWith(PAPER_DIR + path.sep)) return null;

  try {
    return { bytes: await readFile(resolved), downloadAs: entry.downloadAs };
  } catch {
    return null;
  }
}

export function paperExists(slug: string): boolean {
  return slug in FILES;
}
