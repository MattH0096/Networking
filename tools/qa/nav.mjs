/**
 * Behavioural checks for the mobile nav overlay.
 *
 * The overlay once collapsed to zero height because the header's backdrop-filter
 * made itself the containing block for a fixed child — visually a blank page, but
 * invisible to screenshots and to any check that only asks whether the element
 * exists. These assertions measure it instead.
 *
 *   node tools/qa/nav.mjs [baseUrl]
 */
import { chromium } from "playwright";

import { open } from "./open.mjs";

const BASE = process.argv.find((a) => a.startsWith("http")) ?? "http://localhost:3000";

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 375, height: 812 },
  isMobile: true,
  hasTouch: true,
});

const problems = [];
const check = (ok, message) => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${message}`);
  if (!ok) problems.push(message);
};

await open(page, BASE);

const overlay = page.locator("#mobile-nav");
check(await overlay.isHidden(), "overlay starts hidden");

await page.getByRole("button", { name: "Open menu" }).click();
await page.waitForTimeout(400);

const box = await overlay.boundingBox();
const viewport = page.viewportSize();
check(box !== null && box.height > viewport.height * 0.5, `overlay fills the viewport (height ${box?.height ?? 0} of ${viewport.height})`);
check(box !== null && Math.round(box.width) === viewport.width, `overlay spans the full width (${box?.width ?? 0})`);

// The overlay must actually be what the user sees at its centre, not a
// transparent layer over the page beneath.
const onTop = await page.evaluate(() => {
  const el = document.getElementById("mobile-nav");
  const r = el.getBoundingClientRect();
  const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
  return el.contains(hit);
});
check(onTop, "overlay is the topmost element at its centre");

const opaque = await page.evaluate(() => {
  const s = getComputedStyle(document.getElementById("mobile-nav"));
  return s.backgroundColor === "rgb(26, 26, 26)";
});
check(opaque, "overlay paints --ist-surface-raised");

const links = await overlay.locator("a").count();
check(links >= 10, `every nav destination is reachable (${links} links)`);

const locked = await page.evaluate(() => getComputedStyle(document.body).overflow === "hidden");
check(locked, "page behind the overlay is scroll-locked");

// Tap targets: §8 requires everything comfortably tappable.
const small = await overlay.evaluate((el) =>
  [...el.querySelectorAll("a")]
    .map((a) => ({ label: a.textContent.trim(), h: a.getBoundingClientRect().height }))
    .filter((a) => a.h < 44)
    .map((a) => `${a.label} (${Math.round(a.h)}px)`),
);
check(small.length === 0, `all overlay links are ≥44px tall${small.length ? ` — ${small.join(", ")}` : ""}`);

await page.keyboard.press("Escape");
await page.waitForTimeout(400);
check(await overlay.isHidden(), "Escape closes the overlay");

const unlocked = await page.evaluate(() => getComputedStyle(document.body).overflow !== "hidden");
check(unlocked, "scroll lock is released on close");

await browser.close();

console.log("");
if (problems.length) {
  console.log(`${problems.length} failure(s).`);
  process.exitCode = 1;
} else {
  console.log("Mobile nav overlay behaves correctly.");
}
