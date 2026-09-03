/**
 * Names whatever is causing horizontal scroll on a route.
 *
 * The sweep in shots.mjs only reports elements whose *box* sticks out, which
 * misses overflow produced by a child that its parent does not contain. This
 * walks every node, including SVG content, and reports the widest offenders
 * with their ancestry.
 *
 *   node tools/qa/overflow.mjs <url> [width]
 */
import { chromium } from "playwright";

import { open } from "./open.mjs";

const url = process.argv[2];
const width = Number(process.argv[3] ?? 375);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height: 812 } });
await open(page, url);

const report = await page.evaluate(() => {
  const doc = document.documentElement;
  const limit = doc.clientWidth;

  const describe = (el) => {
    const name = el.tagName.toLowerCase();
    const cls = String(el.getAttribute("class") ?? "").slice(0, 60);
    return cls ? `${name}.${cls}` : name;
  };

  const offenders = [];
  for (const el of document.querySelectorAll("*")) {
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) continue;
    if (rect.right <= limit + 1) continue;

    const trail = [];
    for (let p = el.parentElement; p && trail.length < 4; p = p.parentElement) trail.push(describe(p));

    offenders.push({
      el: describe(el),
      right: Math.round(rect.right),
      text: (el.textContent ?? "").trim().slice(0, 30),
      trail: trail.join(" < "),
    });
  }

  return {
    scrollWidth: doc.scrollWidth,
    clientWidth: limit,
    offenders: offenders.sort((a, b) => b.right - a.right).slice(0, 12),
  };
});

console.log(`${url} @ ${width}px — scrollWidth ${report.scrollWidth} vs client ${report.clientWidth}`);
for (const o of report.offenders) {
  console.log(`  right ${o.right}  ${o.el}${o.text ? `  "${o.text}"` : ""}`);
  console.log(`      in ${o.trail}`);
}
if (!report.offenders.length) console.log("  no element extends past the viewport");

// A transformed or clipped descendant can widen the document without its own
// box sticking out, so fall back to hiding one block at a time to find it.
if (report.scrollWidth > report.clientWidth && !report.offenders.length) {
  const blame = await page.evaluate(() => {
    const doc = document.documentElement;
    const baseline = doc.scrollWidth;
    const found = [];

    const probe = (el) => {
      const previous = el.style.display;
      el.style.display = "none";
      const shrank = doc.scrollWidth < baseline;
      el.style.display = previous;
      return shrank;
    };

    let scope = [...document.body.children];
    let guard = 0;
    while (scope.length && guard++ < 12) {
      const culprit = scope.find((el) => el instanceof HTMLElement && probe(el));
      if (!culprit) break;
      const cls = String(culprit.getAttribute("class") ?? "").slice(0, 70);
      found.push(`${culprit.tagName.toLowerCase()}${cls ? `.${cls}` : ""}`);
      scope = [...culprit.children];
    }

    return found;
  });

  console.log("\n  narrowed to:");
  blame.forEach((step, i) => console.log(`    ${"  ".repeat(i)}${step}`));
}

await browser.close();
