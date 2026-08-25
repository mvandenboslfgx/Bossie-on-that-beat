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
  /** Only official profile/store URLs. Search URLs are forbidden in production UI. */
  streaming: {
    appleMusic: "https://music.apple.com/nl/artist/bossie-on-that-beat/6784857602",
  } as Record<string, string>,
  social: {} as Record<string, string>,
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
