import type { D1Database } from "@cloudflare/workers-types";
import { seedReleases } from "@/data/seed/releases";
import { classifyRelease, mergeClassification } from "@/lib/release-sync/classify";
import { findBestMatch, slugFromTitle } from "@/lib/release-sync/match";
import { mergeLinks } from "@/lib/release-sync/providers/base";
import { createAppleMusicProvider, createSpotifyProvider } from "@/lib/release-sync/providers";
import type { ProviderRelease } from "@/lib/release-sync/providers/base";
import { rowToLink, rowToRelease, attachLinks } from "@/lib/db/client";
import type { ReleaseLink } from "@/lib/types/release";
import { siteSettings } from "@/lib/site-settings";
import { runCinemaSync } from "@/lib/release-sync/cinema-sync";

export interface SyncEnv {
  DB: D1Database;
  SPOTIFY_CLIENT_ID?: string;
  SPOTIFY_CLIENT_SECRET?: string;
  SPOTIFY_ARTIST_ID?: string;
  YOUTUBE_API_KEY?: string;
  YOUTUBE_CHANNEL_ID?: string;
}

export interface SyncResult {
  status: "ok" | "partial" | "error";
  releasesFound: number;
  releasesCreated: number;
  releasesUpdated: number;
  cinemaFound?: number;
  cinemaCreated?: number;
  cinemaUpdated?: number;
  duplicateSlugs?: number;
  errors: string[];
  providers?: Record<string, "active" | "disabled" | "degraded">;
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

async function countDuplicateSlugs(db: D1Database): Promise<number> {
  const row = await db
    .prepare(`SELECT COUNT(*) as c FROM (SELECT slug FROM releases GROUP BY slug HAVING COUNT(*) > 1)`)
    .first<{ c: number }>();
  return Number(row?.c ?? 0);
}

async function discover(
  env: SyncEnv,
): Promise<{
  discovered: ProviderRelease[];
  errors: string[];
  providers: Record<string, "active" | "disabled" | "degraded">;
}> {
  const providersStatus: Record<string, "active" | "disabled" | "degraded"> = {
    "apple-music": "active",
    spotify: "disabled",
    youtube: "disabled",
  };

  const spotify = createSpotifyProvider(
    env.SPOTIFY_CLIENT_ID,
    env.SPOTIFY_CLIENT_SECRET,
    env.SPOTIFY_ARTIST_ID || siteSettings.identities.spotifyArtistId,
  );
  if (spotify) providersStatus.spotify = "active";

  const providers = [createAppleMusicProvider(), spotify].filter(Boolean);

  const discovered: ProviderRelease[] = [];
  const errors: string[] = [];

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
        providersStatus["apple-music"] = "degraded";
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
      if (provider.name === "apple-music") providersStatus["apple-music"] = "degraded";
      if (provider.name === "spotify") providersStatus.spotify = "degraded";
      errors.push(`${provider.name}: ${error instanceof Error ? error.message : "unknown error"}`);
    }
  }

  return { discovered, errors, providers: providersStatus };
}

