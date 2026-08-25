/** Catalog HTML must never be edge-cached — crawlers and social bots need fresh D1 snapshots. */
export const CATALOG_HTML_HEADERS: Record<string, string> = {
  "Cache-Control": "private, no-cache, no-store, max-age=0, must-revalidate",
  "CDN-Cache-Control": "no-store",
  "Cloudflare-CDN-Cache-Control": "no-store",
  Pragma: "no-cache",
};

export const CATALOG_ROUTE_PREFIXES = [
  "/",
  "/music",
  "/links",
  "/epk",
  "/go/",
  "/cinema",
  "/worlds",
] as const;

export function isCatalogHtmlPath(pathname: string): boolean {
  if (pathname === "/") return true;
  return CATALOG_ROUTE_PREFIXES.some((prefix) => prefix !== "/" && pathname.startsWith(prefix));
}
