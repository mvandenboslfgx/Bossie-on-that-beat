import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/lib/db/client";

const eventSchema = z.object({
  releaseId: z.string().trim().max(160).optional(),
  platform: z.string().trim().max(80).optional(),
  source: z.string().trim().max(500).optional(),
  medium: z.string().trim().max(160).optional(),
  campaign: z.string().trim().max(160).optional(),
  deviceType: z.enum(["mobile", "desktop", "tablet", "unknown"]).optional(),
});

export async function POST(request: Request) {
  try {
    const length = Number(request.headers.get("content-length") ?? 0);
    if (length > 4096) return NextResponse.json({ ok: false }, { status: 413 });
    const parsed = eventSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ ok: false }, { status: 400 });
    const body = parsed.data;
    const db = await getDb();

    if (db) {
      const id = `evt-${crypto.randomUUID()}`;
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
