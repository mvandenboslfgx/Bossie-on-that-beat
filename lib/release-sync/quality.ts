import type { ReleaseWithLinks } from "@/lib/types/release";
import { isVerifiedListenUrl } from "@/lib/links/url";
import { normalizeTitle } from "@/lib/release-sync/match";

export interface ReleaseQualityScore {
  slug: string;
  title: string;
  metadata: number;
  artwork: number;
  spotify: number;
  apple: number;
  youtube: number;
  classification: number;
  world: number;
  overall: number;
  flags: string[];
}

function pct(has: boolean, partial = false) {
  if (has) return 100;
  if (partial) return 50;
  return 0;
}

function linkScore(release: ReleaseWithLinks, platform: string): number {
  const link = release.links.find((l) => l.platform === platform);
  if (!link?.url || !isVerifiedListenUrl(link.url)) return 0;
  return link.verified ? 100 : 70;
}

export function scoreRelease(
  release: ReleaseWithLinks,
  allTitles: string[],
): ReleaseQualityScore {
  const flags: string[] = [];
  const norm = normalizeTitle(release.title);
  const dupes = allTitles.filter((t) => t !== release.title && normalizeTitle(t) === norm);
  if (dupes.length) flags.push("duplicate-title-normalized");
  const near = allTitles.filter(
    (t) =>
      t !== release.title &&
      normalizeTitle(t).includes(norm.slice(0, Math.min(8, norm.length))) &&
      norm.length >= 6,
  );
  if (near.length) flags.push("near-duplicate-title");

  if (!release.releaseDate) flags.push("missing-release-date");
  if (!release.genres?.length) flags.push("missing-genres");
  if (!release.tagline && !release.description) flags.push("missing-seo-copy");
  if (!release.worldSlug) flags.push("missing-world");
  if ((release.classificationConfidence ?? 0) < 0.6) flags.push("low-classification-confidence");

  const metadata =
    (pct(Boolean(release.title)) +
      pct(Boolean(release.artist)) +
      pct(Boolean(release.releaseDate)) +
      pct(Boolean(release.genres?.length)) +
      pct(Boolean(release.tagline || release.description))) /
    5;

  const artwork =
    release.artworkUrl && release.artworkUrl.startsWith("https://") && release.artworkUrl.length > 24
      ? 100
      : release.artworkUrl
        ? 60
        : 0;
  if (artwork < 100) flags.push("weak-artwork");

  const spotify = linkScore(release, "spotify");
  const apple = linkScore(release, "apple-music");
  const youtube = linkScore(release, "youtube");
  if (!spotify) flags.push("missing-spotify-link");

  const classification = Math.round((release.classificationConfidence ?? 0.5) * 100);
  const world = release.worldSlug ? 100 : 0;

  const overall = Math.round(
    metadata * 0.2 +
      artwork * 0.15 +
      spotify * 0.2 +
      apple * 0.1 +
      youtube * 0.1 +
      classification * 0.15 +
      world * 0.1,
  );

  return {
    slug: release.slug,
    title: release.title,
    metadata: Math.round(metadata),
    artwork: Math.round(artwork),
    spotify,
    apple,
    youtube,
    classification,
    world,
    overall,
    flags,
  };
}

export function scoreAllReleases(releases: ReleaseWithLinks[]): ReleaseQualityScore[] {
  const titles = releases.map((r) => r.title);
  return releases.map((r) => scoreRelease(r, titles)).sort((a, b) => a.overall - b.overall);
}
