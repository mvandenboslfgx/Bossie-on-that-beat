import type { D1Database, Fetcher } from "@cloudflare/workers-types";
import type { Release, ReleaseLink, ReleaseWithLinks } from "@/lib/types/release";
import type { CloudflareEnv } from "@/lib/cloudflare-env";
import { getSeedRelease } from "@/data/seed/releases";
import { isVerifiedListenUrl } from "@/lib/links/url";

export type { CloudflareEnv as CloudflareBindings };

export type DbRow = Record<string, unknown>;

export function parseJson<T>(value: unknown, fallback: T): T {
  if (typeof value !== "string" || !value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function rowToRelease(row: DbRow): Release {
  return {
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title),
    artist: String(row.artist),
    type: row.type as Release["type"],
    status: row.status as Release["status"],
    releaseDate: row.release_date ? String(row.release_date) : undefined,
    announcementDate: row.announcement_date ? String(row.announcement_date) : undefined,
    isrc: row.isrc ? String(row.isrc) : undefined,
    upc: row.upc ? String(row.upc) : undefined,
    spotifyId: row.spotify_id ? String(row.spotify_id) : undefined,
    appleMusicId: row.apple_music_id ? String(row.apple_music_id) : undefined,
    artworkUrl: String(row.artwork_url ?? ""),
    heroImageUrl: row.hero_image_url ? String(row.hero_image_url) : undefined,
    genres: parseJson<string[]>(row.genres, []),
    subgenres: parseJson<string[]>(row.subgenres, []),
    moods: parseJson<string[]>(row.moods, []),
    languages: parseJson<string[]>(row.languages, []),
    vocalTypes: parseJson<string[]>(row.vocal_types, []),
    explicit: Boolean(row.explicit),
    energy: row.energy ? String(row.energy) : undefined,
    tagline: row.tagline ? String(row.tagline) : undefined,
    description: row.description ? String(row.description) : undefined,
    story: row.story ? String(row.story) : undefined,
    worldSlug: row.world_slug ? String(row.world_slug) : undefined,
    cinemaIds: parseJson<string[]>(row.cinema_ids, []),
    lyrics: row.lyrics ? String(row.lyrics) : undefined,
    credits: parseJson(row.credits, []),
    featured: Boolean(row.featured),
    priority: Number(row.priority ?? 0),
    seo: parseJson(row.seo, {}),
    classificationConfidence: row.classification_confidence != null ? Number(row.classification_confidence) : undefined,
    manualOverride: Boolean(row.manual_override),
    firstSeenAt: row.first_seen_at ? String(row.first_seen_at) : undefined,
    lastSyncedAt: row.last_synced_at ? String(row.last_synced_at) : undefined,
  };
}

export function rowToLink(row: DbRow): ReleaseLink {
  return {
    id: String(row.id),
    releaseId: String(row.release_id),
    platform: row.platform as ReleaseLink["platform"],
    url: String(row.url),
    verified: Boolean(row.verified),
    manualOverride: Boolean(row.manual_override),
    firstSeenAt: String(row.first_seen_at),
    lastVerifiedAt: row.last_verified_at ? String(row.last_verified_at) : undefined,
  };
}

export function attachLinks(release: Release, links: ReleaseLink[]): ReleaseWithLinks {
  const seed = getSeedRelease(release.slug);
  const artworkUrl =
    release.artworkUrl && isVerifiedListenUrl(release.artworkUrl)
      ? release.artworkUrl
      : seed?.artworkUrl && isVerifiedListenUrl(seed.artworkUrl)
        ? seed.artworkUrl
        : release.artworkUrl;
  const filtered = links.filter((l) => l.url && isVerifiedListenUrl(l.url));
  const merged =
    filtered.length > 0
      ? filtered
      : (seed?.links ?? []).filter((l) => l.url && isVerifiedListenUrl(l.url));
  return {
    ...release,
    artworkUrl,
    appleMusicId: release.appleMusicId ?? seed?.appleMusicId,
    description: release.description || seed?.description,
    story: release.story || seed?.story,
    tagline: release.tagline || seed?.tagline,
    links: merged,
  };
}

export async function getDb(): Promise<D1Database | null> {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const ctx = await getCloudflareContext({ async: true });
    return (ctx.env as CloudflareEnv).DB ?? null;
  } catch {
    return null;
  }
}
