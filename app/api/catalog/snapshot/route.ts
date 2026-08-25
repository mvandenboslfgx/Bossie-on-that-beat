import { NextResponse } from "next/server";
import { getCatalog } from "@/lib/repository/catalog";
import { CATALOG_HTML_HEADERS } from "@/lib/cache/catalog-headers";

/** Public proof that all catalog routes share one D1 snapshot. */
export async function GET() {
  const catalog = await getCatalog();
  return NextResponse.json(
    {
      refreshedAt: catalog.refreshedAt,
      liveCount: catalog.live.length,
      latestSlug: catalog.latest?.slug ?? null,
      latestTitle: catalog.latest?.title ?? null,
      featuredSlug: catalog.featured?.slug ?? null,
    },
    { headers: { ...CATALOG_HTML_HEADERS, "Cache-Control": "no-store" } },
  );
}
