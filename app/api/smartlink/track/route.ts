import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = await getDb();

    if (db) {
      const id = `evt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      await db
        .prepare(
          `INSERT INTO smartlink_events (id, release_id, platform, source, medium, campaign, device_type)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
        )
        .bind(
          id,
          body.releaseId ?? null,
          body.platform ?? null,
          body.source ?? null,
          body.medium ?? null,
          body.campaign ?? null,
          body.deviceType ?? null,
        )
        .run();
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
