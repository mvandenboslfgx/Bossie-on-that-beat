import type { ReleaseLink, ReleaseWithLinks } from "@/lib/types/release";
import { siteSettings } from "@/lib/site-settings";

function id(slug: string) {
  return `release-${slug}`;
}

function link(releaseId: string, platform: ReleaseLink["platform"], url: string): ReleaseLink {
  const now = new Date().toISOString();
  return {
    id: `${releaseId}-${platform}`,
    releaseId,
    platform,
    url,
    verified: true,
    manualOverride: true,
    firstSeenAt: now,
    lastVerifiedAt: now,
  };
}

const now = "2026-01-01T00:00:00.000Z";

/** Official Apple Music / DistroKid artwork (1200px). */
const art = {
  crown:
    "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/24/9e/40/249e402f-305e-2b06-2d76-5ace0447c80b/artwork.jpg/1200x1200bb.jpg",
  oneWorld:
    "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/6f/95/50/6f9550f4-4ee7-7441-beab-8714a2eeb234/artwork.jpg/1200x1200bb.jpg",
  symphony:
    "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/a4/e3/56/a4e3566a-6c03-9af9-44af-cd2a28d0403a/artwork.jpg/1200x1200bb.jpg",
  nul:
    "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/d3/e5/ee/d3e5eeff-e69f-f97c-67f1-07cf76e027e6/artwork.jpg/1200x1200bb.jpg",
  gasolina:
    "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/65/e1/6b/65e16b42-c1c6-10b1-c4f3-6973efdcdfe1/artwork.jpg/1200x1200bb.jpg",
  nims:
    "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/84/92/04/849204bd-3c69-e8ca-e4c3-7cf98b694efc/artwork.jpg/1200x1200bb.jpg",
} as const;

