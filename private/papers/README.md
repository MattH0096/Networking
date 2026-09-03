# Gated papers

Files here are served **only** by `app/api/insights/[slug]/download`, after the
visitor passes the gate on `/insights`. This directory sits outside `public/`,
so nothing in it is reachable by URL and a download link cannot be shared to
bypass the form.

## Adding a paper

1. Drop the PDF in this directory.
2. Register it in `lib/server/papers.ts` — map the slug to the filename and the
   name the browser should save it as.
3. Add the listing to `PAPERS` in `lib/insights.ts`.

## Outstanding

**{{TBD}}** — `distribution-completeness-in-dynamic-mesh-networks.pdf` has not
been supplied. The listing and the gate are live; until the file exists the
route answers with an honest "not available yet" rather than a broken download.
