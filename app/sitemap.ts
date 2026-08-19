import type { MetadataRoute } from "next";
import { releases } from "../data/catalog";

const base = "https://bossieonthatbeat.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/music", "/worlds", "/cinema", "/about", "/industry", "/request", "/epk", "/privacy"];
  return [
    ...staticRoutes.map((path) => ({
      url: `${base}${path}`,
      lastModified: new Date(),
      changeFrequency: path === "" || path === "/music" ? "daily" as const : "weekly" as const,
      priority: path === "" ? 1 : path === "/music" ? 0.95 : 0.75,
    })),
    ...releases.map((release) => ({
      url: `${base}/music/${release.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: release.status === "live" ? 0.9 : 0.65,
    })),
  ];
}
