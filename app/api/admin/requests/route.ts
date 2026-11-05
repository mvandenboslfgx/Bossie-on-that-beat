import { NextResponse } from "next/server";
import { authorizeAdmin } from "@/lib/auth/admin";
import { getDb } from "@/lib/db/client";

export async function GET(request: Request) {
  if (!authorizeAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await getDb();
    if (!db) return NextResponse.json({ error: "Database unavailable" }, { status: 503 });

    const { searchParams } = new URL(request.url);
    const reference = searchParams.get("reference")?.trim();

    if (reference) {
      const entry = await db.prepare(
        "SELECT id, status, payload, email, name, created_at, updated_at FROM project_requests WHERE id = ?",
      ).bind(reference).first();
      return NextResponse.json({ request: entry ?? null }, {
        headers: { "Cache-Control": "no-store" },
      });
    }

    const results = await db.prepare(
      "SELECT id, status, email, name, created_at, updated_at FROM project_requests ORDER BY created_at DESC LIMIT 100",
    ).all();

    return NextResponse.json({ requests: results.results ?? [] }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("admin project requests failed", error instanceof Error ? error.message : String(error));
    return NextResponse.json({ error: "Unable to load project requests" }, { status: 500 });
  }
}
