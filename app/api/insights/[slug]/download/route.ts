import { NextResponse } from "next/server";

import { getSiteContent } from "@/lib/cms/content";
import { DeliveryNotConfiguredError, deliverLead } from "@/lib/server/deliver";
import { loadPaper, paperExists } from "@/lib/server/papers";
import { clientKey, rateLimit } from "@/lib/server/rate-limit";

const LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const HONEYPOT = "company_website";

type Errors = { name?: string; email?: string; consent?: string; company?: string; jobTitle?: string };

/**
 * The gate. The paper is streamed from outside the public directory only after
 * a valid submission, so the file's location is never exposed and a download URL
 * cannot be shared to bypass the form.
 */
export async function POST(request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const content = await getSiteContent();
  const listed = content.insights.papers.some((paper) => paper.slug === slug && paper.gated);

  if (!listed || !paperExists(slug)) {
    return NextResponse.json({ error: "Unknown paper." }, { status: 404 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  if (typeof body[HONEYPOT] === "string" && body[HONEYPOT].trim() !== "") {
    return NextResponse.json({ error: "Unknown paper." }, { status: 404 });
  }

  const limit = rateLimit(clientKey(request.headers, `paper:${slug}`), LIMIT, WINDOW_MS);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429, headers: { "retry-after": String(limit.retryAfter) } },
    );
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const company = typeof body.company === "string" ? body.company.trim() : "";
  const jobTitle = typeof body.jobTitle === "string" ? body.jobTitle.trim() : "";
  const consent = body.consent === true;

  const errors: Errors = {};
  if (name.length < 2) errors.name = "Please enter your name.";
  else if (name.length > 100) errors.name = "That name is too long.";
  if (!email) errors.email = "Please enter your email.";
  else if (!EMAIL.test(email)) errors.email = "That does not look like an email address.";
  else if (email.length > 200) errors.email = "That address is too long.";
  if (!consent) errors.consent = "Please confirm you agree to be contacted.";
  if (company.length > 150) errors.company = "That company name is too long.";
  if (jobTitle.length > 100) errors.jobTitle = "That title is too long.";

  if (Object.keys(errors).length) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  const paper = await loadPaper(slug);
  if (!paper) {
    // The paper is listed but the file has not been supplied yet. Say so plainly
    // instead of serving an empty or broken download.
    return NextResponse.json(
      { error: "This paper is not available for download yet. Please check back shortly." },
      { status: 503 },
    );
  }

  // Record the lead, but never at the cost of the download the visitor was
  // promised — a webhook outage is our problem, not theirs.
  try {
    await deliverLead({
      kind: "whitepaper",
      submittedAt: new Date().toISOString(),
      fields: {
        name,
        email,
        ...(company ? { company } : {}),
        ...(jobTitle ? { jobTitle } : {}),
        paper: slug,
      },
    });
  } catch (error) {
    if (!(error instanceof DeliveryNotConfiguredError)) {
      console.error("[insights] lead capture failed", error);
    }
  }

  return new NextResponse(new Uint8Array(paper.bytes), {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `attachment; filename="${paper.downloadAs}"`,
      "content-length": String(paper.bytes.byteLength),
      // A gated asset must never be cached by a shared proxy.
      "cache-control": "private, no-store",
    },
  });
}
