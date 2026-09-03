"use client";

import Link from "next/link";
import { useState } from "react";

import {
  AdminField,
  AdminImageSlot,
  AdminSectionForm,
  adminInputClass,
  joinLines,
  split2,
} from "@/components/admin/form-shared";
import { AutoTextarea } from "@/components/admin/AutoTextarea";
import type { SiteContent } from "@/lib/cms/content";
import { newId, slugify } from "@/lib/cms/id";
import type { ImageAsset } from "@/lib/images";
import {
  CATEGORY_LABELS,
  DEFAULT_NEWS_POSTS,
  NEWS_CATEGORIES,
  type NewsCategory,
} from "@/lib/news";

type Props = {
  content: SiteContent["news"];
  images: Record<string, ImageAsset>;
  defaults: Record<string, ImageAsset>;
};

type Post = SiteContent["news"]["posts"][number];

function emptyPost(): Post {
  const id = newId("post");
  return {
    id,
    slug: id,
    title: "",
    category: "company",
    date: new Date().toISOString().slice(0, 10),
    excerpt: "",
    body: "",
    image: undefined,
  };
}

export function AdminNewsEditor({ content, images, defaults }: Props) {
  const [v, setV] = useState(() => ({
    ...content,
    posts: content.posts.length > 0 ? content.posts : DEFAULT_NEWS_POSTS.map((p) => ({ ...p })),
  }));
  const [assets, setAssets] = useState(images);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  function set<K extends keyof typeof v>(key: K, value: (typeof v)[K]) {
    setV((prev) => ({ ...prev, [key]: value }));
  }

  function updatePost(i: number, patch: Partial<Post>) {
    set(
      "posts",
      v.posts.map((p, j) => (j === i ? { ...p, ...patch } : p)),
    );
  }

  async function onUpload(key: string, file: File) {
    setBusyKey(key);
    setMessage(null);
    const body = new FormData();
    body.set("key", key);
    body.set("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body });
    setBusyKey(null);
    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setMessage(data?.error ?? "Upload failed.");
      return;
    }
    const data = (await res.json()) as { asset: ImageAsset };
    setAssets((prev) => ({ ...prev, [key]: data.asset }));
    setMessage("Image saved to the live site. You do not need to click Save for images.");
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setMessage(null);

    const posts = v.posts.map((p, i) => {
      const slug = slugify(p.slug || p.title) || `post-${i + 1}`;
      return {
        id: p.id || slug,
        slug,
        title: p.title.trim(),
        category: p.category,
        date: p.date.trim(),
        excerpt: p.excerpt.trim(),
        body: p.body.trim(),
        image: p.image?.trim() || undefined,
      };
    });

    const patch = {
      news: {
        eyebrow: v.eyebrow,
        title: v.title,
        lead: v.lead,
        heroAlt: v.heroAlt,
        posts,
        visionLine1: v.visionLine1,
        visionLine2: v.visionLine2,
        visionAccent: v.visionAccent,
        visionAfter1: v.visionAfter1,
        visionAfter2: v.visionAfter2,
        visionPrimaryCta: v.visionPrimaryCta,
        visionSecondaryCta: v.visionSecondaryCta,
      },
    };

    const res = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setStatus("error");
      setMessage(data?.error ?? "Save failed.");
      return;
    }
    setStatus("saved");
    setMessage("Saved. Refresh News to see changes.");
    setV((prev) => ({ ...prev, posts }));
  }

  const imgAsset = (key: string) => assets[key] ?? defaults[key];

  return (
    <form onSubmit={onSave} className="max-w-4xl">
      <h1 className="text-[1.75rem] font-semibold tracking-tight">News</h1>
      <p className="mt-2 text-[0.95rem] text-ist-muted">
        Add posts with date, title, short excerpt, and full body. The public list shows a basic
        row (date / headline / excerpt / Read More). Read More opens{" "}
        <code className="text-ist-text">/news/[slug]</code> with previous / next links between
        posts.
      </p>

      <div className="mt-8 flex flex-col gap-8">
        <AdminSectionForm title="Hero">
          <div className="grid gap-6 lg:grid-cols-[1fr_220px]">
            <div className="grid gap-4">
              <AdminField label="Eyebrow" value={v.eyebrow} onChange={(x) => set("eyebrow", x)} />
              <AdminField label="Title" value={v.title} onChange={(x) => set("title", x)} />
              <AdminField
                label="Lead"
                value={v.lead}
                onChange={(x) => set("lead", x)}
                multiline
                rows={3}
              />
              <AdminField
                label="Hero alt"
                value={v.heroAlt}
                onChange={(x) => set("heroAlt", x)}
                multiline
                rows={2}
              />
            </div>
            <AdminImageSlot
              imageKey="news-hero"
              label="Hero image"
              asset={imgAsset("news-hero")}
              busy={busyKey === "news-hero"}
              onUpload={onUpload}
            />
          </div>
        </AdminSectionForm>

        <AdminSectionForm
          title="Posts"
          hint="Newest first on the site (by date). Body paragraphs: separate with a blank line."
        >
          <div className="flex flex-col gap-6">
            {v.posts.length === 0 ? (
              <p className="text-[0.9rem] text-ist-muted">No posts yet. Add one when you have news.</p>
            ) : null}

            {v.posts.map((post, i) => {
              const imageKey = post.image || `news-${post.slug || post.id}`;
              const publicHref = post.slug ? `/news/${post.slug}` : null;

              return (
                <div
                  key={post.id}
                  className="grid gap-4 border border-ist-line/70 p-4 lg:grid-cols-[1fr_180px]"
                >
                  <div className="grid gap-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-[0.85rem] font-medium text-ist-accent-bright">
                        Post {i + 1}
                      </p>
                      <div className="flex flex-wrap items-center gap-3">
                        {publicHref ? (
                          <Link
                            href={publicHref}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[0.8rem] text-ist-muted underline-offset-2 hover:text-ist-accent-bright hover:underline"
                          >
                            View page
                          </Link>
                        ) : null}
                        <button
                          type="button"
                          className="text-[0.8rem] text-ist-muted underline-offset-2 hover:text-ist-accent-bright hover:underline"
                          onClick={() =>
                            set(
                              "posts",
                              v.posts.filter((_, j) => j !== i),
                            )
                          }
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <AdminField
                      label="Title"
                      value={post.title}
                      onChange={(x) =>
                        updatePost(i, {
                          title: x,
                          slug:
                            !post.slug || post.slug === slugify(post.title)
                              ? slugify(x)
                              : post.slug,
                        })
                      }
                      multiline
                      rows={2}
                    />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <AdminField
                        label="Slug (URL: /news/…)"
                        value={post.slug}
                        onChange={(x) =>
                          updatePost(i, {
                            slug: slugify(x) || x,
                          })
                        }
                      />
                      <AdminField
                        label="Date (YYYY-MM-DD)"
                        value={post.date}
                        onChange={(x) => updatePost(i, { date: x })}
                      />
                    </div>
                    <label className="block">
                      <span className="mb-1.5 block text-[0.7rem] font-medium uppercase tracking-[0.08em] text-ist-dim">
                        Category
                      </span>
                      <select
                        value={post.category}
                        onChange={(e) =>
                          updatePost(i, { category: e.target.value as NewsCategory })
                        }
                        className={adminInputClass}
                      >
                        {NEWS_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {CATEGORY_LABELS[cat]}
                          </option>
                        ))}
                      </select>
                    </label>
                    <AdminField
                      label="Excerpt (list summary under the title)"
                      value={post.excerpt}
                      onChange={(x) => updatePost(i, { excerpt: x })}
                      multiline
                      rows={2}
                    />
                    <label className="block">
                      <span className="mb-1.5 block text-[0.7rem] font-medium uppercase tracking-[0.08em] text-ist-dim">
                        Body (detail page — blank line = new paragraph)
                      </span>
                      <AutoTextarea
                        value={post.body}
                        minRows={6}
                        onChange={(x) => updatePost(i, { body: x })}
                        className={adminInputClass}
                      />
                    </label>
                  </div>
                  <div>
                    <AdminImageSlot
                      imageKey={imageKey}
                      label="Image (optional)"
                      asset={imgAsset(imageKey)}
                      busy={busyKey === imageKey}
                      onUpload={(key, file) => {
                        void onUpload(key, file);
                        updatePost(i, { image: key });
                      }}
                    />
                    <p className="mt-2 text-[0.72rem] leading-snug text-ist-dim">
                      Not required for the basic list layout.
                    </p>
                    {post.image ? (
                      <button
                        type="button"
                        className="mt-2 text-[0.75rem] text-ist-muted underline-offset-2 hover:underline"
                        onClick={() => updatePost(i, { image: undefined })}
                      >
                        Clear image
                      </button>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            className="mt-5 border border-ist-line px-4 py-2 text-[0.9rem] text-ist-text hover:border-ist-accent"
            onClick={() => set("posts", [...v.posts, emptyPost()])}
          >
            + Add post
          </button>
        </AdminSectionForm>

        <AdminSectionForm title="Closing CTA">
          <div className="grid gap-6 lg:grid-cols-[1fr_220px]">
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField
                label="Opening"
                value={joinLines([v.visionLine1, v.visionLine2])}
                onChange={(x) => {
                  const [a, b] = split2(x);
                  setV((prev) => ({ ...prev, visionLine1: a, visionLine2: b }));
                }}
                multiline
                rows={2}
                className="block sm:col-span-2"
              />
              <AdminField
                label="Accent line"
                value={v.visionAccent}
                onChange={(x) => set("visionAccent", x)}
                multiline
                rows={2}
                className="block sm:col-span-2"
              />
              <AdminField
                label="Closing"
                value={joinLines([v.visionAfter1, v.visionAfter2])}
                onChange={(x) => {
                  const [a, b] = split2(x);
                  setV((prev) => ({ ...prev, visionAfter1: a, visionAfter2: b }));
                }}
                multiline
                rows={2}
                className="block sm:col-span-2"
              />
              <AdminField
                label="Primary CTA"
                value={v.visionPrimaryCta}
                onChange={(x) => set("visionPrimaryCta", x)}
              />
              <AdminField
                label="Secondary CTA"
                value={v.visionSecondaryCta}
                onChange={(x) => set("visionSecondaryCta", x)}
              />
            </div>
            <AdminImageSlot
              imageKey="band-vision"
              label="Band image"
              asset={imgAsset("band-vision")}
              busy={busyKey === "band-vision"}
              onUpload={onUpload}
            />
          </div>
        </AdminSectionForm>
      </div>

      <div className="sticky bottom-0 mt-8 border-t border-ist-line bg-ist-bg/95 py-4 backdrop-blur">
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={status === "saving"}
            className="bg-ist-accent px-5 py-2.5 text-[0.95rem] font-medium text-white hover:bg-ist-accent-deep disabled:opacity-60"
          >
            {status === "saving" ? "Saving…" : "Save News"}
          </button>
          {message ? (
            <p
              className={`text-[0.85rem] ${status === "error" ? "text-ist-accent-bright" : "text-ist-muted"}`}
            >
              {message}
            </p>
          ) : null}
        </div>
      </div>
    </form>
  );
}
