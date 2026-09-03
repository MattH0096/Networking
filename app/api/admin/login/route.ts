import { NextResponse } from "next/server";

import {
  isAdminConfigured,
  verifyPassword,
  withSessionCookie,
} from "@/lib/cms/auth";

export async function POST(request: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: "Set ADMIN_PASSWORD (8+ chars) in .env.local to enable the admin." },
      { status: 503 },
    );
  }

  const body = (await request.json().catch(() => null)) as { password?: string } | null;
  // Do not trim — password must match ADMIN_PASSWORD exactly (spaces allowed).
  const password = body?.password ?? "";
  if (!verifyPassword(password)) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  return withSessionCookie(NextResponse.json({ ok: true }));
}
