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
    heroImage:
      "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/24/9e/40/249e402f-305e-2b06-2d76-5ace0447c80b/artwork.jpg/1200x1200bb.jpg",
    themes: ["darkness", "choir", "destruction"],
    aesthetic: ["orchestral", "metal", "cathedral"],
    featured: true,
  },
  {
    slug: "the-mountain",
    title: "THE MOUNTAIN",
    subtitle: "The Mountain Remembers",
    description: "Altitude, snow, remembrance and human scale. A cinematic world larger than the peak itself.",
    heroImage:
      "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/84/92/04/849204bd-3c69-e8ca-e4c3-7cf98b694efc/artwork.jpg/1200x1200bb.jpg",
    themes: ["remembrance", "altitude", "tribute"],
    aesthetic: ["snow", "cinematic", "emotional"],
    featured: true,
  },
  {
    slug: "the-club",
    title: "THE CLUB",
    subtitle: "Global Club Energy",
    description: "Heat, velocity, neon and replay energy built for midnight rooms.",
    heroImage:
      "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/65/e1/6b/65e16b42-c1c6-10b1-c4f3-6973efdcdfe1/artwork.jpg/1200x1200bb.jpg",
    themes: ["neon", "velocity", "heat"],
    aesthetic: ["club", "vertical", "global"],
  },
  {
    slug: "the-storm",
    title: "THE STORM",
    subtitle: "Orchestral Power",
    description: "Storm-scale dynamics, cinematic force and monumental sound design.",
    heroImage:
      "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/a4/e3/56/a4e3566a-6c03-9af9-44af-cd2a28d0403a/artwork.jpg/1200x1200bb.jpg",
    themes: ["power", "storm", "orchestral"],
    aesthetic: ["cinematic", "epic"],
  },
  {
    slug: "the-streets",
    title: "THE STREETS",
    subtitle: "Urban Energy",
    description: "City velocity, Dutch energy and street-level impact.",
    heroImage:
      "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/d3/e5/ee/d3e5eeff-e69f-f97c-67f1-07cf76e027e6/artwork.jpg/1200x1200bb.jpg",
    themes: ["city", "energy"],
    aesthetic: ["urban", "modern"],
  },
  {
    slug: "the-night",
    title: "THE NIGHT",
    subtitle: "Dark European Noir",
    description:
      "After hours. Black glass and blue neon. European noir where every transmission arrives after midnight.",
    themes: ["noir", "mystery", "streetlight"],
    aesthetic: ["dark", "european", "cinematic"],
  },
  {
    slug: "global",
    title: "GLOBAL",
    subtitle: "World Anthems",
    description: "Stadium-scale songwriting and international unity.",
    heroImage:
      "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/6f/95/50/6f9550f4-4ee7-7441-beab-8714a2eeb234/artwork.jpg/1200x1200bb.jpg",
    themes: ["unity", "global"],
    aesthetic: ["anthem", "stadium"],
  },
];

export function getSeedWorld(slug: string) {
  return seedWorlds.find((w) => w.slug === slug);
}
