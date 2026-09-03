/**
 * Measures the JS the homepage actually ships and confirms the reduced-motion
 * floor: with motion disabled, no content may be left hidden.
 *
 * Run against a production server (`next start`), not `next dev`.
 *
 *   node tools/qa/perf.mjs [baseUrl]
 */
import { gzipSync } from "node:zlib";

import { chromium } from "playwright";

import { open } from "./open.mjs";

const BASE = process.argv.find((a) => a.startsWith("http")) ?? "http://localhost:3100";
const JS_BUDGET_KB = 200;

const browser = await chromium.launch();
const problems = [];

// ---- JS budget -------------------------------------------------------------
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const scripts = new Map();

page.on("response", async (res) => {
  const url = res.url();
  if (!url.startsWith(BASE) || !/\.js(\?|$)/.test(url)) return;
  try {
    const body = await res.body();
    scripts.set(url, gzipSync(body).length);
  } catch {
    // Response body already discarded — not counted.
  }
});

await open(page, BASE, 1500);

const totalKb = [...scripts.values()].reduce((a, b) => a + b, 0) / 1024;
const ok = totalKb <= JS_BUDGET_KB;
console.log(`${ok ? "PASS" : "FAIL"}  JS budget: ${totalKb.toFixed(1)} KB gzipped of ${JS_BUDGET_KB} KB across ${scripts.size} files`);
if (!ok) problems.push(`JS budget exceeded: ${totalKb.toFixed(1)} KB`);

// ---- Reduced motion --------------------------------------------------------
const reduced = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  reducedMotion: "reduce",
});
await open(reduced, BASE, 1200);

const hidden = await reduced.evaluate(() =>
  [...document.querySelectorAll(".reveal")]
    .filter((el) => Number.parseFloat(getComputedStyle(el).opacity) < 0.99)
    .map((el) => el.textContent.trim().slice(0, 40)),
);

const motionOk = hidden.length === 0;
console.log(
  `${motionOk ? "PASS" : "FAIL"}  reduced motion: all ${await reduced.locator(".reveal").count()} revealed blocks are visible without scrolling`,
);
if (!motionOk) problems.push(`hidden with reduced motion: ${hidden.join(" | ")}`);

await browser.close();

console.log("");
console.log(problems.length ? `${problems.length} failure(s).` : "Performance and motion floors hold.");
process.exitCode = problems.length ? 1 : 0;
