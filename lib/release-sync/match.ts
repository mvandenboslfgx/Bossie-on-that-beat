export function normalizeTitle(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    // Drop common store suffixes / dual-title noise for matching.
    .replace(/\s*-\s*single\b/g, " ")
    .replace(/\s*\(single\)\b/g, " ")
    .replace(/\s*\[[^\]]*\]\b/g, " ")
    .replace(/\/.+$/, " ") // "Gasolina / Cuba Libre" → "Gasolina"
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function slugFromTitle(title: string) {
  return normalizeTitle(title).replace(/\s+/g, "-").replace(/(^-|-$)/g, "");
}

export function titlesMatch(a: string, b: string) {
  return normalizeTitle(a) === normalizeTitle(b);
}

/** Compare release dates as YYYY-MM-DD even when providers send ISO timestamps. */
export function normalizeReleaseDate(value?: string): string | undefined {
  if (!value) return undefined;
  const match = value.trim().match(/^(\d{4}-\d{2}-\d{2})/);
  return match?.[1];
}

export interface MatchCandidate {
  title: string;
  isrc?: string;
  upc?: string;
  spotifyId?: string;
  appleMusicId?: string;
  releaseDate?: string;
}

export function scoreMatch(existing: MatchCandidate, incoming: MatchCandidate): number {
  if (incoming.isrc && existing.isrc && incoming.isrc === existing.isrc) return 1;
  if (incoming.upc && existing.upc && incoming.upc === existing.upc) return 0.98;
  if (incoming.spotifyId && existing.spotifyId && incoming.spotifyId === existing.spotifyId) return 0.95;
  if (incoming.appleMusicId && existing.appleMusicId && incoming.appleMusicId === existing.appleMusicId) return 0.95;
  if (titlesMatch(existing.title, incoming.title)) {
    const a = normalizeReleaseDate(existing.releaseDate);
    const b = normalizeReleaseDate(incoming.releaseDate);
    if (a && b && a === b) return 0.9;
    return 0.75;
  }
  return 0;
}

export function findBestMatch<T extends MatchCandidate & { id?: string; manualOverride?: boolean }>(
  candidates: T[],
  incoming: MatchCandidate,
  threshold = 0.75,
): T | undefined {
  let best: { item: T; score: number } | undefined;
  for (const item of candidates) {
    const score = scoreMatch(item, incoming);
    if (score >= threshold && (!best || score > best.score)) {
      best = { item, score };
    }
  }
  return best?.item;
}
