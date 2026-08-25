import type { ProviderRelease } from "@/lib/release-sync/providers/base";
import type { ClassificationResult } from "@/lib/release-sync/classify";
import { normalizeReleaseDate } from "@/lib/release-sync/match";
import type { ReleaseSeo, ReleaseStatus } from "@/lib/types/release";
import { siteSettings } from "@/lib/site-settings";

export function isReleaseDateReached(releaseDate?: string): boolean {
  const normalized = normalizeReleaseDate(releaseDate);
  if (!normalized) return true;
  const today = new Date().toISOString().slice(0, 10);
  return normalized <= today;
}

export function isReleaseDateFuture(releaseDate?: string): boolean {
  const normalized = normalizeReleaseDate(releaseDate);
  if (!normalized) return false;
  const today = new Date().toISOString().slice(0, 10);
  return normalized > today;
}

function hasVerifiedSpotify(item: ProviderRelease): boolean {
  return Boolean(item.spotifyId) && item.links.some((l) => l.platform === "spotify" && l.verified);
}

/**
 * Official Spotify ingest from canonical artist → auto public when release date reached.
 * Uncertain matches stay pending_review for the admin queue.
 */
export function resolveIngestStatus(input: {
  item: ProviderRelease;
  classification: ClassificationResult;
  matchScore?: number;
  ambiguousMatch?: boolean;
}): ReleaseStatus {
  const { item, classification, matchScore, ambiguousMatch } = input;
  const spotifyOfficial = hasVerifiedSpotify(item);
  const verifiedLink = item.links.some((l) => l.verified);
  const dateReached = isReleaseDateReached(item.releaseDate);
  const dateFuture = isReleaseDateFuture(item.releaseDate);

  if (ambiguousMatch) return "pending_review";
  if (matchScore !== undefined && matchScore >= 0.75 && matchScore < 0.9 && !item.spotifyId && !item.isrc && !item.upc) {
    return "pending_review";
  }

  if (spotifyOfficial) {
    if (dateFuture) return "upcoming";
    if (dateReached) return "live";
  }

  if (
    verifiedLink &&
    classification.confidence >= siteSettings.sync.confidenceHigh &&
    dateReached &&
    !dateFuture
  ) {
    return "live";
  }

  if (verifiedLink && classification.confidence >= siteSettings.sync.confidenceMedium) {
    return "pending_review";
  }

  return "pending_review";
}

export function buildReleaseSeo(title: string, classification: ClassificationResult): ReleaseSeo {
  const genreLine = classification.genres.length ? classification.genres.join(", ") : "official music";
  const moodLine = classification.moods.length ? ` ${classification.moods.join(", ")} energy.` : "";
  return {
    title: `${title} | ${siteSettings.artistName}`,
    description: `Listen to ${title} by ${siteSettings.artistName} — ${genreLine}.${moodLine} Stream on Spotify, Apple Music and more.`,
    keywords: [...classification.genres, ...classification.subgenres, siteSettings.artistName],
  };
}

export function buildTagline(title: string, classification: ClassificationResult): string {
  if (classification.moods.includes("Epic")) return "Monumental cinematic energy from Bossie on the beat.";
  if (classification.moods.includes("Party")) return "High-velocity club energy built for replay.";
  if (classification.moods.includes("Dark")) return "Dark orchestral power from the Bossie universe.";
  if (classification.worldSlug === "the-mountain") return "A cinematic tribute world of altitude and remembrance.";
  return `Official release: ${title}.`;
}
