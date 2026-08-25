import type { World } from "@/lib/types/world";

export const seedWorlds: World[] = [
  {
    slug: "the-door",
    title: "THE DOOR",
    subtitle: "Gothic Psychological Cinema",
    description: "Memory, war, ritual, loss and monumental visual storytelling. A door that was never meant to keep anything out.",
    themes: ["memory", "war", "ritual", "loss"],
    aesthetic: ["gothic", "prestige", "psychological"],
    featured: true,
  },
  {
    slug: "the-abyss",
    title: "THE ABYSS",
    subtitle: "Dark Orchestral Metal",
    description: "Angelic voices, subterranean vocals, massive choirs and destroyed worlds.",
    themes: ["darkness", "choir", "destruction"],
    aesthetic: ["orchestral", "metal", "cathedral"],
    featured: true,
  },
  {
    slug: "the-mountain",
    title: "THE MOUNTAIN",
    subtitle: "The Mountain Remembers",
    description: "Altitude, snow, remembrance and human scale. A cinematic world larger than the peak itself.",
    themes: ["remembrance", "altitude", "tribute"],
    aesthetic: ["snow", "cinematic", "emotional"],
    featured: true,
  },
  {
    slug: "the-club",
    title: "THE CLUB",
    subtitle: "Global Club Energy",
    description: "Heat, velocity, neon and replay energy built for midnight rooms.",
    themes: ["neon", "velocity", "heat"],
    aesthetic: ["club", "vertical", "global"],
  },
  {
    slug: "the-storm",
    title: "THE STORM",
    subtitle: "Orchestral Power",
    description: "Storm-scale dynamics, cinematic force and monumental sound design.",
    themes: ["power", "storm", "orchestral"],
    aesthetic: ["cinematic", "epic"],
  },
  {
    slug: "the-streets",
    title: "THE STREETS",
    subtitle: "Urban Energy",
    description: "City velocity, Dutch energy and street-level impact.",
    themes: ["city", "energy"],
    aesthetic: ["urban", "modern"],
  },
  {
    slug: "the-night",
    title: "THE NIGHT",
    subtitle: "Dark European Noir",
    description: "Noir tension, European darkness and cinematic mystery.",
    themes: ["noir", "mystery"],
    aesthetic: ["dark", "european"],
  },
  {
    slug: "global",
    title: "GLOBAL",
    subtitle: "World Anthems",
    description: "Stadium-scale songwriting and international unity.",
    themes: ["unity", "global"],
    aesthetic: ["anthem", "stadium"],
  },
];

export function getSeedWorld(slug: string) {
  return seedWorlds.find((w) => w.slug === slug);
}
