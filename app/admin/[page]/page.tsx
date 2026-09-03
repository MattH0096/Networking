import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { AdminAboutEditor } from "@/components/admin/AdminAboutEditor";
import { AdminCareersEditor } from "@/components/admin/AdminCareersEditor";
import { AdminContactEditor } from "@/components/admin/AdminContactEditor";
import { AdminCrucibleEditor } from "@/components/admin/AdminCrucibleEditor";
import { AdminHomeEditor } from "@/components/admin/AdminHomeEditor";
import { AdminImageEditor } from "@/components/admin/AdminImageEditor";
import { AdminInsightsEditor } from "@/components/admin/AdminInsightsEditor";
import { AdminLocusEditor } from "@/components/admin/AdminLocusEditor";
import { AdminNewsEditor } from "@/components/admin/AdminNewsEditor";
import { AdminSolutionsEditor } from "@/components/admin/AdminSolutionsEditor";
import { isAuthenticated, isAdminConfigured } from "@/lib/cms/auth";
import { getSiteContent } from "@/lib/cms/content";
import type { AdminPageId } from "@/lib/cms/types";
import { ADMIN_PAGES } from "@/lib/cms/types";
import manifest from "@/lib/generated/image-manifest.json";
import type { ImageAsset, ImageKey } from "@/lib/images";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ page: string }> };

export default async function AdminPageEditor({ params }: Props) {
  if (!isAdminConfigured()) {
    return <p className="text-ist-muted">Admin is not configured.</p>;
  }
  if (!(await isAuthenticated())) redirect("/admin/login");

  const { page } = await params;
  const meta = ADMIN_PAGES.find((p) => p.id === page);
  if (!meta) notFound();

  const content = await getSiteContent();
  const pageId = page as AdminPageId;
  const images = {
    ...(manifest as Record<string, ImageAsset>),
    ...content.images,
  };
  const defaults = manifest as Record<string, ImageAsset>;

  return (
    <div>
      <Link href="/admin" className="text-[0.85rem] text-ist-muted hover:text-ist-text">
        ← All pages
      </Link>
      <div className="mt-6">
        {pageId === "home" ? (
          <AdminHomeEditor content={content.home} images={images} defaults={defaults} />
        ) : null}

        {pageId === "solutions" ? (
          <AdminSolutionsEditor
            content={content.solutions}
            images={images}
            defaults={defaults}
          />
        ) : null}

        {pageId === "locus" ? (
          <AdminLocusEditor content={content.locus} images={images} defaults={defaults} />
        ) : null}

        {pageId === "crucible" ? (
          <AdminCrucibleEditor
            content={content.crucible}
            images={images}
            defaults={defaults}
          />
        ) : null}

        {pageId === "about" ? (
          <AdminAboutEditor content={content.about} images={images} defaults={defaults} />
        ) : null}

        {pageId === "contact" ? (
          <AdminContactEditor content={content.contact} images={images} defaults={defaults} />
        ) : null}

        {pageId === "insights" ? (
          <AdminInsightsEditor
            content={content.insights}
            images={images}
            defaults={defaults}
          />
        ) : null}

        {pageId === "news" ? (
          <AdminNewsEditor content={content.news} images={images} defaults={defaults} />
        ) : null}

        {pageId === "careers" ? <AdminCareersEditor content={content.careers} /> : null}

        {pageId === "images" ? (
          <AdminImageEditor
            keys={Object.keys(manifest) as ImageKey[]}
            current={{ ...manifest, ...content.images }}
            defaults={manifest}
          />
        ) : null}
      </div>
    </div>
  );
}
