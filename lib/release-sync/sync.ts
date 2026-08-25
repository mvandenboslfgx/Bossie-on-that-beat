import type { D1Database } from "@cloudflare/workers-types";
import { seedReleases } from "@/data/seed/releases";
import { classifyRelease, mergeClassification } from "@/lib/release-sync/classify";
import { findBestMatch, slugFromTitle } from "@/lib/release-sync/match";
import { mergeLinks } from "@/lib/release-sync/providers/base";
import { createAppleMusicProvider, createSpotifyProvider } from "@/lib/release-sync/providers";
import type { ProviderRelease } from "@/lib/release-sync/providers/base";
import { rowToLink, rowToRelease, attachLinks } from "@/lib/db/client";
import type { ReleaseLink } from "@/lib/types/release";

export interface SyncEnv {
  DB: D1Database;
  SPOTIFY_CLIENT_ID?: string;
  SPOTIFY_CLIENT_SECRET?: string;
  SPOTIFY_ARTIST_ID?: string;
}

export interface SyncResult {
  status: "ok" | "partial" | "error";
  releasesFound: number;
  releasesCreated: number;
  releasesUpdated: number;
  errors: string[];
}

async function ensureSeed(db: D1Database) {
  const count = await db.prepare("SELECT COUNT(*) as c FROM releases").first<{ c: number }>();
  if ((count?.c ?? 0) > 0) return;

  for (const release of seedReleases) {
    await db
      .prepare(
        `INSERT INTO releases (id, slug, title, artist, type, status, release_date, artwork_url, genres, subgenres, moods, languages, tagline, description, story, world_slug, featured, priority, manual_override, first_seen_at, last_synced_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`,
      )
      .bind(
        release.id,
        release.slug,
        release.title,
        release.artist,
        release.type,
        release.status,
        release.releaseDate ?? null,
        release.artworkUrl,
        JSON.stringify(release.genres),
        JSON.stringify(release.subgenres ?? []),
        JSON.stringify(release.moods ?? []),
        JSON.stringify(release.languages ?? []),
        release.tagline ?? null,
        release.description ?? null,
        release.story ?? null,
        release.worldSlug ?? null,
        release.featured ? 1 : 0,
        release.priority ?? 0,
        release.firstSeenAt ?? new Date().toISOString(),
        release.lastSyncedAt ?? new Date().toISOString(),
      )
      .run();

    for (const link of release.links) {
      await db
        .prepare(
          `INSERT INTO release_links (id, release_id, platform, url, verified, manual_override, first_seen_at, last_verified_at)
           VALUES (?, ?, ?, ?, ?, 1, ?, ?)`,
        )
        .bind(link.id, link.releaseId, link.platform, link.url, link.verified ? 1 : 0, link.firstSeenAt, link.lastVerifiedAt ?? null)
        .run();
    }
  }
}

async function discover(env: SyncEnv): Promise<{ discovered: ProviderRelease[]; errors: string[] }> {
  const providers = [
    createAppleMusicProvider(),
    createSpotifyProvider(env.SPOTIFY_CLIENT_ID, env.SPOTIFY_CLIENT_SECRET, env.SPOTIFY_ARTIST_ID),
  ].filter(Boolean);

  const discovered: ProviderRelease[] = [];
  const errors: string[] = [];

  // Cool down Apple after recent rate-limits; skip full refresh when last Apple success is fresh.
  let skipApple = false;
  try {
    const recent = await env.DB.prepare(
      `SELECT status, errors, releases_found, started_at FROM sync_logs ORDER BY started_at DESC LIMIT 8`,
    ).all<{ status: string; errors: string; releases_found: number; started_at: string }>();
    const rows = recent.results ?? [];
    const now = Date.now();
    for (const row of rows) {
      const ageMs = now - Date.parse(row.started_at);
      if (!Number.isFinite(ageMs) || ageMs < 0) continue;
      const errText = row.errors ?? "";
      if (ageMs < 6 * 60 * 60 * 1000 && /apple-music HTTP 429|apple-music HTTP 403/i.test(errText)) {
        skipApple = true;
        errors.push("apple-music: skipped (cooldown after recent 429/403)");
        break;
      }
      if (
        ageMs < 24 * 60 * 60 * 1000 &&
        row.releases_found > 0 &&
        row.status === "ok" &&
        !/apple-music:/i.test(errText)
      ) {
        skipApple = true;
        errors.push("apple-music: skipped (stable data within 24h TTL)");
        break;
      }
    }
  } catch {
    // If log lookup fails, continue with providers as usual.
  }

  for (const provider of providers) {
    if (!provider) continue;
    if (skipApple && provider.name === "apple-music") continue;
    try {
      const items = await provider.findReleases();
      discovered.push(...items);
    } catch (error) {
      errors.push(`${provider.name}: ${error instanceof Error ? error.message : "unknown error"}`);
    }
  }

  return { discovered, errors };
}

