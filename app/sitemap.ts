import type { MetadataRoute } from "next";
import { getAllReleases, getAllWorlds, getAllCinema, getAllGenres, slugifyGenre } from "@/lib/repository/release-repository";
import { siteSettings } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

const base = siteSettings.siteUrl;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [releases, worlds, cinema, genres] = await Promise.all([
    getAllReleases(),
    getAllWorlds(),
    getAllCinema(),
    getAllGenres(),
  ]);

  const staticRoutes = [
    "",
    "/music",
    "/music/latest",
    "/music/upcoming",
    "/worlds",
    "/cinema",
    "/links",
    "/about",
    "/industry",
    "/request",
    "/epk",
    "/privacy",
    "/go/latest",
  ];

  const publicReleases = releases.filter((r) =>
    ["live", "announced", "upcoming", "archived"].includes(r.status),
  );

  return [
    ...staticRoutes.map((path) => ({
      url: `${base}${path}`,
      lastModified: new Date(),
      changeFrequency: path === "" || path === "/music" ? ("daily" as const) : ("weekly" as const),
      priority: path === "" ? 1 : path === "/music" ? 0.95 : 0.75,
    })),
    ...publicReleases.map((release) => ({
      url: `${base}/music/${release.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: release.status === "live" ? 0.9 : 0.65,
    })),
    ...publicReleases
      .filter((r) => r.status === "live")
      .map((release) => ({
        url: `${base}/go/${release.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.85,
      })),
    ...worlds.map((world) => ({
      url: `${base}/worlds/${world.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...cinema.map((item) => ({
      url: `${base}/cinema/${item.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...genres.map((genre) => ({
      url: `${base}/music/genre/${slugifyGenre(genre)}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
