import Link from "next/link";
import { redirect } from "next/navigation";

import { isAuthenticated, isAdminConfigured } from "@/lib/cms/auth";
import { getSiteContent } from "@/lib/cms/content";
import { ADMIN_PAGES } from "@/lib/cms/types";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  if (!isAdminConfigured()) {
    return (
      <p className="text-ist-muted">
        Admin is not configured yet. Add <code className="font-mono">ADMIN_PASSWORD</code> to
        continue.
      </p>
    );
  }
  if (!(await isAuthenticated())) redirect("/admin/login");

  const content = await getSiteContent();

  return (
    <div>
      <h1 className="text-[1.75rem] font-semibold tracking-tight">Content</h1>
      <p className="mt-2 max-w-2xl text-[0.95rem] text-ist-muted">
        Choose a page to edit. On Vercel, saves go to Blob storage (not a local
        file). After saving, refresh the public page to see changes.
      </p>
      {content.updatedAt ? (
        <p className="mt-3 font-mono text-[0.7rem] text-ist-dim">
          Last saved {new Date(content.updatedAt).toLocaleString()}
        </p>
      ) : (
        <p className="mt-3 font-mono text-[0.7rem] text-ist-dim">No overrides saved yet — showing defaults.</p>
      )}

      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {ADMIN_PAGES.map((page) => (
          <li key={page.id}>
            <Link
              href={`/admin/${page.id}`}
              className="block border border-ist-line bg-black p-5 transition-colors hover:border-ist-accent"
            >
              <p className="text-[1.05rem] font-semibold">{page.label}</p>
              <p className="mt-1.5 text-[0.85rem] text-ist-muted">{page.blurb}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
