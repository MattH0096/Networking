import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });

const btn = page.locator('header a[href="/#how-it-works"]');
await btn.waitFor();

const info = await btn.evaluate((el) => {
  const s = getComputedStyle(el);
  const label = el.querySelector(".btn__label");
  const arrow = el.querySelector(".btn__arrow");
  const lr = label?.getBoundingClientRect();
  const ar = arrow?.getBoundingClientRect();
  return {
    width: s.width,
    maxWidth: s.maxWidth,
    gap: s.gap,
    padding: s.padding,
    overflow: s.overflow,
    labelRight: lr?.right,
    arrowLeft: ar?.left,
    overlap: lr && ar ? lr.right - ar.left : null,
    text: label?.textContent,
    html: el.outerHTML,
  };
});

console.log(JSON.stringify(info, null, 2));
await btn.screenshot({ path: "tools/_qa-nav-cta.png" });
await page.locator("header").screenshot({ path: "tools/_qa-nav-full.png" });
await browser.close();
