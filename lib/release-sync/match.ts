export function normalizeTitle(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function slugFromTitle(title: string) {
  return title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function titlesMatch(a: string, b: string) {
  return normalizeTitle(a) === normalizeTitle(b);
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
    if (existing.releaseDate && incoming.releaseDate && existing.releaseDate === incoming.releaseDate) return 0.9;
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
