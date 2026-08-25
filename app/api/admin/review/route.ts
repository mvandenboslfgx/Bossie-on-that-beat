import { NextResponse } from "next/server";
import { authorizeAdmin } from "@/lib/auth/admin";
import {
  approveCinema,
  approveRelease,
  getPendingReviewCinema,
  getPendingReviewReleases,
  rejectCinema,
  rejectRelease,
} from "@/lib/repository/admin-repository";
import { getLiveReleases } from "@/lib/repository/release-repository";
import { scoreAllReleases } from "@/lib/release-sync/quality";

export async function GET(request: Request) {
  if (!authorizeAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [releases, cinema, live] = await Promise.all([
    getPendingReviewReleases(),
    getPendingReviewCinema(),
    getLiveReleases(),
  ]);
  const quality = scoreAllReleases(live);
  return NextResponse.json({ releases, cinema, quality });
}

export async function POST(request: Request) {
  if (!authorizeAdmin(request)) {
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
