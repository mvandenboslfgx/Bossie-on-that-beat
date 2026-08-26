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
  Rap: ["rap", "hip-hop", "hip hop", "drill"],
  World: ["global", "world", "anthem", "world cup", "albania", "nepal", "shqiper"],
  Latin: ["latin", "reggaeton", "gasolina", "club", "cuba"],
  Classical: ["symphony", "classical", "orchestral power"],
  Pop: ["pop", "anthem"],
  Uptempo: ["uptempo", "hardstyle", "200bpm", "obliteration", "earthshaker"],
};

const MOOD_KEYWORDS: Record<string, string[]> = {
  Dark: ["dark", "gothic", "abyss", "noir"],
  Epic: ["epic", "symphony", "storm", "anthem", "monumental"],
  Emotional: ["emotional", "tribute", "remembers", "nepal"],
  Party: ["club", "gasolina", "energy", "party"],
  Cinematic: ["cinematic", "film", "visual", "prestige"],
  Aggressive: ["storm", "metal", "power"],
};

const WORLD_KEYWORDS: Record<string, string[]> = {
  "the-night": ["nachtgeld", "the night", "noir", "accelerates", "no sleep", "nacht"],
  "the-abyss": ["abyss", "crown", "gothic", "cathedral", "metal", "vessel", "seals", "commandments", "ash"],
  "the-club": ["gasolina", "club", "cuba", "party", "reggaeton", "stress"],
  "the-mountain": ["mountain", "nims", "nepal", "remembers", "altitude"],
  "the-door": ["door", "psychological", "memory", "war", "gedachtens"],
  "the-storm": ["storm", "symphony", "orchestral", "earthshaker", "obliteration"],
  "the-streets": ["klaaswaal", "nederland", "nul een", "acht zes", "uitgespeeld", "nooit rust"],
  global: ["world cup", "one world", "one dream", "rise albania", "shqiper", "albania"],
};

const LANGUAGE_HINTS: Record<string, string[]> = {
  Dutch: ["nul", "een", "acht", "zes", "nederland", "klaaswaal", "gedachtens", "nooit", "rust", "stress", "bro", "uitgespeeld", "tot ik"],
  Albanian: ["albania", "shqiper", "rise albania", "shdiperia"],
  English: ["world", "dream", "symphony", "crown", "earthshaker", "obliteration", "vessel", "mountain"],
  Spanish: ["gasolina", "cuba"],
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

  let worldSlug: string | undefined;
  for (const [world, keywords] of Object.entries(WORLD_KEYWORDS)) {
    if (keywords.some((k) => text.includes(k))) {
      worldSlug = world;
      break;
    }
  }

  const languages = new Set<string>(input.languages ?? []);
  for (const [lang, keywords] of Object.entries(LANGUAGE_HINTS)) {
    if (keywords.some((k) => text.includes(k))) languages.add(lang);
  }
  if (!languages.size && /[a-z]/i.test(input.title)) languages.add("English");

  if (genres.has("Metal") && !subgenres.size) subgenres.add("Orchestral Metal");
  if (genres.has("Electronic") && !subgenres.size) subgenres.add("Uptempo");
  if (genres.has("Latin") && !subgenres.size) subgenres.add("Reggaeton");

  let confidence = 0.5;
  if (genres.size) confidence += 0.15;
  if (moods.size) confidence += 0.1;
  if (subgenres.size) confidence += 0.12;
  if (worldSlug) confidence += 0.08;
  if (input.genres?.length) confidence += 0.05;
  confidence = Math.min(confidence, 0.94);

  const shouldPublish = confidence >= siteSettings.sync.confidenceMedium;

  return {
    genres: shouldPublish ? [...genres] : input.genres?.length ? input.genres : [],
    subgenres: shouldPublish ? [...subgenres] : input.subgenres ?? [],
    moods: shouldPublish ? [...moods] : [],
    languages: shouldPublish ? [...languages] : input.languages ?? [],
    vocalTypes: [],
    energy: moods.has("Party") || genres.has("Electronic") ? "high" : moods.has("Emotional") ? "medium" : "medium-high",
    worldSlug: shouldPublish && confidence >= siteSettings.sync.confidenceHigh ? worldSlug : undefined,
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
    languages: incoming.languages.length ? incoming.languages : existing.languages,
    energy: incoming.energy ?? existing.energy,
    worldSlug: incoming.worldSlug ?? existing.worldSlug,
    classificationConfidence: incoming.confidence,
  };
}
