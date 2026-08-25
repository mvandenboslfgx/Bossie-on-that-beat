import { NextResponse } from "next/server";
import { getServerEnv } from "@/lib/env";
import { getDb } from "@/lib/db/client";
import { runReleaseSync } from "@/lib/release-sync/sync";

export async function POST(request: Request) {
  const env = getServerEnv();
  const secret = request.headers.get("x-cron-secret");
  if (env.CRON_SECRET && secret !== env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = await getDb();
  if (!db) {
    return NextResponse.json({ error: "Database not available in this environment." }, { status: 503 });
  }

  const result = await runReleaseSync({
    DB: db,
    SPOTIFY_CLIENT_ID: env.SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET: env.SPOTIFY_CLIENT_SECRET,
    SPOTIFY_ARTIST_ID: env.SPOTIFY_ARTIST_ID,
  });

  return NextResponse.json(result);
}
