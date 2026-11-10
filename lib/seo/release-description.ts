import type { Release } from "@/lib/types/release";

/**
 * Search previews should describe the individual release, never duplicate
 * boilerplate across all tracks or overflow into paragraph-length snippets.
 * Keep authored SEO descriptions when available.
 */
export function getReleaseSearchDescription(
  release: Pick<Release, "title" | "artist" | "type" | "description" | "tagline" | "seo">,
): string {
  const description = release.seo?.description?.trim();
  const detail = release.tagline?.trim() || release.description?.trim();
  const kind = release.type === "ep" ? "EP" : release.type === "album" ? "album" : "release";
  const fallback = `${release.title} by ${release.artist}. ${detail ? `${detail} ` : ""}Explore this official ${kind} and its listening links.`;
  const compact = (description || fallback).replace(/[\t\n\r ]+/g, " ").trim();
  if (compact.length <= 165) return compact;
  const fragment = compact.slice(0, 162);
  const lastSpace = fragment.lastIndexOf(" ");
  return `${fragment.slice(0, lastSpace > 125 ? lastSpace : 162).trimEnd()}…`;
}
