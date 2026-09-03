import { NextResponse } from "next/server";

import {
  EMPTY_CONTACT,
  HONEYPOT_FIELD,
  isValid,
  validateContact,
  type ContactValues,
} from "@/lib/forms/contact-schema";
import { DeliveryNotConfiguredError, deliverLead } from "@/lib/server/deliver";
import { clientKey, rateLimit } from "@/lib/server/rate-limit";

/** Five submissions per ten minutes is generous for a human, tedious for a script. */
const LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;

function readValues(body: Record<string, unknown>): ContactValues {
  const read = (key: keyof ContactValues) =>
    typeof body[key] === "string" ? (body[key] as string) : "";

  return {
    ...EMPTY_CONTACT,
    fullName: read("fullName"),
    workEmail: read("workEmail"),
    organization: read("organization"),
    interest: read("interest"),
    message: read("message"),
  };
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  // Honeypot first: a bot that filled it gets a plausible success and no
  // delivery, which is cheaper than arguing with it.
  if (typeof body[HONEYPOT_FIELD] === "string" && body[HONEYPOT_FIELD].trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const limit = rateLimit(clientKey(request.headers, "contact"), LIMIT, WINDOW_MS);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many messages from this address. Please try again shortly." },
      { status: 429, headers: { "retry-after": String(limit.retryAfter) } },
    );
  }

  const values = readValues(body);
  const errors = validateContact(values);
  if (!isValid(errors)) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  try {
    await deliverLead({
      kind: "contact",
      submittedAt: new Date().toISOString(),
      fields: {
        fullName: values.fullName.trim(),
        workEmail: values.workEmail.trim(),
        organization: values.organization.trim(),
        interest: values.interest,
        message: values.message.trim(),
      },
    });
  } catch (error) {
    const unconfigured = error instanceof DeliveryNotConfiguredError;
    console.error("[contact] delivery failed", error);

    return NextResponse.json(
      {
        error: unconfigured
          ? "Our contact system is not accepting messages right now. Please try again later."
          : "We could not send your message. Please try again.",
      },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true });
}
