import { randomBytes } from "crypto";

import { NextResponse } from "next/server";
import sharp from "sharp";

import { isAuthenticated } from "@/lib/cms/auth";
import { patchOverrides, putUpload } from "@/lib/cms/store";

export const runtime = "nodejs";

const MAX_BYTES = 12 * 1024 * 1024;

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData().catch(() => null);
  if (!form) {
    return NextResponse.json({ error: "Expected multipart form data." }, { status: 400 });
  }

  const key = String(form.get("key") ?? "").trim();
  const file = form.get("file");
  if (!key) {
    return NextResponse.json({ error: "Missing image key." }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File is too large (max 12MB)." }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const id = randomBytes(6).toString("hex");
  const filename = `${key.replace(/[^a-z0-9-_]/gi, "-")}-${id}.webp`;

  const pipeline = sharp(bytes).rotate().resize({
    width: 2400,
    height: 2400,
    fit: "inside",
    withoutEnlargement: true,
  });
  const { data, info } = await pipeline.webp({ quality: 82 }).toBuffer({ resolveWithObject: true });

  let src: string;
  try {
    src = await putUpload(filename, data, "image/webp");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed.";
    return NextResponse.json({ error: message }, { status: 503 });
  }

  const asset = {
    src,
    width: info.width,
    height: info.height,
  };

  try {
    await patchOverrides({ images: { [key]: asset } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed.";
    return NextResponse.json({ error: message }, { status: 503 });
  }
  const { revalidatePath } = await import("next/cache");
  revalidatePath("/", "layout");

  return NextResponse.json({ ok: true, key, asset });
}
