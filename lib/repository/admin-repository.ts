import { attachLinks, getDb, rowToLink, rowToRelease } from "@/lib/db/client";
import type { CinemaItem } from "@/lib/types/cinema";
import type { ReleaseWithLinks } from "@/lib/types/release";
import { isVerifiedListenUrl } from "@/lib/links/url";

function mapCinemaRow(row: Record<string, unknown>): CinemaItem {
  const youtubeRaw = row.youtube_url ? String(row.youtube_url) : undefined;
  return {
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title),
    type: row.type as CinemaItem["type"],
    releaseSlug: row.release_slug ? String(row.release_slug) : undefined,
    worldSlug: row.world_slug ? String(row.world_slug) : undefined,
    youtubeUrl: youtubeRaw && isVerifiedListenUrl(youtubeRaw) ? youtubeRaw : undefined,
    youtubeVideoId: row.youtube_video_id ? String(row.youtube_video_id) : undefined,
    thumbnailUrl: row.thumbnail_url ? String(row.thumbnail_url) : undefined,
    description: row.description ? String(row.description) : undefined,
    durationSeconds: row.duration_seconds != null ? Number(row.duration_seconds) : undefined,
    publishedAt: row.published_at ? String(row.published_at) : undefined,
    featured: Boolean(row.featured),
    reviewStatus: (row.review_status ? String(row.review_status) : "published") as CinemaItem["reviewStatus"],
    manualOverride: Boolean(row.manual_override),
  };
}

export async function getPendingReviewReleases(): Promise<ReleaseWithLinks[]> {
  const db = await getDb();
  if (!db) return [];

  const rows = await db
    .prepare("SELECT * FROM releases WHERE status = 'pending_review' ORDER BY last_synced_at DESC")
    .all();
  const linkRows = await db.prepare("SELECT * FROM release_links").all();
  const linksByRelease = new Map<string, ReturnType<typeof rowToLink>[]>();
  for (const row of linkRows.results ?? []) {
    const link = rowToLink(row);
    const list = linksByRelease.get(link.releaseId) ?? [];
    list.push(link);
    linksByRelease.set(link.releaseId, list);
  }

  return (rows.results ?? []).map((row) =>
    attachLinks(rowToRelease(row), linksByRelease.get(String(row.id)) ?? []),
  );
}

export async function getPendingReviewCinema(): Promise<CinemaItem[]> {
  const db = await getDb();
  if (!db) return [];

  const rows = await db
    .prepare("SELECT * FROM cinema_items WHERE review_status = 'pending_review' ORDER BY published_at DESC")
    .all();
  return (rows.results ?? []).map((row) => mapCinemaRow(row as Record<string, unknown>));
}

export async function approveRelease(id: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  const result = await db
    .prepare(
      `UPDATE releases SET status = 'live', updated_at = datetime('now')
       WHERE id = ? AND manual_override = 0 AND status = 'pending_review'`,
    )
    .bind(id)
    .run();
  return (result.meta?.changes ?? 0) > 0;
}

export async function rejectRelease(id: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  const result = await db
    .prepare(
      `UPDATE releases SET status = 'project', updated_at = datetime('now')
       WHERE id = ? AND manual_override = 0 AND status = 'pending_review'`,
    )
    .bind(id)
    .run();
  return (result.meta?.changes ?? 0) > 0;
}

export async function approveCinema(id: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  const result = await db
    .prepare(
      `UPDATE cinema_items SET review_status = 'published', updated_at = datetime('now')
       WHERE id = ? AND manual_override = 0 AND review_status = 'pending_review'`,
    )
    .bind(id)
    .run();
  return (result.meta?.changes ?? 0) > 0;
}

export async function rejectCinema(id: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  const result = await db
    .prepare(
      `UPDATE cinema_items SET review_status = 'hidden', updated_at = datetime('now')
       WHERE id = ? AND manual_override = 0 AND review_status = 'pending_review'`,
    )
    .bind(id)
    .run();
  return (result.meta?.changes ?? 0) > 0;
}
