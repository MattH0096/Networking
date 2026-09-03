/**
 * Screenshots a single element, at real resolution, after the page has settled.
 *
 *   node tools/qa/clip.mjs <url> <selector> <outName> [width]
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";

import { chromium } from "playwright";

import { open } from "./open.mjs";
import { sweep } from "./scroll.mjs";

const [, , url, selector, name, widthArg] = process.argv;
const width = Number(widthArg ?? 1440);
const OUT = "tools/_shots";

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width, height: 900 },
  deviceScaleFactor: 2,
});

await open(page, url);
await sweep(page);

const target = page.locator(selector).first();
await target.scrollIntoViewIfNeeded();
// Let any scroll-triggered sequence finish before the shutter.
await page.waitForTimeout(4500);

const file = path.join(OUT, `${name}.png`);
await target.screenshot({ path: file });
console.log(file);

await browser.close();
