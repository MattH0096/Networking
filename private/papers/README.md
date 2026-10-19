# Gated papers

Files here are served **only** by `app/api/insights/[slug]/download`, after the
visitor passes the gate on `/insights`. This directory sits outside `public/`,
so nothing in it is reachable by URL and a download link cannot be shared to
bypass the form.

## Preferred: admin upload

1. Open **Admin → Insights**.
2. Add or edit a paper, then use **Upload PDF**.
3. Click **Save Insights**.

Uploads are stored privately (local `private/papers/` in development, or
private Vercel Blob in production) and linked on the paper via `pdfStorageKey`.

## Seeded file

`IST_Whitepaper.pdf` is the seed PDF for the Distribution Completeness paper.
Replace it anytime from the admin Insights editor.
