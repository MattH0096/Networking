/**
 * Visual QA: screenshots each route at desktop and mobile widths and reports
 * any console error or failed request the page produced along the way.
 *
 *   node tools/qa/shots.mjs [baseUrl] [--full]
 */
import { mkdir, rm } from "node:fs/promises";
import path from "node:path";

import { chromium } from "playwright";

import { open } from "./open.mjs";
import { builtRoutes } from "./routes.mjs";
import { sweep } from "./scroll.mjs";

const BASE = process.argv.find((a) => a.startsWith("http")) ?? "http://localhost:3000";
const FULL = process.argv.includes("--full");
const OUT = "tools/_shots";

const ROUTES = [
  ["home", "/"],
  ["solutions", "/solutions"],
  ["locus", "/locus"],
  ["crucible", "/crucible"],
  ["applications", "/applications"],
  ["about", "/about"],
  ["insights", "/insights"],
  ["news", "/news"],
  ["careers", "/careers"],
  ["contact", "/contact"],
  ["tokens", "/tokens"],
];

/** 320 / 375 / 768 are the breakpoints §8 requires verifying line by line. */
const VIEWPORTS = [
  ["desktop", { width: 1440, height: 900 }],
  ["tablet", { width: 768, height: 1024 }],
  ["mobile-375", { width: 375, height: 812 }],
  ["mobile-320", { width: 320, height: 640 }],
];

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

const built = await builtRoutes();
const browser = await chromium.launch();
const problems = [];
/** Prefetches of pages scheduled for a later stage. Counted, not failed. */
const pendingPages = new Set();

function note(tag, status, url) {
  const { pathname } = new URL(url);
  if (status === 404 && !built.has(pathname)) {
    pendingPages.add(pathname);
    return;
  }
  problems.push(`${tag}: ${status} ${url}`);
}

for (const [vpName, viewport] of VIEWPORTS) {
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: 2,
    isMobile: vpName === "mobile",
    hasTouch: vpName === "mobile",
  });

  for (const [name, route] of ROUTES) {
    const page = await context.newPage();
    const tag = `${name} @ ${vpName}`;

    page.on("console", (msg) => {
      // A failed prefetch also logs a bare "Failed to load resource"; the
      // response handler already classifies it, so this would only duplicate.
      if (msg.type() === "error" && !msg.text().startsWith("Failed to load resource")) {
        problems.push(`${tag}: console ${msg.text()}`);
      }
    });
    page.on("pageerror", (err) => problems.push(`${tag}: pageerror ${err.message}`));
    page.on("requestfailed", (req) =>
      problems.push(`${tag}: request failed ${req.url()} (${req.failure()?.errorText})`),
    );
    page.on("response", (res) => {
      if (res.status() >= 400) note(tag, res.status(), res.url());
    });

    await open(page, `${BASE}${route}`);
    await sweep(page);

    // §8: zero horizontal scroll. `overflow-x: hidden` on the body would hide a
    // real overflow from scrollWidth, so lift it for the duration of the check
    // and name whatever is sticking out.
    const overflow = await page.evaluate(() => {
      const previous = document.body.style.overflowX;
      document.body.style.overflowX = "visible";

      const doc = document.documentElement;
      const result =
        doc.scrollWidth <= doc.clientWidth
          ? null
          : {
              scrollWidth: doc.scrollWidth,
              clientWidth: doc.clientWidth,
              culprits: [...document.querySelectorAll("body *")]
                .filter((el) => el.getBoundingClientRect().right > doc.clientWidth + 1)
                .slice(0, 5)
                .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 70)}`),
            };

      document.body.style.overflowX = previous;
      return result;
    });
    if (overflow) {
      problems.push(
        `${tag}: horizontal scroll ${overflow.scrollWidth}px > ${overflow.clientWidth}px — ${overflow.culprits.join(", ")}`,
      );
    }

    const file = path.join(OUT, `${name}-${vpName}.png`);
    await page.screenshot({ path: file, fullPage: FULL });
    console.log(`  ${file}`);
    await page.close();
  }

  await context.close();
}

await browser.close();

if (pendingPages.size) {
  console.log(`\nLinked but not built yet (${pendingPages.size}): ${[...pendingPages].sort().join(", ")}`);
}

if (problems.length) {
  console.log(`\n${problems.length} problem(s):`);
  for (const p of [...new Set(problems)]) console.log(`  - ${p}`);
  process.exitCode = 1;
} else {
  console.log("\nNo console errors, failed requests, or horizontal overflow.");
}
