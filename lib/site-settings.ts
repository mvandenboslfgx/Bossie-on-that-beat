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
    /** Proven from Crown of the Abyss album page music:musician meta. */
    spotifyArtistId: "4mNxC22iSgkO0uLp1dL4Fp",
    appleMusicArtistId: "6784857602",
    /** Set when official Bossie YouTube channel ID is confirmed. */
    youtubeChannelId: "" as string,
  },
  /**
   * Only official profile/store URLs. Empty = do not render a button.
   * Search / results URLs are forbidden in production UI.
   */
  streaming: {
    spotify: "https://open.spotify.com/artist/4mNxC22iSgkO0uLp1dL4Fp",
    appleMusic: "https://music.apple.com/nl/artist/bossie-on-that-beat/6784857602",
  } as Record<string, string>,
  social: {
    // Add only verified official profiles. Unknown platforms stay omitted.
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
};

/** Official listen/follow profile entries that pass production URL rules. */
export function getOfficialProfileEntries(
  group: "streaming" | "social" | "all" = "all",
): Array<{ key: string; href: string; label: string }> {
  const bags =
    group === "streaming"
      ? [siteSettings.streaming]
      : group === "social"
        ? [siteSettings.social]
        : [siteSettings.streaming, siteSettings.social];

  const out: Array<{ key: string; href: string; label: string }> = [];
  const seen = new Set<string>();
  for (const bag of bags) {
    for (const [key, href] of Object.entries(bag)) {
      if (!href || seen.has(key)) continue;
      seen.add(key);
      out.push({ key, href, label: platformDisplayNames[key] ?? key });
    }
  }
  return out;
}
