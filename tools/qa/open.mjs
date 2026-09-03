/**
 * Opens a page for QA.
 *
 * Waits for `load` rather than `networkidle`: the nav prefetches routes that do
 * not exist yet, so those requests never settle and `networkidle` would never
 * fire. A short settle covers font swap and above-the-fold images.
 */
export async function open(page, url, settle = 700) {
  await page.goto(url, { waitUntil: "load" });
  await page.waitForTimeout(settle);
}
