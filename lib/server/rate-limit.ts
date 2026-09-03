/**
 * Fixed-window rate limiter.
 *
 * In-memory and therefore per-instance: it survives a single server, not a
 * horizontally scaled deployment or a serverless cold start. That is enough to
 * blunt casual abuse of the public forms, and it adds no infrastructure. If the
 * site is ever deployed across multiple instances, swap the map for a shared
 * store — the call signature is designed not to change.
 */

type Window = { count: number; resetAt: number };

const windows = new Map<string, Window>();

/** Keeps the map from growing without bound on a long-lived server. */
function sweep(now: number) {
  if (windows.size < 5000) return;
  for (const [key, window] of windows) {
    if (window.resetAt <= now) windows.delete(key);
  }
}

export type RateLimitResult = {
  ok: boolean;
  /** Seconds until the caller may retry. Zero when the request was allowed. */
  retryAfter: number;
};

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const existing = windows.get(key);

  if (!existing || existing.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }

  existing.count += 1;

  if (existing.count > limit) {
    return { ok: false, retryAfter: Math.ceil((existing.resetAt - now) / 1000) };
  }

  return { ok: true, retryAfter: 0 };
}

/**
 * Best-effort client address. `x-forwarded-for` is only trustworthy behind a
 * proxy that sets it; the fallback groups unknown callers into one bucket,
 * which fails closed rather than handing every caller a fresh quota.
 */
export function clientKey(headers: Headers, scope: string): string {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const real = headers.get("x-real-ip")?.trim();
  return `${scope}:${forwarded || real || "unknown"}`;
}
