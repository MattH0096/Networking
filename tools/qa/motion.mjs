/**
 * Verifies the §7 motion pass, and that every piece of it is optional.
 *
 * Motion bugs hide easily: an entrance animation that never finishes, or a
 * parallax layer whose travel exceeds its bleed, both look fine in a single
 * screenshot. These checks measure the end state and the extremes instead.
 *
 *   node tools/qa/motion.mjs [baseUrl]
 */
import { chromium } from "playwright";

import { open } from "./open.mjs";
import { sweep } from "./scroll.mjs";

const BASE = process.argv.find((a) => a.startsWith("http")) ?? "http://localhost:3000";

const browser = await chromium.launch();
const problems = [];
const check = (ok, message) => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${message}`);
  if (!ok) problems.push(message);
};

// ---- Full motion -----------------------------------------------------------
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await open(page, BASE, 2000);

// The hero entrance must finish, not merely start.
const heroVisible = await page.evaluate(() =>
  [...document.querySelectorAll(".hero-in")].every(
    (el) => Number.parseFloat(getComputedStyle(el).opacity) > 0.99,
  ),
);
check(heroVisible, "hero entrance settles fully opaque");

const heroDelays = await page.evaluate(() =>
  [...document.querySelectorAll(".hero-in")].map((el) => getComputedStyle(el).animationDelay),
);
check(
  heroDelays[0] === "0s" && heroDelays.includes("0.4s"),
  `hero entrance stages including the 400ms CTA (got ${heroDelays.join(", ")})`,
);

check(
  await page.evaluate(() => Boolean(document.querySelector("#home-hero video"))),
  "hero uses the background video (no still poster)",
);

// Vision band still parallaxes. The hero uses video instead of a parallax still.
const layerCount = await page.locator(".parallax-layer").count();
const readings = Array.from({ length: layerCount }, () => []);
const viewportHeight = page.viewportSize().height;
const step = Math.round(viewportHeight / 3);
const documentHeight = await page.evaluate(() => document.documentElement.scrollHeight);

for (let scrolled = 0; scrolled <= documentHeight; scrolled += step) {
  const sample = await page.evaluate(() =>
    [...document.querySelectorAll(".parallax-layer")].map((layer) => {
      const rect = layer.parentElement.getBoundingClientRect();
      return {
        visible: rect.bottom > 0 && rect.top < window.innerHeight,
        y: new DOMMatrixReadOnly(getComputedStyle(layer).transform).m42,
        bleed: rect.height * 0.12,
      };
    }),
  );
  sample.forEach((s, i) => s.visible && readings[i].push(s));

  await page.mouse.wheel(0, step);
  await page.waitForTimeout(80);
}

check(layerCount === 1, `vision parallax layer present (${layerCount})`);
for (const [i, samples] of readings.entries()) {
  if (samples.length < 2) {
    check(false, `parallax layer ${i + 1} was never sampled while on screen`);
    continue;
  }
  const ys = samples.map((s) => s.y);
  const moved = Math.max(...ys) - Math.min(...ys);
  const worst = Math.max(...ys.map(Math.abs));
  const bleed = samples[0].bleed;

  check(moved > 20, `parallax layer ${i + 1} travels on scroll (${moved.toFixed(0)}px)`);
  check(
    worst <= bleed,
    `parallax layer ${i + 1} stays within its bleed (${worst.toFixed(0)}px of ${bleed.toFixed(0)}px)`,
  );
}

// Stack layers stagger at the spec's 100ms rather than the default 60ms.
await sweep(page);
const stackDelays = await page.evaluate(() =>
  [...document.querySelectorAll("#stack li.reveal")].map(
    (el) => getComputedStyle(el).transitionDelay.split(",")[0].trim(),
  ),
);
check(
  stackDelays.join(",") === "0s,0.1s,0.2s,0.3s,0.4s",
  `stack staggers 100ms apart (got ${stackDelays.join(", ")})`,
);

// ---- Locus distribution plate ----------------------------------------------
const locus = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await open(locus, `${BASE}/locus`, 1200);
const distribution = await locus
  .locator('img[alt*="Assured Distribution in Action"]')
  .first()
  .waitFor({ state: "visible", timeout: 3000 })
  .then(() => true, () => false);
check(distribution, "Locus shows Assured Distribution plate");
await locus.close();

// ---- Reduced motion --------------------------------------------------------
const reduced = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  reducedMotion: "reduce",
});
await open(reduced, BASE, 1200);

const allVisible = await reduced.evaluate(() =>
  [...document.querySelectorAll(".reveal, .hero-in")]
    .filter((el) => Number.parseFloat(getComputedStyle(el).opacity) < 0.99)
    .map((el) => el.textContent.trim().slice(0, 40)),
);
check(allVisible.length === 0, `nothing is hidden with reduced motion${allVisible.length ? `: ${allVisible.join(" | ")}` : ""}`);
check(
  (await reduced.locator("video").count()) === 0,
  "hero video is replaced by a still under reduced motion",
);

const stillParallax = await reduced.evaluate(async () => {
  const layer = document.querySelector(".parallax-layer");
  const before = getComputedStyle(layer).transform;
  window.scrollTo(0, window.innerHeight);
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  const after = getComputedStyle(layer).transform;
  return before === after;
});
check(stillParallax, "parallax is inert with reduced motion");

await browser.close();

console.log("");
console.log(problems.length ? `${problems.length} failure(s).` : "Motion pass behaves correctly.");
process.exitCode = problems.length ? 1 : 0;
