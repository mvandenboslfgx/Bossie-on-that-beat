import type { CinemaItem } from "@/lib/types/cinema";

/** Official DistroKid / Apple artwork used as cinema stills until verified YouTube IDs exist. */
const stills = {
  door: "",
  mountain:
    "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/84/92/04/849204bd-3c69-e8ca-e4c3-7cf98b694efc/artwork.jpg/1200x1200bb.jpg",
  club:
    "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/65/e1/6b/65e16b42-c1c6-10b1-c4f3-6973efdcdfe1/artwork.jpg/1200x1200bb.jpg",
} as const;

export const seedCinema: CinemaItem[] = [
  {
    id: "cinema-door",
    slug: "the-door-was-never-closed",
    title: "THE DOOR WAS NEVER CLOSED",
    type: "short-film",
    releaseSlug: "the-door-was-never-closed",
    worldSlug: "the-door",
    thumbnailUrl: stills.door || undefined,
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
    thumbnailUrl: stills.mountain,
    description: "Mountain tribute visual.",
    featured: true,
  },
  {
    id: "cinema-shorts",
    slug: "bossie-shorts",
    title: "BOSSIE SHORTS",
    type: "short",
    worldSlug: "the-club",
    thumbnailUrl: stills.club,
    description: "Short-form worlds built for vertical discovery.",
  },
];

export function getSeedCinema(slug: string) {
  return seedCinema.find((c) => c.slug === slug);
}

export function getCinemaByCategory(type: CinemaItem["type"]) {
  return seedCinema.filter((c) => c.type === type);
}
