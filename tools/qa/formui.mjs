/**
 * Drives the contact form the way a person does.
 *
 * The endpoint tests in forms.mjs prove the server is sound; these prove the
 * visitor is told what went wrong, can fix it, and gets a real confirmation.
 * Point this at a server started with LEAD_WEBHOOK_URL set, or submission will
 * correctly fail with a 503.
 *
 *   node tools/qa/formui.mjs [baseUrl]
 */
import { createServer } from "node:http";

import { chromium } from "playwright";

import { open } from "./open.mjs";

const BASE = process.argv.find((a) => a.startsWith("http")) ?? "http://localhost:3000";

/** Stands in for the lead webhook so a submission can actually succeed. */
const receiver = createServer((req, res) => {
  req.resume();
  req.on("end", () => {
    res.writeHead(200, { "content-type": "application/json" });
    res.end("{}");
  });
});
await new Promise((resolve) => receiver.listen(3799, resolve));

const problems = [];
const check = (ok, message) => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${message}`);
  if (!ok) problems.push(message);
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await open(page, `${BASE}/contact`);

const form = page.locator("form").first();

// ---- Empty submission ------------------------------------------------------
await form.getByRole("button", { name: /send message/i }).click();

const alerts = await page.locator("[role=alert]").allTextContents();
const shown = alerts.filter((text) => text.trim());
check(shown.length >= 4, `an empty submission reports every problem (${shown.length})`);

const focused = await page.evaluate(() => document.activeElement?.getAttribute("name"));
check(focused === "fullName", `focus moves to the first field needing attention (${focused})`);

check(
  await page.locator("[name=fullName][aria-invalid=true]").count() === 1,
  "invalid fields are marked aria-invalid",
);

// ---- The honeypot must be invisible to people ------------------------------
const honeypot = page.locator("[name=company_website]");
check(await honeypot.count() === 1, "the honeypot field is present");
check(
  await honeypot.evaluate((el) => el.tabIndex === -1),
  "the honeypot is outside the tab order",
);
check(
  await honeypot.evaluate((el) => el.closest("[aria-hidden=true]") !== null),
  "the honeypot is hidden from assistive technology",
);
// Positioned off-screen rather than display:none, which is the point — bots
// that skip hidden inputs still fill this one. So assert it is off the canvas,
// not that the browser calls it invisible.
const box = await honeypot.boundingBox();
check(
  box !== null && box.x + box.width < 0,
  `the honeypot sits outside the viewport (x ${Math.round(box?.x ?? 0)})`,
);

// ---- Bad email, then corrected ---------------------------------------------
await form.getByLabel(/full name/i).fill("Dana Reyes");
await form.getByLabel(/work email/i).fill("nope");
await form.getByLabel(/message/i).fill("We run a dispersed sensor network and want to talk.");
await form.getByRole("button", { name: /send message/i }).click();

check(
  (await page.locator("[role=alert]").allTextContents()).some((t) => /email/i.test(t)),
  "a malformed email is reported",
);

await form.getByLabel(/work email/i).fill("dana@example.com");
check(
  (await page.locator("[name=workEmail]").getAttribute("aria-invalid")) !== "true",
  "the error clears as soon as the field is corrected",
);

// ---- Complete and submit ---------------------------------------------------
await form.getByLabel(/company or organization/i).fill("Example Systems");
await form.getByLabel(/interested in/i).selectOption("Locus");
await form.getByRole("button", { name: /send message/i }).click();

const confirmation = page.getByText(/message received/i);
const arrived = await confirmation
  .waitFor({ state: "visible", timeout: 8000 })
  .then(() => true, () => false);

if (!arrived) {
  const shownError = (await page.locator("[role=alert]").allTextContents())
    .map((t) => t.trim())
    .filter(Boolean)
    .join(" | ");
  console.log(`      form reported: ${shownError || "(nothing)"}`);
}
check(arrived, "a successful submission shows a real confirmation");

if (arrived) {
  const movedTo = await page.evaluate(() => document.activeElement?.textContent?.slice(0, 30) ?? "");
  check(/message received/i.test(movedTo), `focus moves to the confirmation (got "${movedTo.trim()}")`);
  check(!(await form.isVisible().catch(() => false)), "the form is replaced, not left alongside");
}

await browser.close();
receiver.close();

console.log("");
console.log(problems.length ? `${problems.length} failure(s).` : "Contact form behaves correctly.");
process.exitCode = problems.length ? 1 : 0;
