/**
 * Structural accessibility checks that don't need a human eye: one h1, no
 * skipped heading levels, landmarks present, every image with alt text, every
 * control with an accessible name, and a visible focus ring.
 *
 *   node tools/qa/a11y.mjs [baseUrl] [route...]
 */
import { chromium } from "playwright";

import { open } from "./open.mjs";

const args = process.argv.slice(2);
const BASE = args.find((a) => a.startsWith("http")) ?? "http://localhost:3000";
const ROUTES = args.filter((a) => a.startsWith("/"));
const routes = ROUTES.length ? ROUTES : ["/"];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const problems = [];

for (const route of routes) {
  await open(page, `${BASE}${route}`);

  const report = await page.evaluate(() => {
    const out = { issues: [], headings: [] };

    const headings = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")];
    out.headings = headings.map((h) => `${h.tagName} ${h.textContent.trim().slice(0, 44)}`);

    const h1s = headings.filter((h) => h.tagName === "H1");
    if (h1s.length !== 1) out.issues.push(`expected exactly one h1, found ${h1s.length}`);

    let previous = 1;
    for (const h of headings) {
      const level = Number(h.tagName[1]);
      if (level > previous + 1) {
        out.issues.push(`heading level jumps ${previous} → ${level} at "${h.textContent.trim().slice(0, 40)}"`);
      }
      previous = level;
    }

    for (const role of ["banner", "main", "contentinfo"]) {
      const selector = { banner: "header", main: "main", contentinfo: "footer" }[role];
      if (!document.querySelector(`${selector}, [role="${role}"]`)) {
        out.issues.push(`missing ${role} landmark`);
      }
    }

    for (const el of document.querySelectorAll("img")) {
      if (el.getAttribute("alt") === null) out.issues.push(`img without alt: ${el.currentSrc || el.src}`);
    }

    for (const el of document.querySelectorAll("a, button")) {
      const name =
        el.getAttribute("aria-label")?.trim() ||
        el.textContent.trim() ||
        el.querySelector("img")?.getAttribute("alt")?.trim();
      if (!name) out.issues.push(`control without accessible name: ${el.outerHTML.slice(0, 90)}`);
    }

    for (const el of document.querySelectorAll("a[href]")) {
      const href = el.getAttribute("href");
      if (href.includes("{{TBD}}")) out.issues.push(`unresolved {{TBD}} href on "${el.textContent.trim()}"`);
      if (href.startsWith("mailto:")) out.issues.push(`mailto link present: ${href}`);
    }

    return out;
  });

  // A focus ring must actually be painted for keyboard users.
  await page.keyboard.press("Tab");
  const ring = await page.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return null;
    const s = getComputedStyle(el);
    return { outlineWidth: s.outlineWidth, outlineStyle: s.outlineStyle, outlineColor: s.outlineColor };
  });
  if (!ring || ring.outlineStyle === "none" || Number.parseFloat(ring.outlineWidth) < 2) {
    report.issues.push(`no visible focus ring on first tab stop (${JSON.stringify(ring)})`);
  }

  console.log(`\n${route} — ${report.headings.length} headings`);
  for (const h of report.headings) console.log(`  ${h}`);

  for (const issue of report.issues) problems.push(`${route}: ${issue}`);
}

await browser.close();

console.log("");
if (problems.length) {
  console.log(`${problems.length} issue(s):`);
  for (const p of problems) console.log(`  - ${p}`);
  process.exitCode = 1;
} else {
  console.log("No structural accessibility issues found.");
}
