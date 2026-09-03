/**
 * Routes that currently exist, read from the app directory.
 *
 * The nav and footer already link to pages built in later stages. Next prefetches
 * those links, so a production server answers each with a 404 that is expected
 * rather than broken. Deriving the list from disk means the allowance disappears
 * on its own as each page lands, instead of hiding a genuine 404 forever.
 */
import { readdir } from "node:fs/promises";
import path from "node:path";

export async function builtRoutes(dir = "app", prefix = "") {
  const routes = new Set();
  const entries = await readdir(dir, { withFileTypes: true });

  if (entries.some((e) => e.isFile() && /^page\.(tsx|jsx|ts|js)$/.test(e.name))) {
    routes.add(prefix || "/");
  }

  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith("_")) continue;
    // Route groups like (marketing) don't contribute a path segment.
    const segment = /^\(.*\)$/.test(entry.name) ? "" : `/${entry.name}`;
    for (const route of await builtRoutes(path.join(dir, entry.name), prefix + segment)) {
      routes.add(route);
    }
  }

  return routes;
}
