"use client";

export function AdminLogout() {
  return (
    <button
      type="button"
      className="rounded-sm border border-ist-line px-3 py-1.5 text-[0.85rem] text-ist-muted hover:border-ist-accent hover:text-ist-text"
      onClick={async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        window.location.assign("/admin/login");
      }}
    >
      Log out
    </button>
  );
}
