import "server-only";

import { readOverrides, readPrivatePaper } from "@/lib/cms/store";

/**
 * Server-side resolution of gated papers.
 *
 * Preferred path: admin-uploaded PDF stored privately (`pdfStorageKey` on the
 * CMS paper). Legacy seed files still live in `private/papers/` and are mapped
 * below so existing listings keep working until replaced in admin.
 *
 * Files are never under `public/`. The only way to obtain one is to pass the
 * gate in `app/api/insights/[slug]/download`.
 */

const LEGACY_FILES: Record<string, { file: string; downloadAs: string }> = {
  "distribution-completeness": {
    file: "IST_Whitepaper.pdf",
    downloadAs: "IST-Distribution-Completeness-in-Dynamic-Mesh-Networks.pdf",
  },
};

export type PaperFile = { bytes: Buffer; downloadAs: string };

function safeDownloadName(name: string, fallback: string): string {
  const cleaned = name.replace(/[/\\?%*:|"<>]/g, "-").trim();
  if (!cleaned) return fallback;
  return cleaned.toLowerCase().endsWith(".pdf") ? cleaned : `${cleaned}.pdf`;
}

export async function loadPaper(slug: string): Promise<PaperFile | null> {
  const overrides = await readOverrides();
  const fromCms = overrides.insights?.papers?.find((p) => (p.slug ?? "").trim() === slug);
  const cmsKey = fromCms?.pdfStorageKey?.trim();
  if (cmsKey) {
    const bytes = await readPrivatePaper(cmsKey);
    if (bytes) {
      return {
        bytes,
        downloadAs: safeDownloadName(
          fromCms?.downloadAs ?? "",
          `${slug}.pdf`,
        ),
      };
    }
  }

  const legacy = LEGACY_FILES[slug];
  if (!legacy) return null;

  const bytes = await readPrivatePaper(legacy.file);
  if (!bytes) return null;
  return { bytes, downloadAs: legacy.downloadAs };
}

/** True when a PDF is available for the slug (CMS upload or seeded file). */
export async function paperFileReady(slug: string): Promise<boolean> {
  return (await loadPaper(slug)) !== null;
}
