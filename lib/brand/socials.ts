import { isVerifiedListenUrl } from "@/lib/links/url";
import { platformDisplayNames, siteSettings } from "@/lib/site-settings";

export type SocialKey = keyof typeof siteSettings.socials;

export interface SocialEntry {
  key: SocialKey;
  href: string;
  label: string;
}

function verifiedEntries(keys: SocialKey[]): SocialEntry[] {
  return keys
    .map((key) => {
      const href = siteSettings.socials[key];
      if (!href || !isVerifiedListenUrl(href)) return null;
      return { key, href, label: platformDisplayNames[key] ?? key };
    })
    .filter((e): e is SocialEntry => e !== null);
}

/** Spotify, Apple Music, YouTube Music, Amazon, Deezer, TIDAL — listen profiles only. */
export function getListenSocials(): SocialEntry[] {
  return verifiedEntries([
    "spotify",
    "appleMusic",
    "youtubeMusic",
    "amazonMusic",
    "deezer",
    "tidal",
    "soundcloud",
  ]);
}

/** YouTube, TikTok, Instagram, Facebook — follow profiles. */
export function getFollowSocials(): SocialEntry[] {
  return verifiedEntries(["youtube", "tiktok", "instagram", "facebook"]);
}

/** All verified profile URLs for JSON-LD sameAs + schema. */
export function getSameAsUrls(): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const href of Object.values(siteSettings.socials)) {
    if (!href || !isVerifiedListenUrl(href) || seen.has(href)) continue;
    seen.add(href);
    out.push(href);
  }
  out.push(siteSettings.siteUrl);
  return out;
}

/** Compact header strip — max 4 follow/listen links. */
export function getHeaderSocials(): SocialEntry[] {
  const preferred: SocialKey[] = ["spotify", "youtube", "instagram", "tiktok"];
  const found = verifiedEntries(preferred);
  if (found.length >= 2) return found.slice(0, 4);
  return [...getListenSocials(), ...getFollowSocials()].slice(0, 4);
}
