import type { Release } from "@/lib/types/release";
import { siteSettings } from "@/lib/site-settings";

export interface ClassificationResult {
  genres: string[];
  subgenres: string[];
  moods: string[];
  languages: string[];
  vocalTypes: string[];
  energy?: string;
  explicit?: boolean;
  worldSlug?: string;
  confidence: number;
}

const GENRE_KEYWORDS: Record<string, string[]> = {
  Metal: ["metal", "orchestral metal", "growl", "choir"],
  Cinematic: ["cinematic", "orchestral", "soundtrack", "film", "prestige"],
  Electronic: ["electronic", "edm", "techno", "club", "neon"],
  Rap: ["rap", "hip-hop", "hip hop"],
  World: ["global", "world", "anthem", "world cup"],
  Latin: ["latin", "reggaeton", "gasolina", "club"],
  Classical: ["symphony", "classical", "orchestral power"],
  Pop: ["pop", "anthem"],
};

const MOOD_KEYWORDS: Record<string, string[]> = {
  Dark: ["dark", "gothic", "abyss", "noir"],
  Epic: ["epic", "symphony", "storm", "anthem", "monumental"],
  Emotional: ["emotional", "tribute", "remembers", "nepal"],
  Party: ["club", "gasolina", "energy", "party"],
  Cinematic: ["cinematic", "film", "visual", "prestige"],
  Aggressive: ["storm", "metal", "power"],
};

export function classifyRelease(input: {
  title: string;
  tagline?: string;
  description?: string;
  subgenres?: string[];
  genres?: string[];
  languages?: string[];
}): ClassificationResult {
  const text = [input.title, input.tagline, input.description, ...(input.subgenres ?? []), ...(input.genres ?? [])]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const genres = new Set<string>(input.genres ?? []);
  const subgenres = new Set<string>(input.subgenres ?? []);
  const moods = new Set<string>();

  for (const [genre, keywords] of Object.entries(GENRE_KEYWORDS)) {
    if (keywords.some((k) => text.includes(k))) genres.add(genre);
  }
  for (const [mood, keywords] of Object.entries(MOOD_KEYWORDS)) {
    if (keywords.some((k) => text.includes(k))) moods.add(mood);
  }

  let confidence = 0.5;
  if (genres.size) confidence += 0.15;
  if (moods.size) confidence += 0.1;
  if (input.subgenres?.length) confidence += 0.15;
  confidence = Math.min(confidence, 0.92);

  const shouldPublish = confidence >= siteSettings.sync.confidenceMedium;

  return {
    genres: shouldPublish ? [...genres] : input.genres?.length ? input.genres : [],
    subgenres: shouldPublish ? [...subgenres] : input.subgenres ?? [],
    moods: shouldPublish ? [...moods] : [],
    languages: input.languages ?? [],
    vocalTypes: [],
    energy: moods.has("Party") ? "high" : moods.has("Emotional") ? "medium" : undefined,
    confidence,
  };
}

export function mergeClassification(existing: Release, incoming: ClassificationResult): Partial<Release> {
  if (existing.manualOverride) return {};
  if (incoming.confidence < siteSettings.sync.confidenceMedium) return {};

  return {
    genres: incoming.confidence >= siteSettings.sync.confidenceHigh ? incoming.genres : existing.genres,
    subgenres: incoming.subgenres.length ? incoming.subgenres : existing.subgenres,
    moods: incoming.moods.length ? incoming.moods : existing.moods,
    classificationConfidence: incoming.confidence,
  };
}
