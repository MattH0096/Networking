import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE = "ist_admin_session";

function bytesToBase64Url(bytes: ArrayBuffer | Uint8Array) {
  const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = "";
  for (let i = 0; i < view.length; i++) binary += String.fromCharCode(view[i]!);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function hmacSign(secret: string, payload: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return bytesToBase64Url(sig);
}

async function isValidSession(token: string | undefined, secret: string | undefined) {
  if (!token || !secret) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [ok, expStr, sig] = parts;
  if (ok !== "ok" || !expStr || !sig) return false;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || Date.now() > exp) return false;
  const payload = `${ok}.${expStr}`;
  const expected = await hmacSign(secret, payload);
  if (expected.length !== sig.length) return false;
  // Constant-time-ish compare for equal-length strings
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  }
  return diff === 0;
}

/**
 * Protect /admin (except login) and /api/admin (except login).
 * Next.js 16 Proxy runs on Node.js — session check uses Web Crypto.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/admin/login";
  const isLoginApi = pathname === "/api/admin/login";
  const isAdminUi = pathname === "/admin" || pathname.startsWith("/admin/");
  const isAdminApi = pathname.startsWith("/api/admin");

  if (!isAdminUi && !isAdminApi) return NextResponse.next();
  if (isLoginPage || isLoginApi) return NextResponse.next();

  const secret = process.env.ADMIN_PASSWORD?.trim();
  const token = request.cookies.get(COOKIE)?.value;
  if (await isValidSession(token, secret)) return NextResponse.next();

  if (isAdminApi) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const login = new URL("/admin/login", request.url);
  login.searchParams.set("next", pathname);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin/:path*"],
};
