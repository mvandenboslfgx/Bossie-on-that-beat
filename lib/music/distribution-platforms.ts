import { isVerifiedListenUrl } from "@/lib/links/url";
import { siteSettings } from "@/lib/site-settings";

export type DistributionCategory = "streaming" | "social" | "distribution";

export interface DistributionPlatform {
  id: string;
  name: string;
  mark: string;
  category: DistributionCategory;
  href?: string;
}

type SocialKey = keyof typeof siteSettings.socials;

function officialHref(key?: SocialKey): string | undefined {
  if (!key) return undefined;
  const href = siteSettings.socials[key];
  return href && isVerifiedListenUrl(href) ? href : undefined;
}

/**
 * Canonical DistroKid distribution footprint for Bossie on that beat.
 * Keep every enabled store/service here even when an artist-profile URL is not yet confirmed.
 * Unknown direct profile URLs deliberately remain undefined rather than linking to search pages.
 */
export const distributionPlatforms: readonly DistributionPlatform[] = [
  { id: "spotify", name: "Spotify", mark: "SP", category: "streaming", href: officialHref("spotify") },
  { id: "tiktok-bytedance", name: "TikTok & ByteDance", mark: "TT", category: "social", href: officialHref("tiktok") },
  { id: "deezer", name: "Deezer", mark: "DZ", category: "streaming", href: officialHref("deezer") },
  { id: "jiosaavn", name: "JioSaavn", mark: "JS", category: "streaming" },
  { id: "tencent", name: "Tencent", mark: "TC", category: "distribution" },
  { id: "kuack-media", name: "Kuack Media", mark: "KM", category: "distribution" },
  { id: "snapchat", name: "Snapchat", mark: "SC", category: "social" },
  { id: "apple-music", name: "Apple Music", mark: "AM", category: "streaming", href: officialHref("appleMusic") },
  { id: "youtube-music", name: "YouTube Music", mark: "YT", category: "streaming", href: officialHref("youtubeMusic") },
  { id: "tidal", name: "TIDAL", mark: "TD", category: "streaming", href: officialHref("tidal") },
  { id: "boomplay", name: "Boomplay", mark: "BP", category: "streaming" },
  { id: "massive-music", name: "MassiveMusic", mark: "MM", category: "distribution" },
  { id: "adaptr", name: "Adaptr", mark: "AD", category: "distribution" },
  { id: "roblox", name: "Roblox (beta)", mark: "RB", category: "social" },
  { id: "itunes", name: "iTunes", mark: "IT", category: "distribution" },
  { id: "amazon", name: "Amazon Music", mark: "AZ", category: "streaming", href: officialHref("amazonMusic") },
  { id: "iheartradio", name: "iHeartRadio", mark: "IH", category: "streaming" },
  { id: "anghami", name: "Anghami", mark: "AN", category: "streaming" },
  { id: "claro-musica", name: "Claro Música", mark: "CM", category: "streaming" },
  { id: "flo", name: "FLO", mark: "FL", category: "streaming" },
  { id: "instagram-facebook", name: "Instagram & Facebook", mark: "ME", category: "social" },
  { id: "pandora", name: "Pandora", mark: "PA", category: "streaming" },
  { id: "qobuz", name: "Qobuz", mark: "QZ", category: "streaming" },
  { id: "netease", name: "NetEase", mark: "NE", category: "streaming" },
  { id: "joox", name: "JOOX", mark: "JX", category: "streaming" },
  { id: "medianet", name: "MediaNet", mark: "MN", category: "distribution" },
] as const;

export const distributionPlatformCount = distributionPlatforms.length;

export function getDistributionPlatforms(category: DistributionCategory): readonly DistributionPlatform[] {
  return distributionPlatforms.filter((platform) => platform.category === category);
}
