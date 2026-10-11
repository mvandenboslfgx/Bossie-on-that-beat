/** Short public edge cache: fast globally while sync revalidation keeps releases current. */
export const CATALOG_HTML_HEADERS: Record<string, string> = {
  "Cache-Control": "public, max-age=0, s-maxage=60, stale-while-revalidate=300",
  "CDN-Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
  "Cloudflare-CDN-Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
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
