import type { CinemaItem } from "@/lib/types/cinema";

/**
 * Seed cinema is optional fallback only.
 * Never publish Cinema without a verified watchable URL.
 */
export const seedCinema: CinemaItem[] = [];

export function getSeedCinema(slug: string) {
  return seedCinema.find((c) => c.slug === slug);
}

export function getCinemaByCategory(type: CinemaItem["type"]) {
  return seedCinema.filter((c) => c.type === type);
}
