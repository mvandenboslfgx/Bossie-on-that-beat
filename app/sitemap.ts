import type { MetadataRoute } from "next";
import { getAllReleases, getAllWorlds, getAllCinema, slugifyGenre } from "@/lib/repository/release-repository";
import { siteSettings } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

const base = siteSettings.siteUrl;

// Provider timestamps may be absent or malformed. Do not let them break the XML sitemap.
function safeDate(value: string | undefined | null): Date | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? date : undefined;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [releases, worlds, cinema] = await Promise.all([
    getAllReleases(),
    getAllWorlds(),
    getAllCinema(),
  ]);
  const publicReleases = releases.filter((release) =>
    ["live", "announced", "upcoming", "archived"].includes(release.status),
  );
  const genres = [...new Set(publicReleases.flatMap((release) => release.genres))].sort();
  const genreLastModified = new Map(
    genres.map((genre) => {
      const timestamps = publicReleases
        .filter((release) => release.genres.includes(genre) || release.subgenres?.includes(genre))
        .map((release) => release.lastSyncedAt ?? release.releaseDate)
        .filter((value): value is string => Boolean(value))
        .map((value) => Date.parse(value))
        .filter(Number.isFinite);
      return [genre, timestamps.length ? new Date(Math.max(...timestamps)) : undefined] as const;
    }),
  );

  const staticRoutes = [
    "",
    "/music",
    "/music/upcoming",
    "/worlds",
    "/cinema",
    "/links",
    "/about",
    "/industry",
    "/request",
    "/epk",
    "/privacy",
  ];

  return [
    ...staticRoutes.map((path) => ({
      url: `${base}${path}`,
      changeFrequency: path === "" || path === "/music" ? ("daily" as const) : ("weekly" as const),
      priority: path === "" ? 1 : path === "/music" ? 0.95 : 0.75,
    })),
    ...publicReleases.map((release) => ({
      url: `${base}/music/${release.slug}`,
      ...(safeDate(release.lastSyncedAt) || safeDate(release.releaseDate)
        ? { lastModified: safeDate(release.lastSyncedAt) ?? safeDate(release.releaseDate) }
        : {}),
      changeFrequency: "weekly" as const,
      priority: release.status === "live" ? 0.9 : 0.65,
    })),
    ...worlds.map((world) => ({
      url: `${base}/worlds/${world.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...cinema.map((item) => ({
      url: `${base}/cinema/${item.slug}`,
      ...(safeDate(item.publishedAt) ? { lastModified: safeDate(item.publishedAt) } : {}),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...genres.map((genre) => ({
      url: `${base}/music/genre/${slugifyGenre(genre)}`,
      ...(genreLastModified.get(genre) ? { lastModified: genreLastModified.get(genre) } : {}),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