/**
 * Manual override wins on conflict, but empty gaps may still be filled:
 * - empty artwork
 * - empty spotify_id / apple_music_id / isrc / upc
 * - missing platform links (unless that link row is manually overridden)
 * Title/story/status/genres stay frozen when manual_override = 1.
 */
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

  const seenIncomingKeys = new Set<string>();

  for (const item of discovered) {
    if (!item.title) continue;
    const dedupeKey = item.spotifyId || item.appleMusicId || `${item.title}|${item.releaseDate ?? ""}`;
    if (seenIncomingKeys.has(dedupeKey)) continue;
    seenIncomingKeys.add(dedupeKey);

    const match = findBestMatch(existing, item);
    const now = new Date().toISOString();
    const classification = classifyRelease({
      title: item.title,
      genres: item.genres,
    });

    if (match) {
      const merged = match.manualOverride ? {} : mergeClassification(match, classification);
      const mergedLinks = mergeLinks(linksByRelease.get(match.id) ?? [], item.links, match.id);
      const fillArtwork = !match.artworkUrl && Boolean(item.artworkUrl);
      const genreJson = JSON.stringify(merged.genres ?? classification.genres);

      await db
        .prepare(
          `UPDATE releases SET
            release_date = COALESCE(release_date, ?),
            artwork_url = CASE
              WHEN artwork_url IS NOT NULL AND artwork_url != '' THEN artwork_url
              WHEN ? != '' THEN ?
              ELSE artwork_url
            END,
            spotify_id = COALESCE(spotify_id, ?),
            apple_music_id = COALESCE(apple_music_id, ?),
            isrc = COALESCE(isrc, ?),
            upc = COALESCE(upc, ?),
            genres = CASE WHEN manual_override = 1 THEN genres WHEN ? != '[]' THEN ? ELSE genres END,
            last_synced_at = ?,
            updated_at = ?
           WHERE id = ?`,
        )
        .bind(
          item.releaseDate ?? null,
          fillArtwork || !match.manualOverride ? item.artworkUrl ?? "" : "",
          fillArtwork || !match.manualOverride ? item.artworkUrl ?? "" : "",
          item.spotifyId ?? null,
          item.appleMusicId ?? null,
          item.isrc ?? null,
          item.upc ?? null,
          genreJson,
          genreJson,
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
               url = CASE WHEN release_links.manual_override = 1 THEN release_links.url ELSE excluded.url END,
               verified = CASE WHEN release_links.manual_override = 1 THEN release_links.verified ELSE excluded.verified END,
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

      // Keep in-memory catalogue current so Apple+Spotify same title in one run does not double-create.
      const idx = existing.findIndex((r) => r.id === match.id);
      if (idx >= 0) {
        existing[idx] = {
          ...existing[idx],
          spotifyId: existing[idx].spotifyId ?? item.spotifyId,
          appleMusicId: existing[idx].appleMusicId ?? item.appleMusicId,
          isrc: existing[idx].isrc ?? item.isrc,
          upc: existing[idx].upc ?? item.upc,
          artworkUrl: existing[idx].artworkUrl || item.artworkUrl || "",
          releaseDate: existing[idx].releaseDate ?? item.releaseDate,
        };
      }
      linksByRelease.set(match.id, mergedLinks);
      updated++;
    } else if (classification.confidence >= 0.75 || item.links.some((l) => l.verified)) {
      const slug = slugFromTitle(item.title);
      const id = `release-${slug}`;

      const insert = await db
        .prepare(
          `INSERT OR IGNORE INTO releases (id, slug, title, artist, type, status, release_date, artwork_url, genres, spotify_id, apple_music_id, isrc, upc, classification_confidence, first_seen_at, last_synced_at)
           VALUES (?, ?, ?, ?, 'single', 'pending_review', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .bind(
          id,
          slug,
          item.title,
          siteSettings.artistName,
          item.releaseDate ?? null,
          item.artworkUrl ?? "",
          JSON.stringify(classification.genres),
          item.spotifyId ?? null,
          item.appleMusicId ?? null,
          item.isrc ?? null,
          item.upc ?? null,
          classification.confidence,
          now,
          now,
        )
        .run();

      if ((insert.meta?.changes ?? 0) > 0) {
        for (const link of item.links) {
          await db
            .prepare(
              `INSERT OR IGNORE INTO release_links (id, release_id, platform, url, verified, first_seen_at, last_verified_at)
               VALUES (?, ?, ?, ?, 1, ?, ?)`,
            )
            .bind(`${id}-${link.platform}`, id, link.platform, link.url, now, now)
            .run();
        }
        existing.push({
          id,
          slug,
          title: item.title,
          artist: siteSettings.artistName,
          type: "single",
          status: "pending_review",
          releaseDate: item.releaseDate,
          artworkUrl: item.artworkUrl ?? "",
          genres: classification.genres,
          spotifyId: item.spotifyId,
          appleMusicId: item.appleMusicId,
          isrc: item.isrc,
          upc: item.upc,
          links: [],
        });
        created++;
      } else {
        // Race / prior insert: treat as update path next providers.
        const prior = existing.find((r) => r.slug === slug || r.id === id);
        if (prior) {
          prior.spotifyId = prior.spotifyId ?? item.spotifyId;
          prior.appleMusicId = prior.appleMusicId ?? item.appleMusicId;
        }
      }
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
    const { discovered, errors: providerErrors, providers } = await discover(env);
    errors.push(...providerErrors);

    const { created, updated } = await upsertDiscovered(env.DB, discovered);

    const cinema = await runCinemaSync(env);
    errors.push(...cinema.errors);
    if (cinema.providerStatus) providers.youtube = cinema.providerStatus;

    const duplicateSlugs = await countDuplicateSlugs(env.DB);

    await env.DB
      .prepare(
        `INSERT INTO sync_logs (id, started_at, finished_at, status, releases_found, releases_created, releases_updated, errors)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        logId,
        started,
        new Date().toISOString(),
        errors.length || duplicateSlugs ? "partial" : "ok",
        discovered.length,
        created,
        updated,
        JSON.stringify(errors),
      )
      .run();

    return {
      status: errors.length || duplicateSlugs ? "partial" : "ok",
      releasesFound: discovered.length,
      releasesCreated: created,
      releasesUpdated: updated,
      cinemaFound: cinema.found,
      cinemaCreated: cinema.created,
      cinemaUpdated: cinema.updated,
      duplicateSlugs,
      errors,
      providers,
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
