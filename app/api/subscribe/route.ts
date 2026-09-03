import { NextResponse } from "next/server";

import { DeliveryNotConfiguredError, deliverLead } from "@/lib/server/deliver";
import { clientKey, rateLimit } from "@/lib/server/rate-limit";

const LIMIT = 8;
const WINDOW_MS = 10 * 60 * 1000;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const HONEYPOT = "company_website";

/**
 * Insights / research update subscribe. Email only — no public inbox in markup.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  if (typeof body[HONEYPOT] === "string" && body[HONEYPOT].trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const limit = rateLimit(clientKey(request.headers, "subscribe"), LIMIT, WINDOW_MS);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429, headers: { "retry-after": String(limit.retryAfter) } },
    );
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const source = typeof body.source === "string" ? body.source.trim() : "insights";

  if (!email || !EMAIL.test(email) || email.length > 200) {
    return NextResponse.json({ error: "Please enter a valid work email." }, { status: 422 });
  }

  try {
    await deliverLead({
      kind: "subscribe",
      submittedAt: new Date().toISOString(),
      fields: { email, source },
    });
  } catch (error) {
    if (error instanceof DeliveryNotConfiguredError) {
      return NextResponse.json(
        { error: "Subscriptions are not configured yet. Please try again later." },
        { status: 503 },
      );
    }
    console.error("[subscribe] delivery failed", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
