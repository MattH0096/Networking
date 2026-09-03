/**
 * Applies the house image treatment and writes web-ready assets to /public/img.
 *
 * Treatment, per the build spec: desaturate slightly and warm the shadows
 * toward the palette. The warmth is a per-channel additive offset, which is
 * dominant in dark areas and negligible in highlights — a grade, not a wash.
 * Overlay gradients are not baked into the files.
 *
 * Run with: npm run assets      (add --preview to also emit PNG contact sheets)
 */

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

import { ASSETS, ROLE_WIDTHS } from "./assets.config.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../..");
const SRC_DIR = path.join(repoRoot, "individual image");
const OUT_DIR = path.join(repoRoot, "public", "img");
const PREVIEW_DIR = path.join(here, "..", "_preview");

const SATURATION = 0.88;
/** Additive per-channel offset: red up, blue down. Lands in the shadows. */
const WARM_OFFSET = [7, 1, -5];

function treat(pipeline) {
  return pipeline
    .toColourspace("srgb")
    .modulate({ saturation: SATURATION })
    .linear([1, 1, 1], WARM_OFFSET);
}

async function main() {
  const withPreview = process.argv.includes("--preview");
  await mkdir(OUT_DIR, { recursive: true });
  if (withPreview) await mkdir(PREVIEW_DIR, { recursive: true });

  const manifest = {};
  const report = [];

  for (const asset of ASSETS) {
    const srcPath = path.join(SRC_DIR, asset.src);
    const maxWidth = ROLE_WIDTHS[asset.role];
    const applyTreat = asset.treat !== false;

    let pipeline = sharp(srcPath).rotate();

    if (typeof asset.zoom === "number" && asset.zoom > 0 && asset.zoom < 1) {
      const meta = await sharp(srcPath).rotate().metadata();
      const sw = meta.width ?? 0;
      const sh = meta.height ?? 0;
      const w = Math.max(1, Math.round(sw * asset.zoom));
      const h = Math.max(1, Math.round(sh * asset.zoom));
      const left = Math.max(0, Math.round((sw - w) / 2));
      const top = Math.max(0, Math.round((sh - h) / 2));
      pipeline = sharp(srcPath).rotate().extract({ left, top, width: w, height: h });
    }

    if (asset.size) {
      pipeline = pipeline.resize({
        width: asset.size.width,
        height: asset.size.height,
        fit: "cover",
        position: "centre",
      });
    } else {
      pipeline = pipeline.resize({ width: maxWidth, withoutEnlargement: true });
    }

    if (applyTreat) {
      pipeline = treat(pipeline);
    } else {
      pipeline = pipeline.toColourspace("srgb");
    }

    const outName = `${asset.slug}.webp`;
    const { width, height, size } = await pipeline
      .clone()
      .webp({ quality: 88, effort: 5 })
      .toFile(path.join(OUT_DIR, outName));

    if (withPreview) {
      await sharp(path.join(OUT_DIR, outName))
        .resize({ width: 640 })
        .png()
        .toFile(path.join(PREVIEW_DIR, `${asset.slug}.png`));
    }

    manifest[asset.slug] = { src: `/img/${outName}`, width, height };
    report.push({
      slug: asset.slug,
      size: `${width}x${height}`,
      kb: Math.round(size / 1024),
      note: asset.note,
    });
  }

  const generatedDir = path.join(repoRoot, "lib", "generated");
  await mkdir(generatedDir, { recursive: true });
  await writeFile(
    path.join(generatedDir, "image-manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );

  const totalKb = report.reduce((sum, entry) => sum + entry.kb, 0);
  console.table(report.map(({ slug, size, kb }) => ({ slug, size, kb })));
  console.log(`${report.length} assets · ${totalKb} KB total → public/img`);
}

await main();
