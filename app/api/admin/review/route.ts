import { NextResponse } from "next/server";
import { getServerEnv } from "@/lib/env";
import {
  approveCinema,
  approveRelease,
  getPendingReviewCinema,
  getPendingReviewReleases,
  rejectCinema,
  rejectRelease,
} from "@/lib/repository/admin-repository";

function authorize(request: Request) {
  const env = getServerEnv();
  const secret = request.headers.get("x-cron-secret");
  if (!env.CRON_SECRET || secret !== env.CRON_SECRET) {
    return false;
  }
  return true;
}

export async function GET(request: Request) {
  if (!authorize(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [releases, cinema] = await Promise.all([getPendingReviewReleases(), getPendingReviewCinema()]);
  return NextResponse.json({ releases, cinema });
}

export async function POST(request: Request) {
  if (!authorize(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    action?: "approve" | "reject" | "edit";
    kind?: "release" | "cinema";
    id?: string;
    patch?: Record<string, unknown>;
  };

  if (!body.action || !body.kind || !body.id) {
    return NextResponse.json({ error: "Missing action, kind or id" }, { status: 400 });
  }

  if (body.action === "edit" && body.kind === "release" && body.patch) {
    const { getDb } = await import("@/lib/db/client");
    const db = await getDb();
    if (!db) return NextResponse.json({ error: "Database unavailable" }, { status: 503 });

    const allowed = ["title", "status", "world_slug", "tagline", "description"] as const;
    const sets: string[] = [];
    const values: unknown[] = [];
    for (const key of allowed) {
      if (body.patch[key] !== undefined) {
        sets.push(`${key} = ?`);
        values.push(body.patch[key]);
      }
    }
    if (!sets.length) return NextResponse.json({ error: "No editable fields" }, { status: 400 });
    sets.push("updated_at = datetime('now')");
    values.push(body.id);
    await db
      .prepare(`UPDATE releases SET ${sets.join(", ")} WHERE id = ? AND manual_override = 0`)
      .bind(...values)
      .run();
    return NextResponse.json({ ok: true });
  }

  let ok = false;
  if (body.kind === "release") {
    ok = body.action === "approve" ? await approveRelease(body.id) : await rejectRelease(body.id);
  } else if (body.kind === "cinema") {
    ok = body.action === "approve" ? await approveCinema(body.id) : await rejectCinema(body.id);
  }

  if (!ok) return NextResponse.json({ error: "Action failed or item protected" }, { status: 409 });
  return NextResponse.json({ ok: true });
}
