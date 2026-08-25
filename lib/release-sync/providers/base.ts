import type { ReleaseLink, StreamingPlatform } from "@/lib/types/release";

export interface DiscoveredLink {
  platform: StreamingPlatform;
  url: string;
  verified?: boolean;
}

export interface ProviderRelease {
  title: string;
  releaseDate?: string;
  artworkUrl?: string;
  spotifyId?: string;
  appleMusicId?: string;
  isrc?: string;
  upc?: string;
  genres?: string[];
  links: DiscoveredLink[];
}

export interface MusicProvider {
  name: string;
  findReleases(): Promise<ProviderRelease[]>;
}

const ACCEPTED_ARTISTS = new Set(["bossie on that beat", "bossie on the beat"]);

export function normalizeArtist(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, " ").trim();
}

export function isBossieArtist(value: string) {
  return ACCEPTED_ARTISTS.has(normalizeArtist(value));
}

export function mergeLinks(existing: ReleaseLink[], incoming: DiscoveredLink[], releaseId: string): ReleaseLink[] {
  const map = new Map(existing.map((l) => [l.platform, l]));
  const now = new Date().toISOString();

  for (const item of incoming) {
    if (!item.url) continue;
    const current = map.get(item.platform);
    if (current?.manualOverride) continue;
    map.set(item.platform, {
      id: current?.id ?? `${releaseId}-${item.platform}`,
      releaseId,
      platform: item.platform,
      url: item.url,
      verified: item.verified ?? true,
      manualOverride: current?.manualOverride,
      firstSeenAt: current?.firstSeenAt ?? now,
      lastVerifiedAt: now,
    });
  }

  return [...map.values()];
}
