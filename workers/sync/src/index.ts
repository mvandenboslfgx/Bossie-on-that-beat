import type { D1Database } from "@cloudflare/workers-types";
import { runReleaseSync, type SyncEnv } from "../../../lib/release-sync/sync";

export interface Env extends SyncEnv {
  CRON_SECRET?: string;
  /** Main site URL — used to bust catalog cache after sync. */
  SITE_URL?: string;
  DB: D1Database;
}

async function revalidateMainCatalog(env: Env) {
  const base = (env.SITE_URL ?? "https://bossieonthatbeat.com").replace(/\/$/, "");
  if (!env.CRON_SECRET) return;
  try {
    const response = await fetch(`${base}/api/revalidate`, {
      method: "POST",
      headers: { "x-cron-secret": env.CRON_SECRET },
    });
    if (!response.ok) {
      console.warn("[bossie-sync] catalog revalidate failed", response.status);
    }
  } catch (error) {
    console.warn("[bossie-sync] catalog revalidate error", error);
  }
}

export default {
  async scheduled(_event: ScheduledEvent, env: Env, _ctx: ExecutionContext) {
    if (!env.DB) {
      console.error("[bossie-sync] DB binding missing");
      return;
    }
    const result = await runReleaseSync(env);
    await revalidateMainCatalog(env);
    console.log("[bossie-sync] completed", JSON.stringify(result));
  },

  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/health") {
      return Response.json({ ok: true, worker: "bossie-on-that-beat-sync" });
    }

    if (url.pathname === "/sync" && request.method === "POST") {
      // Fail closed: HTTP sync always requires CRON_SECRET. Cron `scheduled` bypasses this.
      const secret = request.headers.get("x-cron-secret");
      if (!env.CRON_SECRET || secret !== env.CRON_SECRET) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
      }
      if (!env.DB) {
        return Response.json({ error: "DB binding missing" }, { status: 503 });
      }
      const result = await runReleaseSync(env);
      await revalidateMainCatalog(env);
      return Response.json(result);
    }

    return new Response("Not found", { status: 404 });
  },
};
