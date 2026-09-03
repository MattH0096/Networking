/**
 * Exercises the contact and gated-download endpoints directly.
 *
 * Forms are the one place on this site where a bug loses a real enquiry, so
 * these hit the routes rather than the UI: validation, the honeypot, the rate
 * limiter and the gate all have to hold regardless of what the browser sent.
 *
 *   node tools/qa/forms.mjs [baseUrl]
 */
import { createServer } from "node:http";

const BASE = process.argv.find((a) => a.startsWith("http")) ?? "http://localhost:3000";

/**
 * With --receive, listen on RECEIVER_PORT and assert that a delivered lead
 * actually arrives. Start the site with LEAD_WEBHOOK_URL pointed here to prove
 * the whole path; without it, an accepted message is only accepted locally.
 */
const RECEIVE = process.argv.includes("--receive");
const RECEIVER_PORT = 3799;

const received = [];
const receiver = RECEIVE
  ? createServer((req, res) => {
      let raw = "";
      req.on("data", (chunk) => (raw += chunk));
      req.on("end", () => {
        try {
          received.push(JSON.parse(raw));
        } catch {
          received.push({ unparseable: raw });
        }
        res.writeHead(200, { "content-type": "application/json" });
        res.end("{}");
      });
    })
  : null;

if (receiver) {
  await new Promise((resolve) => receiver.listen(RECEIVER_PORT, resolve));
  console.log(`listening for delivered leads on :${RECEIVER_PORT}\n`);
}

const problems = [];
const check = (ok, message) => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${message}`);
  if (!ok) problems.push(message);
};

const post = (path, body) =>
  fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": randomIp() },
    body: JSON.stringify(body),
  });

/** A fresh address per case so the rate limiter doesn't colour other results. */
function randomIp() {
  const octet = () => Math.floor(Math.random() * 254) + 1;
  return `${octet()}.${octet()}.${octet()}.${octet()}`;
}

const validContact = {
  fullName: "Dana Reyes",
  workEmail: "dana@example.com",
  organization: "Example Systems",
  interest: "Locus",
  message: "We operate a dispersed sensor network and would like to discuss distribution.",
};

// ---- Contact: validation ---------------------------------------------------
{
  const res = await post("/api/contact", { ...validContact, workEmail: "not-an-email" });
  const body = await res.json();
  check(res.status === 422, `bad email is rejected (${res.status})`);
  check(Boolean(body.errors?.workEmail), "the rejection names the email field");
}

{
  const res = await post("/api/contact", { ...validContact, message: "short" });
  check(res.status === 422, `a too-short message is rejected (${res.status})`);
}

{
  const res = await post("/api/contact", { ...validContact, interest: "Espionage" });
  check(res.status === 422, `an off-list interest is rejected (${res.status})`);
}

{
  const res = await post("/api/contact", {});
  const body = await res.json();
  check(res.status === 422, `an empty submission is rejected (${res.status})`);
  check(
    Object.keys(body.errors ?? {}).length >= 4,
    `every missing field is reported (${Object.keys(body.errors ?? {}).length})`,
  );
}

// ---- Contact: happy path and honeypot --------------------------------------
{
  const res = await post("/api/contact", validContact);

  if (RECEIVE) {
    check(res.status === 200, `a valid message is accepted (${res.status})`);

    const lead = received.find((entry) => entry.kind === "contact");
    check(Boolean(lead), "the message was delivered to the configured webhook");
    check(
      lead?.fields?.workEmail === validContact.workEmail &&
        lead?.fields?.message === validContact.message,
      "the delivered payload carries the submitted values",
    );
    check(Boolean(lead?.submittedAt), "the delivered payload is timestamped");
  } else {
    // No webhook configured. In production that is a deliberate 503 — refusing
    // a message is better than accepting one nobody will ever read.
    const body = await res.json().catch(() => ({}));
    check(
      res.status === 200 || res.status === 503,
      `a valid message is accepted or honestly refused (${res.status})`,
    );
    if (res.status === 503) {
      check(Boolean(body.error), "the refusal explains itself to the sender");
      console.log("      (no LEAD_WEBHOOK_URL set — rerun with --receive to test delivery)");
    }
  }
}

{
  const before = received.length;
  const res = await post("/api/contact", { ...validContact, company_website: "http://spam.example" });
  check(res.status === 200, `a honeypot hit is answered plausibly (${res.status})`);

  if (RECEIVE) {
    // Give any (incorrect) delivery a chance to land before declaring it didn't.
    await new Promise((r) => setTimeout(r, 300));
    check(received.length === before, "a honeypot hit is never delivered");
  }
}

// ---- Contact: rate limiting ------------------------------------------------
{
  const ip = randomIp();
  const send = () =>
    fetch(`${BASE}/api/contact`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": ip },
      body: JSON.stringify(validContact),
    });

  let blockedAt = 0;
  for (let i = 1; i <= 8; i += 1) {
    const res = await send();
    if (res.status === 429) {
      blockedAt = i;
      check(Boolean(res.headers.get("retry-after")), "the 429 carries a retry-after header");
      break;
    }
  }
  check(blockedAt > 0 && blockedAt <= 7, `repeat submissions are throttled (at request ${blockedAt})`);
}

// ---- Gated paper -----------------------------------------------------------
{
  const res = await post("/api/insights/distribution-completeness/download", {
    name: "D",
    email: "nope",
  });
  const body = await res.json();
  check(res.status === 422, `the gate rejects an invalid request (${res.status})`);
  check(Boolean(body.errors?.name && body.errors?.email), "the gate names both bad fields");
}

{
  const res = await post("/api/insights/made-up-paper/download", {
    name: "Dana Reyes",
    email: "dana@example.com",
  });
  check(res.status === 404, `an unknown paper slug is refused (${res.status})`);
}

{
  const res = await post("/api/insights/distribution-completeness/download", {
    name: "Dana Reyes",
    email: "dana@example.com",
  });
  const type = res.headers.get("content-type") ?? "";

  if (res.status === 200) {
    check(type.includes("application/pdf"), `a passed gate returns a PDF (${type})`);
    check(
      (res.headers.get("cache-control") ?? "").includes("no-store"),
      "the gated file is not cacheable",
    );
  } else {
    // Expected until the PDF is supplied — the point is that it fails honestly.
    check(res.status === 503, `missing paper fails honestly rather than serving junk (${res.status})`);
    check(type.includes("application/json"), "the failure is a readable message, not a broken file");
  }
}

// ---- The file must not be reachable without the gate -----------------------
for (const path of [
  "/private/papers/distribution-completeness-in-dynamic-mesh-networks.pdf",
  "/papers/distribution-completeness-in-dynamic-mesh-networks.pdf",
  "/api/insights/distribution-completeness/download",
]) {
  const res = await fetch(`${BASE}${path}`);
  check(res.status !== 200, `GET ${path} does not serve the file (${res.status})`);
}

receiver?.close();

console.log("");
console.log(problems.length ? `${problems.length} failure(s).` : "Form endpoints behave correctly.");
process.exitCode = problems.length ? 1 : 0;
