/**
 * Scrolls a page top to bottom and back so every scroll-reveal fires.
 *
 * Uses real wheel input rather than `window.scrollTo`: `scroll-behavior: smooth`
 * animates programmatic scrolls and starves the IntersectionObserver, and
 * overriding it inline mutates the DOM before React has hydrated, which shows up
 * as a hydration mismatch that belongs to the harness rather than the site.
 */
export async function sweep(page) {
  const height = await page.evaluate(() => window.innerHeight);
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  const step = Math.round(height / 2);

  for (let y = 0; y < total; y += step) {
    await page.mouse.wheel(0, step);
    await page.waitForTimeout(120);
  }

  for (let y = 0; y < total; y += step) {
    await page.mouse.wheel(0, -step);
    await page.waitForTimeout(20);
  }

  await page.waitForTimeout(600);
}
