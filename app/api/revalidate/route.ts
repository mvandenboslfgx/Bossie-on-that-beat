import { NextResponse } from "next/server";
import { getServerEnv } from "@/lib/env";
import { revalidateCatalogPaths } from "@/lib/cache/revalidate-catalog";

/** Called by sync worker or POST /api/sync after D1 writes. */
export async function POST(request: Request) {
  const env = getServerEnv();
  const secret = request.headers.get("x-cron-secret");
  if (!env.CRON_SECRET || secret !== env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  revalidateCatalogPaths();
  return NextResponse.json({ ok: true, revalidated: true });
}
