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
  streaming: {
    spotify: "https://open.spotify.com/search/Bossie%20on%20that%20beat",
    appleMusic: "https://music.apple.com/us/search?term=Bossie%20on%20that%20beat",
    youtube: "https://www.youtube.com/results?search_query=Bossie+on+that+beat",
    youtubeMusic: "https://music.youtube.com/search?q=Bossie+on+that+beat",
    amazonMusic: "https://music.amazon.com/tracks/B0H6SMW3Q2",
  },
  social: {
    tiktok: "https://www.tiktok.com/search?q=Bossie%20on%20that%20beat",
    instagram: "https://www.instagram.com/explore/search/keyword/?q=bossie%20on%20that%20beat",
    youtube: "https://www.youtube.com/results?search_query=Bossie+on+that+beat",
    facebook: "https://www.facebook.com/search/top?q=bossie%20on%20that%20beat",
  },
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
