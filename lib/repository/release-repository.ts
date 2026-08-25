import { seedReleases, getSeedRelease } from "@/data/seed/releases";
import { seedWorlds, getSeedWorld } from "@/data/seed/worlds";
import { seedCinema, getSeedCinema } from "@/data/seed/cinema";
import type { Release, ReleaseStatus, ReleaseWithLinks } from "@/lib/types/release";
import type { World } from "@/lib/types/world";
import type { CinemaItem } from "@/lib/types/cinema";
import { attachLinks, getDb, rowToLink, rowToRelease } from "@/lib/db/client";

const PUBLIC_STATUSES: ReleaseStatus[] = ["live", "announced", "upcoming", "archived"];

function sortByReleaseDateDesc(a: Release, b: Release) {
  const aDate = a.releaseDate ? Date.parse(a.releaseDate) : 0;
  const bDate = b.releaseDate ? Date.parse(b.releaseDate) : 0;
  if (bDate !== aDate) return bDate - aDate;
  return (b.priority ?? 0) - (a.priority ?? 0);
}

async function loadFromDb(): Promise<ReleaseWithLinks[] | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const releaseRows = await db.prepare("SELECT * FROM releases ORDER BY release_date DESC").all();
    if (!releaseRows.results?.length) return null;

    const linkRows = await db.prepare("SELECT * FROM release_links").all();
    const linksByRelease = new Map<string, ReturnType<typeof rowToLink>[]>();
    for (const row of linkRows.results ?? []) {
      const link = rowToLink(row);
      const list = linksByRelease.get(link.releaseId) ?? [];
      list.push(link);
      linksByRelease.set(link.releaseId, list);
    }

    return releaseRows.results.map((row) =>
      attachLinks(rowToRelease(row), linksByRelease.get(String(row.id)) ?? []),
    );
  } catch {
    return null;
  }
}

async function getAll(): Promise<ReleaseWithLinks[]> {
  const dbData = await loadFromDb();
  return dbData ?? seedReleases;
}

export async function getAllReleases() {
  return getAll();
}

export async function getPublicReleases() {
  const all = await getAll();
  return all.filter((r) => PUBLIC_STATUSES.includes(r.status));
}

export async function getLiveReleases() {
  const all = await getAll();
  return all.filter((r) => r.status === "live").sort(sortByReleaseDateDesc);
}

export async function getUpcomingReleases() {
  const all = await getAll();
  return all.filter((r) => r.status === "upcoming" || r.status === "announced").sort(sortByReleaseDateDesc);
}

export async function getProjectReleases() {
  const all = await getAll();
  return all.filter((r) => r.status === "project");
}

export async function getReleaseBySlug(slug: string): Promise<ReleaseWithLinks | undefined> {
  const all = await getAll();
  return all.find((r) => r.slug === slug) ?? getSeedRelease(slug);
}

export async function getFeaturedRelease(): Promise<ReleaseWithLinks | undefined> {
  const all = await getAll();
  const featured = all.filter((r) => r.featured && r.status === "live").sort(sortByReleaseDateDesc);
  if (featured.length) return featured[0];
  return getLatestRelease();
}

export async function getLatestRelease(): Promise<ReleaseWithLinks | undefined> {
  const live = await getLiveReleases();
  return live[0];
}

export async function getReleasesByGenre(genre: string) {
  const slug = genre.toLowerCase();
  const all = await getPublicReleases();
  return all.filter(
    (r) =>
      r.genres.some((g) => g.toLowerCase().replace(/\s+/g, "-") === slug) ||
      r.subgenres?.some((g) => g.toLowerCase().replace(/\s+/g, "-") === slug),
  );
}

export async function getReleasesByWorld(worldSlug: string) {
  const all = await getAll();
  return all.filter((r) => r.worldSlug === worldSlug);
}

export async function getAllGenres(): Promise<string[]> {
  const all = await getPublicReleases();
  const genres = new Set<string>();
  for (const r of all) {
    for (const g of r.genres) genres.add(g);
  }
  return [...genres].sort();
}

export async function getAllWorlds(): Promise<World[]> {
  const db = await getDb();
  if (db) {
    try {
      const rows = await db.prepare("SELECT * FROM worlds").all();
      if (rows.results?.length) {
        return rows.results.map((row) => ({
          slug: String(row.slug),
          title: String(row.title),
          subtitle: row.subtitle ? String(row.subtitle) : undefined,
          description: String(row.description),
          heroImage: row.hero_image ? String(row.hero_image) : undefined,
          video: row.video ? String(row.video) : undefined,
          themes: JSON.parse(String(row.themes ?? "[]")),
          aesthetic: JSON.parse(String(row.aesthetic ?? "[]")),
          featured: Boolean(row.featured),
          manualOverride: Boolean(row.manual_override),
        }));
      }
    } catch {
      /* fall through to seed */
    }
  }
  return seedWorlds;
}

export async function getWorldBySlug(slug: string): Promise<World | undefined> {
  const worlds = await getAllWorlds();
  return worlds.find((w) => w.slug === slug) ?? getSeedWorld(slug);
}

export async function getAllCinema(): Promise<CinemaItem[]> {
  const db = await getDb();
  if (db) {
    try {
      const rows = await db.prepare("SELECT * FROM cinema_items ORDER BY published_at DESC").all();
      if (rows.results?.length) {
        return rows.results.map((row) => ({
          id: String(row.id),
          slug: String(row.slug),
          title: String(row.title),
          type: row.type as CinemaItem["type"],
          releaseSlug: row.release_slug ? String(row.release_slug) : undefined,
          worldSlug: row.world_slug ? String(row.world_slug) : undefined,
          youtubeUrl: row.youtube_url ? String(row.youtube_url) : undefined,
          videoUrl: row.video_url ? String(row.video_url) : undefined,
          thumbnailUrl: row.thumbnail_url ? String(row.thumbnail_url) : undefined,
          posterUrl: row.poster_url ? String(row.poster_url) : undefined,
          description: row.description ? String(row.description) : undefined,
          durationSeconds: row.duration_seconds != null ? Number(row.duration_seconds) : undefined,
          publishedAt: row.published_at ? String(row.published_at) : undefined,
          featured: Boolean(row.featured),
        }));
      }
    } catch {
      /* fall through to seed */
    }
  }
  return seedCinema;
}

export async function getCinemaBySlug(slug: string) {
  const items = await getAllCinema();
  return items.find((c) => c.slug === slug) ?? getSeedCinema(slug);
}

export function slugifyGenre(genre: string) {
  return genre.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function getPrimaryListenLink(release: ReleaseWithLinks) {
  const order = ["spotify", "apple-music", "amazon-music", "youtube-music", "youtube"] as const;
  for (const platform of order) {
    const link = release.links.find((l) => l.platform === platform && l.url);
    if (link) return link;
  }
  return release.links[0];
}

export function getWatchLink(release: ReleaseWithLinks) {
  return release.links.find((l) => l.platform === "youtube" && l.url);
}