export const seedReleases: ReleaseWithLinks[] = [
  {
    id: id("crown-of-the-abyss"),
    slug: "crown-of-the-abyss",
    title: "CROWN OF THE ABYSS",
    artist: siteSettings.artistName,
    type: "single",
    status: "live",
    releaseDate: "2026-01-15",
    artworkUrl: art.crown,
    appleMusicId: "6785206018",
    genres: ["Metal", "Cinematic"],
    subgenres: ["Orchestral Metal"],
    moods: ["Epic", "Dark"],
    tagline: "Orchestral metal statement",
    description:
      "Angelic voices collide with subterranean vocals, monumental choirs and cathedral-scale production.",
    story:
      "A dark orchestral metal world built for maximum cinematic impact — destroyed worlds, angelic voices and massive choirs.",
    worldSlug: "the-abyss",
    featured: true,
    priority: 100,
    manualOverride: true,
    firstSeenAt: now,
    lastSyncedAt: now,
    links: [
      link(id("crown-of-the-abyss"), "spotify", "https://open.spotify.com/album/2ZWAT8pIDAZwrTkcbmlBMx"),
      link(id("crown-of-the-abyss"), "apple-music", "https://music.apple.com/nl/album/crown-of-the-abyss-single/6785206018"),
    ],
  },
  {
    id: id("one-world-one-dream"),
    slug: "one-world-one-dream",
    title: "One World One Dream",
    artist: siteSettings.artistName,
    type: "single",
    status: "live",
    releaseDate: "2026-02-01",
    artworkUrl: art.oneWorld,
    appleMusicId: "6785294600",
    genres: ["World", "Pop"],
    subgenres: ["Global Anthem"],
    moods: ["Epic", "Uplifting"],
    tagline: "World Cup Song 2026",
    description: "A global anthem built for stadium-scale emotion and international unity.",
    worldSlug: "global",
    priority: 90,
    manualOverride: true,
    firstSeenAt: now,
    lastSyncedAt: now,
    links: [
      link(
        id("one-world-one-dream"),
        "apple-music",
        "https://music.apple.com/nl/album/one-world-one-dream-world-cup-song-2026-single/6785294600",
      ),
      link(id("one-world-one-dream"), "amazon-music", "https://music.amazon.com/tracks/B0H6SMW3Q2"),
    ],
  },
  {
    id: id("symphony-of-the-storm"),
    slug: "symphony-of-the-storm",
    title: "Symphony Of The Storm",
    artist: siteSettings.artistName,
    type: "single",
    status: "live",
    releaseDate: "2026-02-10",
    artworkUrl: art.symphony,
    appleMusicId: "6787258907",
    genres: ["Cinematic", "Classical"],
    subgenres: ["Orchestral Power"],
    moods: ["Epic", "Aggressive"],
    tagline: "Orchestral power",
    description: "Orchestral power built around storm-scale dynamics and cinematic force.",
    worldSlug: "the-storm",
    priority: 80,
    manualOverride: true,
    firstSeenAt: now,
    lastSyncedAt: now,
    links: [
      link(
        id("symphony-of-the-storm"),
        "apple-music",
        "https://music.apple.com/nl/album/symphony-of-the-storm-single/6787258907",
      ),
      link(id("symphony-of-the-storm"), "amazon-music", "https://music.amazon.in/albums/B0H7NX3MVF"),
    ],
  },
  {
    id: id("nul-een-acht-zes"),
    slug: "nul-een-acht-zes",
    title: "Nul Een Acht Zes",
    artist: siteSettings.artistName,
    type: "single",
    status: "live",
    releaseDate: "2026-02-15",
    artworkUrl: art.nul,
    appleMusicId: "6795139930",
    genres: ["Electronic", "Pop"],
    subgenres: ["Dutch Energy"],
    moods: ["Party", "Aggressive"],
    languages: ["Dutch"],
    tagline: "Dutch club energy",
    description: "High-energy Dutch production with club-ready velocity.",
    worldSlug: "the-streets",
    priority: 70,
    manualOverride: true,
    firstSeenAt: now,
    lastSyncedAt: now,
    links: [
      link(id("nul-een-acht-zes"), "apple-music", "https://music.apple.com/nl/album/nul-een-acht-zes-single/6795139930"),
      link(id("nul-een-acht-zes"), "amazon-music", "https://music.amazon.co.uk/albums/B0H7P9852Q"),
    ],
  },
  {
    id: id("the-door-was-never-closed"),
    slug: "the-door-was-never-closed",
    title: "The Door Was Never Closed",
    artist: siteSettings.artistName,
    type: "single",
    status: "project",
    artworkUrl: "",
    genres: ["Cinematic"],
    subgenres: ["Gothic Psychological Cinema"],
    moods: ["Dark", "Cinematic"],
    tagline: "Prestige cinematic world",
    description:
      "A dark prestige universe of memory, war, ritual, loss and a door that was never meant to keep anything out.",
    story:
      "Prestige gothic cinema meets psychological horror, war-memory fragments, ritual voices and monumental sound design.",
    worldSlug: "the-door",
    manualOverride: true,
    firstSeenAt: now,
    links: [],
  },
  {
    id: id("nims-dai"),
    slug: "nims-dai",
    title: "Nims Dai",
    artist: siteSettings.artistName,
    type: "single",
    status: "project",
    artworkUrl: art.nims,
    appleMusicId: "6797184055",
    genres: ["Cinematic"],
    subgenres: ["Cinematic Tribute"],
    moods: ["Emotional", "Cinematic"],
    tagline: "Cinematic tribute",
    description: "Snow, altitude, remembrance and human scale. A visual world designed to feel larger than the mountain itself.",
    worldSlug: "the-mountain",
    manualOverride: true,
    firstSeenAt: now,
    links: [
      link(id("nims-dai"), "apple-music", "https://music.apple.com/nl/album/the-mountain-remembers-single/6797184055"),
    ],
  },
  {
    id: id("carry-nepal-home"),
    slug: "carry-nepal-home",
    title: "Carry Nepal Home",
    artist: siteSettings.artistName,
    type: "single",
    status: "project",
    artworkUrl: art.nims,
    genres: ["Cinematic"],
    moods: ["Emotional", "Cinematic"],
    tagline: "The Mountain Remembers",
    description: "Emotional cinematic tribute from the mountain world.",
    worldSlug: "the-mountain",
    manualOverride: true,
    firstSeenAt: now,
    links: [],
  },
  {
    id: id("tout-se-payer"),
    slug: "tout-se-payer",
    title: "Tout Se Payer",
    artist: siteSettings.artistName,
    type: "single",
    status: "project",
    artworkUrl: "",
    genres: ["Electronic"],
    subgenres: ["Dark European"],
    moods: ["Dark"],
    languages: ["French"],
    tagline: "French world",
    description: "Dark European atmosphere with noir cinematic tension.",
    worldSlug: "the-night",
    manualOverride: true,
    firstSeenAt: now,
    links: [],
  },
  {
    id: id("gasolina"),
    slug: "gasolina",
    title: "Gasolina",
    artist: siteSettings.artistName,
    type: "single",
    status: "live",
    releaseDate: "2026-08-14",
    announcementDate: "2026-03-01",
    artworkUrl: art.gasolina,
    appleMusicId: "6801632250",
    genres: ["Latin", "Electronic"],
    subgenres: ["Latin / Club"],
    moods: ["Party"],
    tagline: "Global club world",
    description: "Neon, velocity, heat and movement. Built for vertical screens, midnight rooms and replay value.",
    worldSlug: "the-club",
    priority: 95,
    manualOverride: true,
    firstSeenAt: now,
    links: [
      link(id("gasolina"), "apple-music", "https://music.apple.com/nl/album/gasolina-cuba-libre-single/6801632250"),
    ],
  },
];

export function getSeedRelease(slug: string) {
  return seedReleases.find((r) => r.slug === slug);
}
