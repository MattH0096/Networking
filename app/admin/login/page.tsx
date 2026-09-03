import { Suspense } from "react";
import { redirect } from "next/navigation";

import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { isAuthenticated } from "@/lib/cms/auth";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await isAuthenticated()) redirect("/admin");

  return (
    <Suspense fallback={<p className="text-ist-muted">Loading…</p>}>
      <AdminLoginForm />
    </Suspense>
  );
}
