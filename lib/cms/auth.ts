import "server-only";

import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const COOKIE = "ist_admin_session";
const MAX_AGE_SEC = 60 * 60 * 24 * 7; // 7 days

function secret() {
  const value = process.env.ADMIN_PASSWORD?.trim();
  if (!value) return null;
  return value;
}

function sign(payload: string) {
  const key = secret();
  if (!key) return null;
  return createHmac("sha256", key).update(payload).digest("base64url");
}

export function isAdminConfigured() {
  const value = process.env.ADMIN_PASSWORD?.trim();
  return Boolean(value && value.length >= 8);
}

export function verifyPassword(input: string) {
  const expected = secret();
  if (!expected) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function buildToken() {
  const exp = Date.now() + MAX_AGE_SEC * 1000;
  const payload = `ok.${exp}`;
  const sig = sign(payload);
  if (!sig) throw new Error("Admin is not configured");
  return `${payload}.${sig}`;
}

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: MAX_AGE_SEC,
};

/** Attach session cookie to a Route Handler response (most reliable). */
export function withSessionCookie(response: NextResponse) {
  response.cookies.set(COOKIE, buildToken(), cookieOptions);
  return response;
}

export async function createSession() {
  const jar = await cookies();
  jar.set(COOKIE, buildToken(), cookieOptions);
}

export async function destroySession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(COOKIE, "", { ...cookieOptions, maxAge: 0 });
  return response;
}

export async function isAuthenticated() {
  if (!isAdminConfigured()) return false;
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return false;
  return isValidSessionToken(token);
}

export function isValidSessionToken(token: string) {
  if (!isAdminConfigured()) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [ok, expStr, sig] = parts;
  if (ok !== "ok" || !expStr || !sig) return false;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || Date.now() > exp) return false;
  const payload = `${ok}.${expStr}`;
  const expected = sign(payload);
  if (!expected) return false;
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export { COOKIE as ADMIN_COOKIE };
