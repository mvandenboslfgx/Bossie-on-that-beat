import { isVerifiedListenUrl } from "@/lib/links/url";

export const siteSettings = {
  artistName: "Bossie on the beat",
  artistAltName: "Bossie on that beat",
  producerTag: "Bossie on the beat",
  slogan: "EVERY TRACK IS A NEW WORLD",
  domain: "bossieonthatbeat.com",
  siteUrl: "https://bossieonthatbeat.com",
  defaultSeo: {
    title: "Bossie on the beat | Producer, Composer & Artist",
    description:
      "Official website of Bossie on the beat — cinematic, orchestral, metal, electronic, rap and global music. Every track is a new world.",
  },
  /**
   * Canonical provider identities. Env secrets may override at runtime for sync,
   * but UI/profile URLs always come from here (never search URLs).
   */
  identities: {
    spotifyArtistId: "4mNxC22iSgkO0uLp1dL4Fp",
    appleMusicArtistId: "6784857602",
    youtubeChannelId: "" as string,
  },
  /**
   * Single source for all official streaming + social profiles.
   * Empty string = unknown → never render. Search URLs forbidden.
   */
  socials: {
    spotify: "https://open.spotify.com/artist/4mNxC22iSgkO0uLp1dL4Fp",
    appleMusic: "https://music.apple.com/nl/artist/bossie-on-that-beat/6784857602",
    youtube: "https://www.youtube.com/@bossie_on_that_beat",
    youtubeMusic: "",
    tiktok: "",
    instagram: "",
    facebook: "",
    amazonMusic: "",
    deezer: "",
    tidal: "",
    soundcloud: "",
  } as Record<string, string>,
  /** @deprecated Use socials — kept for sync code paths that reference streaming keys. */
  streaming: {
    spotify: "https://open.spotify.com/artist/4mNxC22iSgkO0uLp1dL4Fp",
    appleMusic: "https://music.apple.com/nl/artist/bossie-on-that-beat/6784857602",
  } as Record<string, string>,
  /** @deprecated Use socials */
  social: {
    youtube: "https://www.youtube.com/@bossie_on_that_beat",
  } as Record<string, string>,
  contact: {
    requestPath: "/request",
    industryPath: "/industry",
    epkPath: "/epk",
  },
  sync: {
    intervalHours: 6,
    artistNames: ["bossie on that beat", "bossie on the beat"],
    confidenceHigh: 0.85,
    confidenceMedium: 0.6,
  },
} as const;

export type SiteSettings = typeof siteSettings;

export const platformDisplayNames: Record<string, string> = {
  spotify: "Spotify",
  "apple-music": "Apple Music",
  appleMusic: "Apple Music",
  youtube: "YouTube",
  "youtube-music": "YouTube Music",
  youtubeMusic: "YouTube Music",
  "amazon-music": "Amazon Music",
  amazonMusic: "Amazon Music",
  deezer: "Deezer",
  tidal: "TIDAL",
  qobuz: "Qobuz",
  tiktok: "TikTok",
  instagram: "Instagram",
  facebook: "Facebook",
  soundcloud: "SoundCloud",
};

/** @deprecated Prefer getListenSocials / getFollowSocials from lib/brand/socials */
export function getOfficialProfileEntries(
  group: "streaming" | "social" | "all" = "all",
): Array<{ key: string; href: string; label: string }> {
  const listenKeys = ["spotify", "appleMusic", "youtubeMusic", "amazonMusic", "deezer", "tidal", "soundcloud"];
  const followKeys = ["youtube", "tiktok", "instagram", "facebook"];
  const keys =
    group === "streaming" ? listenKeys : group === "social" ? followKeys : [...listenKeys, ...followKeys];

  const out: Array<{ key: string; href: string; label: string }> = [];
  const seen = new Set<string>();
  for (const key of keys) {
    const href = siteSettings.socials[key];
    if (!href || seen.has(key) || !isVerifiedListenUrl(href)) continue;
    seen.add(key);
    out.push({ key, href, label: platformDisplayNames[key] ?? key });
  }
  return out;
}
