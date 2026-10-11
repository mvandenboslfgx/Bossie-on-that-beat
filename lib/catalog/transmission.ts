import type { ReleaseWithLinks } from "@/lib/types/release";

/** Zero-padded catalogue index, oldest release = 001. */
export function getTransmissionNumber(live: ReleaseWithLinks[], slug: string): string {
  const idx = live.findIndex((r) => r.slug === slug);
  if (idx < 0) return "000";
  return String(live.length - idx).padStart(3, "0");
}

export function formatWorldLabel(worldSlug?: string): string {
  if (!worldSlug) return "BOSSIE";
  return worldSlug.replace(/-/g, " ").toUpperCase();
}