async function upsertDiscovered(db: D1Database, discovered: ProviderRelease[]) {
  let created = 0;
  let updated = 0;

  const existingRows = await db.prepare("SELECT * FROM releases").all();
  const existing = (existingRows.results ?? []).map((row) => attachLinks(rowToRelease(row), []));
  const linkRows = await db.prepare("SELECT * FROM release_links").all();
  const linksByRelease = new Map<string, ReleaseLink[]>();
  for (const row of linkRows.results ?? []) {
    const link = rowToLink(row);
    const list = linksByRelease.get(link.releaseId) ?? [];
    list.push(link);
    linksByRelease.set(link.releaseId, list);
  }

  for (const item of discovered) {
    if (!item.title) continue;
    const match = findBestMatch(existing, item);

    const now = new Date().toISOString();
    const classification = classifyRelease({
      title: item.title,
      genres: item.genres,
    });

    if (match) {
      if (match.manualOverride) continue;
      const merged = mergeClassification(match, classification);
      const mergedLinks = mergeLinks(linksByRelease.get(match.id) ?? [], item.links, match.id);

      await db
        .prepare(
          `UPDATE releases SET
            release_date = COALESCE(?, release_date),
            artwork_url = CASE WHEN manual_override = 1 THEN artwork_url WHEN ? != '' THEN ? ELSE artwork_url END,
            spotify_id = COALESCE(?, spotify_id),
            apple_music_id = COALESCE(?, apple_music_id),
            genres = CASE WHEN manual_override = 1 THEN genres WHEN ? != '[]' THEN ? ELSE genres END,
            last_synced_at = ?,
            updated_at = ?
           WHERE id = ?`,
        )
        .bind(
          item.releaseDate ?? null,
          item.artworkUrl ?? "",
          item.artworkUrl ?? "",
          item.spotifyId ?? null,
          item.appleMusicId ?? null,
          JSON.stringify(merged.genres ?? classification.genres),
          JSON.stringify(merged.genres ?? classification.genres),
          now,
          now,
          match.id,
        )
        .run();

      for (const link of mergedLinks) {
        await db
          .prepare(
            `INSERT INTO release_links (id, release_id, platform, url, verified, manual_override, first_seen_at, last_verified_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)
             ON CONFLICT(release_id, platform) DO UPDATE SET
               url = CASE WHEN manual_override = 1 THEN url ELSE excluded.url END,
               last_verified_at = excluded.last_verified_at`,
          )
          .bind(
            link.id,
            link.releaseId,
            link.platform,
            link.url,
            link.verified ? 1 : 0,
            link.manualOverride ? 1 : 0,
            link.firstSeenAt,
            link.lastVerifiedAt ?? null,
          )
          .run();
      }
      updated++;
    } else if (classification.confidence >= 0.75 || item.links.some((l) => l.verified)) {
      const id = `release-${slugFromTitle(item.title)}`;
      const slug = slugFromTitle(item.title);
      await db
        .prepare(
          `INSERT INTO releases (id, slug, title, artist, type, status, release_date, artwork_url, genres, spotify_id, apple_music_id, classification_confidence, first_seen_at, last_synced_at)
           VALUES (?, ?, ?, 'Bossie on the beat', 'single', 'pending_review', ?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .bind(
          id,
          slug,
          item.title,
          item.releaseDate ?? null,
          item.artworkUrl ?? "",
          JSON.stringify(classification.genres),
          item.spotifyId ?? null,
          item.appleMusicId ?? null,
          classification.confidence,
          now,
          now,
        )
        .run();

      for (const link of item.links) {
        await db
          .prepare(
            `INSERT OR IGNORE INTO release_links (id, release_id, platform, url, verified, first_seen_at, last_verified_at)
             VALUES (?, ?, ?, ?, 1, ?, ?)`,
          )
          .bind(`${id}-${link.platform}`, id, link.platform, link.url, now, now)
          .run();
      }
      created++;
    }
  }

  return { created, updated };
}

export async function runReleaseSync(env: SyncEnv): Promise<SyncResult> {
  const started = new Date().toISOString();
  const logId = `sync-${Date.now()}`;
  const errors: string[] = [];

  try {
    await ensureSeed(env.DB);
    const { discovered, errors: providerErrors } = await discover(env);
    errors.push(...providerErrors);

    const { created, updated } = await upsertDiscovered(env.DB, discovered);

    await env.DB
      .prepare(
        `INSERT INTO sync_logs (id, started_at, finished_at, status, releases_found, releases_created, releases_updated, errors)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        logId,
        started,
        new Date().toISOString(),
        providerErrors.length ? "partial" : "ok",
        discovered.length,
        created,
        updated,
        JSON.stringify(errors),
      )
      .run();

    return {
      status: errors.length ? "partial" : "ok",
      releasesFound: discovered.length,
      releasesCreated: created,
      releasesUpdated: updated,
      errors,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "sync failed";
    errors.push(message);
    await env.DB
      .prepare(
        `INSERT INTO sync_logs (id, started_at, finished_at, status, errors) VALUES (?, ?, ?, 'error', ?)`,
      )
      .bind(logId, started, new Date().toISOString(), JSON.stringify(errors))
      .run();
    return { status: "error", releasesFound: 0, releasesCreated: 0, releasesUpdated: 0, errors };
  }
}
