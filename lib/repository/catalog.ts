import type { ReleaseWithLinks } from "@/lib/types/release";
import {
  getAllGenres,
  getFeaturedRelease,
  getLatestRelease,
  getLiveReleases,
  getUpcomingReleases,
} from "@/lib/repository/release-repository";

/** Single catalog snapshot — all public routes should derive from this. */
export interface CatalogSnapshot {
  live: ReleaseWithLinks[];
  upcoming: ReleaseWithLinks[];
  featured: ReleaseWithLinks | undefined;
  latest: ReleaseWithLinks | undefined;
  genres: string[];
  refreshedAt: string;
}

export async function getCatalog(): Promise<CatalogSnapshot> {
  const [live, upcoming, featured, latest, genres] = await Promise.all([
    getLiveReleases(),
    getUpcomingReleases(),
    getFeaturedRelease(),
    getLatestRelease(),
    getAllGenres(),
  ]);

  return {
    live,
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
  "/go/latest",
  "/cinema",
  "/sitemap.xml",
] as const;
