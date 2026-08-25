import { getServerEnv } from "@/lib/env";

/** Fail-closed admin auth — separate from CRON_SECRET used for sync endpoints. */
export function authorizeAdmin(request: Request): boolean {
  const env = getServerEnv();
  const secret = request.headers.get("x-admin-secret");
  return Boolean(env.ADMIN_SECRET && secret === env.ADMIN_SECRET);
}

export function adminUnauthorizedResponse() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}
