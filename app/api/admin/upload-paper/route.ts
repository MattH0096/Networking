import { randomBytes } from "crypto";

import { NextResponse } from "next/server";

import { isAuthenticated } from "@/lib/cms/auth";
import { putPrivatePaper } from "@/lib/cms/store";

export const runtime = "nodejs";

const MAX_BYTES = 25 * 1024 * 1024;

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData().catch(() => null);
  if (!form) {
    return NextResponse.json({ error: "Expected multipart form data." }, { status: 400 });
  }

  const slug = String(form.get("slug") ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const file = form.get("file");
  const downloadAsRaw = String(form.get("downloadAs") ?? "").trim();

  if (!slug) {
    return NextResponse.json({ error: "Missing paper slug." }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing PDF file." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "PDF is too large (max 25MB)." }, { status: 400 });
  }

  const type = (file.type || "").toLowerCase();
  const name = file.name || "";
  if (type && type !== "application/pdf" && !name.toLowerCase().endsWith(".pdf")) {
    return NextResponse.json({ error: "Only PDF files are accepted." }, { status: 400 });
  }
  if (!name.toLowerCase().endsWith(".pdf") && type !== "application/pdf") {
    return NextResponse.json({ error: "Only PDF files are accepted." }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  // Basic PDF magic check
  if (bytes.byteLength < 5 || bytes.subarray(0, 5).toString("utf8") !== "%PDF-") {
    return NextResponse.json({ error: "That file does not look like a PDF." }, { status: 400 });
  }

  const id = randomBytes(4).toString("hex");
  const filename = `${slug}-${id}.pdf`;
  const originalBase = name.replace(/[/\\]/g, "").replace(/\.pdf$/i, "") || slug;
  const downloadAs = (downloadAsRaw || `${originalBase}.pdf`).replace(/[/\\?%*:|"<>]/g, "-");
  const downloadName = downloadAs.toLowerCase().endsWith(".pdf")
    ? downloadAs
    : `${downloadAs}.pdf`;

  let pdfStorageKey: string;
  try {
    pdfStorageKey = await putPrivatePaper(filename, bytes);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed.";
    return NextResponse.json({ error: message }, { status: 503 });
  }

  return NextResponse.json({
    ok: true,
    slug,
    pdfStorageKey,
    downloadAs: downloadName,
  });
}
