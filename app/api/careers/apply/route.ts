import { randomBytes } from "crypto";
import { promises as fs } from "fs";
import path from "path";

import { NextResponse } from "next/server";

import {
  APPLY_FILE,
  EMPTY_APPLY,
  HONEYPOT_FIELD,
  fileExtension,
  isValidApply,
  validateApplyFile,
  validateCareersApply,
  type CareersApplyValues,
} from "@/lib/forms/careers-apply-schema";
import { DeliveryNotConfiguredError, deliverLead } from "@/lib/server/deliver";
import { clientKey, rateLimit } from "@/lib/server/rate-limit";

export const runtime = "nodejs";

const LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;

function readString(form: FormData, key: string): string {
  const value = form.get(key);
  return typeof value === "string" ? value : "";
}

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  if (readString(form, HONEYPOT_FIELD).trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const limit = rateLimit(clientKey(request.headers, "careers-apply"), LIMIT, WINDOW_MS);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many applications from this address. Please try again shortly." },
      { status: 429, headers: { "retry-after": String(limit.retryAfter) } },
    );
  }

  const values: CareersApplyValues = {
    ...EMPTY_APPLY,
    firstName: readString(form, "firstName"),
    lastName: readString(form, "lastName"),
    email: readString(form, "email"),
    newsletter: readString(form, "newsletter") === "true" || readString(form, "newsletter") === "on",
    subject: readString(form, "subject"),
    message: readString(form, "message"),
    roleSlug: readString(form, "roleSlug"),
    roleTitle: readString(form, "roleTitle"),
  };

  const errors = validateCareersApply(values);
  const fileEntry = form.get("file");
  const file = fileEntry instanceof File && fileEntry.size > 0 ? fileEntry : null;
  const fileError = validateApplyFile(file);
  if (fileError) errors.file = fileError;

  if (!isValidApply(errors)) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  let savedName = "";
  let attachment:
    | { filename: string; contentType: string; contentBase64: string }
    | undefined;

  if (file) {
    const ext = fileExtension(file.name) || "bin";
    const id = randomBytes(8).toString("hex");
    const safeBase = `${values.lastName}-${values.firstName}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40);
    savedName = `${Date.now()}-${safeBase || "applicant"}-${id}.${ext}`;
    const dir = path.join(process.cwd(), "private", "applications");
    await fs.mkdir(dir, { recursive: true });
    const bytes = Buffer.from(await file.arrayBuffer());
    if (bytes.byteLength > APPLY_FILE.maxBytes) {
      return NextResponse.json({ errors: { file: "File is too large (max 8MB)." } }, { status: 422 });
    }
    await fs.writeFile(path.join(dir, savedName), bytes);
    attachment = {
      filename: file.name.slice(0, 180) || savedName,
      contentType: file.type || "application/octet-stream",
      contentBase64: bytes.toString("base64"),
    };
  }

  try {
    await deliverLead({
      kind: "careers",
      submittedAt: new Date().toISOString(),
      fields: {
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim(),
        newsletter: values.newsletter ? "yes" : "no",
        subject: values.subject.trim(),
        message: values.message.trim(),
        roleSlug: values.roleSlug.trim(),
        roleTitle: values.roleTitle.trim() || values.subject.trim(),
        attachmentSavedAs: savedName,
      },
      attachments: attachment ? [attachment] : undefined,
    });

    if (values.newsletter) {
      await deliverLead({
        kind: "subscribe",
        submittedAt: new Date().toISOString(),
        fields: {
          email: values.email.trim(),
          source: "careers-apply",
        },
      }).catch((err) => {
        console.warn("[careers-apply] newsletter subscribe delivery failed", err);
      });
    }
  } catch (error) {
    const unconfigured = error instanceof DeliveryNotConfiguredError;
    console.error("[careers-apply] delivery failed", error);
    return NextResponse.json(
      {
        error: unconfigured
          ? "Our application system is not accepting messages right now. Please try again later."
          : "We could not send your application. Please try again.",
      },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true });
}
