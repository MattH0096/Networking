import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { isAuthenticated } from "@/lib/cms/auth";
import { getSiteContent } from "@/lib/cms/content";
import { patchOverrides, readOverrides } from "@/lib/cms/store";
import type { SiteOverrides } from "@/lib/cms/types";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const overrides = await readOverrides();
  const content = await getSiteContent();
  return NextResponse.json({ overrides, content });
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as SiteOverrides | null;
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  try {
    const saved = await patchOverrides(body);
    revalidatePath("/", "layout");
    revalidatePath("/careers");
    revalidatePath("/careers", "layout");
    revalidatePath("/news");
    revalidatePath("/news", "layout");
    revalidatePath("/insights");
    revalidatePath("/contact");
    revalidatePath("/about");
    revalidatePath("/solutions");
    revalidatePath("/locus");
    revalidatePath("/crucible");
    revalidatePath("/");
    const content = await getSiteContent();
    return NextResponse.json({ ok: true, overrides: saved, content });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Save failed.";
    console.error("[admin/content] save failed", error);
    return NextResponse.json({ error: message }, { status: 503 });
  }
}
