import type { CinemaItem } from "@/lib/types/cinema";

export const seedCinema: CinemaItem[] = [
  {
    id: "cinema-door",
    slug: "the-door-was-never-closed",
    title: "THE DOOR WAS NEVER CLOSED",
    type: "short-film",
    releaseSlug: "the-door-was-never-closed",
    worldSlug: "the-door",
    youtubeUrl: "https://www.youtube.com/results?search_query=Bossie+on+that+beat+The+Door+Was+Never+Closed",
    description: "Prestige cinematic visual — gothic psychological cinema.",
    durationSeconds: 385,
    featured: true,
  },
  {
    id: "cinema-nims-dai",
    slug: "nims-dai",
    title: "NIMS DAI",
    type: "music-video",
    releaseSlug: "nims-dai",
    worldSlug: "the-mountain",
    youtubeUrl: "https://www.youtube.com/results?search_query=Bossie+on+that+beat+Nims+Dai",
    description: "Mountain tribute visual.",
    featured: true,
  },
  {
    id: "cinema-shorts",
    slug: "bossie-shorts",
    title: "BOSSIE SHORTS",
    type: "short",
    worldSlug: "the-club",
    youtubeUrl: "https://www.youtube.com/results?search_query=Bossie+on+that+beat+shorts",
    description: "Short-form worlds built for vertical discovery.",
  },
];

export function getSeedCinema(slug: string) {
  return seedCinema.find((c) => c.slug === slug);
}

export function getCinemaByCategory(type: CinemaItem["type"]) {
  return seedCinema.filter((c) => c.type === type);
}
