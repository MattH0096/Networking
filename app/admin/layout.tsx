import type { Metadata } from "next";
import Link from "next/link";

import { AdminLogout } from "@/components/admin/AdminLogout";
import { isAuthenticated, isAdminConfigured } from "@/lib/cms/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "IST Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const authed = await isAuthenticated();
  const configured = isAdminConfigured();

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-[#0a0a0a] text-ist-text"
      data-lenis-prevent
    >
      <header className="border-b border-ist-line">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4">
          <div>
            <Link href="/admin" className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-ist-accent-bright">
              IST Admin
            </Link>
            <p className="mt-1 text-[0.85rem] text-ist-muted">
              Edit site copy and images without touching code.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-[0.85rem] text-ist-muted hover:text-ist-text">
              View site
            </Link>
            {authed ? <AdminLogout /> : null}
          </div>
        </div>
      </header>
      {!configured ? (
        <div className="mx-auto max-w-5xl px-5 py-4">
          <p className="rounded-sm border border-ist-accent/40 bg-ist-accent/10 px-4 py-3 text-[0.9rem] text-ist-text">
            Set <code className="font-mono text-ist-accent-bright">ADMIN_PASSWORD</code> in{" "}
            <code className="font-mono">.env.local</code> (8+ characters), then restart the
            dev server.
          </p>
        </div>
      ) : null}
      <div className="mx-auto max-w-5xl px-5 py-8">{children}</div>
    </div>
  );
}
