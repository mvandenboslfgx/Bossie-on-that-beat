import type { ReleaseWithLinks } from "@/lib/types/release";

/** BOSSIE TRANSMISSION 024 — zero-padded index from newest (live sorted desc). */
export function getTransmissionNumber(live: ReleaseWithLinks[], slug: string): string {
  const idx = live.findIndex((r) => r.slug === slug);
  if (idx < 0) return "000";
  return String(live.length - idx).padStart(3, "0");
}

export function formatWorldLabel(worldSlug?: string): string {
  if (!worldSlug) return "BOSSIE";
  return worldSlug.replace(/-/g, " ").toUpperCase();
}
