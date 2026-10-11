import type { ReleaseWithLinks } from "@/lib/types/release";
import {
  getAllReleases,
} from "@/lib/repository/release-repository";

/** Single catalog snapshot — all public routes should derive from this. */
export interface CatalogSnapshot {
  live: ReleaseWithLinks[];
  tracks: ReleaseWithLinks[];
  collections: ReleaseWithLinks[];
  trackCount: number;
  upcoming: ReleaseWithLinks[];
  featured: ReleaseWithLinks | undefined;
  latest: ReleaseWithLinks | undefined;
  genres: string[];
  refreshedAt: string;
}

export async function getCatalog(): Promise<CatalogSnapshot> {
  // One database read guarantees every surface renders the same snapshot and
  // avoids the previous 10-query fan-out (release + link queries per helper).
  const all = await getAllReleases();
  const byDateDesc = (a: ReleaseWithLinks, b: ReleaseWithLinks) => {
    const dateDelta = Date.parse(b.releaseDate ?? "1970-01-01") - Date.parse(a.releaseDate ?? "1970-01-01");
    return dateDelta || (b.priority ?? 0) - (a.priority ?? 0);
  };
  const live = all.filter((release) => release.status === "live").sort(byDateDesc);
  const tracks = live.filter((release) => release.type === "track");
  const collections = live.filter((release) => release.type !== "track");
  const trackCount = tracks.length + collections.filter((release) => release.type === "single").length;
  const upcoming = all
    .filter((release) => release.status === "upcoming" || release.status === "announced")
    .sort(byDateDesc);
  const latest = collections[0] ?? tracks[0];
  const featured = live.filter((release) => release.featured).sort(byDateDesc)[0] ?? latest;
  const publicStatuses = new Set(["live", "announced", "upcoming", "archived"]);
  const genres = [
    ...new Set(
      all
        .filter((release) => publicStatuses.has(release.status))
        .flatMap((release) => release.genres),
    ),
  ].sort();

  return {
    live,
    tracks,
    collections,
    trackCount,
    upcoming,
    featured,
    latest,
    genres,
    refreshedAt: new Date().toISOString(),
  };
}

/** Routes that must stay in sync after D1 sync or admin approval. */
export const CATALOG_PATHS = [
  "/",
  "/music",
  "/music/latest",
  "/music/upcoming",
  "/links",
  "/epk",
  "/worlds",
  "/industry",
  "/go/latest",
  "/cinema",
  "/sitemap.xml",
] as const;
