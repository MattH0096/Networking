/**
 * Captures each homepage section on its own, at readable scale, so layout and
 * type can be reviewed section by section rather than in one unreadable
 * full-page strip.
 *
 *   node tools/qa/sections.mjs [baseUrl] [width]
 */
import { mkdir, rm } from "node:fs/promises";
import path from "node:path";

import { chromium } from "playwright";

import { open } from "./open.mjs";
import { sweep } from "./scroll.mjs";

const BASE = process.argv.find((a) => a.startsWith("http")) ?? "http://localhost:3000";
const WIDTH = Number(process.argv.find((a) => /^\d+$/.test(a)) ?? 1440);
const OUT = `tools/_sections/${WIDTH}`;

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: WIDTH, height: 1000 },
  deviceScaleFactor: 1,
  isMobile: WIDTH < 700,
});

await open(page, BASE);

await sweep(page);

const sections = await page.locator("main > section").all();
console.log(`${sections.length} sections at ${WIDTH}px`);

for (const [i, section] of sections.entries()) {
  const file = path.join(OUT, `${String(i + 1).padStart(2, "0")}.png`);
  await section.screenshot({ path: file });
  console.log(`  ${file}`);
}

await browser.close();
