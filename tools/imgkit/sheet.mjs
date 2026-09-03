// Builds labeled contact sheets so the whole image library can be reviewed at a glance.
// Usage: node sheet.mjs "../../individual image" ../_sheets

import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const COLS = 4;
const ROWS = 4;
const CELL_W = 400;
const CELL_H = 250;
const PAD = 8;
const LABEL_H = 24;

const SHEET_W = COLS * (CELL_W + PAD) + PAD;
const SHEET_H = ROWS * (CELL_H + LABEL_H + PAD) + PAD;

const escapeXml = (s) => s.replace(/[<>&'"]/g, (c) => `&#${c.charCodeAt(0)};`);

const [srcDir, outDir] = process.argv.slice(2);

await mkdir(outDir, { recursive: true });

const files = (await readdir(srcDir))
  .filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
  .sort();

const perSheet = COLS * ROWS;
const manifest = {};

for (let start = 0; start < files.length; start += perSheet) {
  const chunk = files.slice(start, start + perSheet);
  const sheetNo = start / perSheet + 1;
  const composites = [];
  const labels = [];

  for (const [i, name] of chunk.entries()) {
    const ref = `${sheetNo}-${String(i + 1).padStart(2, "0")}`;
    manifest[ref] = name;

    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const x = PAD + col * (CELL_W + PAD);
    const y = PAD + row * (CELL_H + LABEL_H + PAD);

    composites.push({
      input: await sharp(path.join(srcDir, name))
        .resize(CELL_W, CELL_H, { fit: "contain", background: "#000" })
        .png()
        .toBuffer(),
      left: x,
      top: y,
    });

    labels.push(
      `<rect x="${x}" y="${y + CELL_H}" width="${CELL_W}" height="${LABEL_H}" fill="#000"/>` +
        `<text x="${x + 6}" y="${y + CELL_H + 17}" font-family="monospace" font-size="13" fill="#ffaa50">` +
        `${escapeXml(ref)}  ${escapeXml(name.replace(/\.png$/i, "").slice(0, 44))}</text>`,
    );
  }

  composites.push({
    input: Buffer.from(
      `<svg width="${SHEET_W}" height="${SHEET_H}" xmlns="http://www.w3.org/2000/svg">${labels.join("")}</svg>`,
    ),
    left: 0,
    top: 0,
  });

  await sharp({
    create: { width: SHEET_W, height: SHEET_H, channels: 3, background: "#121212" },
  })
    .composite(composites)
    .png({ compressionLevel: 9 })
    .toFile(path.join(outDir, `sheet-${String(sheetNo).padStart(2, "0")}.png`));
}

await writeFile(path.join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2));
console.log(`${files.length} images -> ${Math.ceil(files.length / perSheet)} sheets in ${outDir}`);
