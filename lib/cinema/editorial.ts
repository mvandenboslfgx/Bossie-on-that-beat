import type { CinemaCategory, CinemaItem } from "@/lib/types/cinema";

const CATEGORY_LABELS: Record<CinemaCategory | "official-audio", string> = {
  film: "Feature Film",
  "short-film": "Feature Film",
  "music-video": "Music Video",
  "official-audio": "Official Audio",
  "lyric-video": "Lyric Film",
  visualizer: "Visualizer",
  short: "Short",
  teaser: "Teaser",
  trailer: "Trailer",
  "behind-the-scenes": "Behind the Scenes",
};

/** Display order for Cinema hub sections. */
export const CINEMA_SECTION_ORDER: Array<CinemaCategory | "official-audio"> = [
  "short-film",
  "film",
  "music-video",
  "official-audio",
  "lyric-video",
  "visualizer",
  "short",
  "teaser",
  "trailer",
  "behind-the-scenes",
];

export function getCinemaCategoryLabel(type: CinemaCategory): string {
  return CATEGORY_LABELS[type as CinemaCategory] ?? type.replace(/-/g, " ");
}

function stripHashtags(text: string): string {
  return text
    .replace(/#[\w\u0080-\uFFFF]+/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function firstSentence(text: string, max = 140): string {
  const clean = stripHashtags(text);
  const sentence = clean.split(/(?<=[.!?])\s+/)[0]?.trim() ?? clean;
  if (sentence.length <= max) return sentence;
  return `${sentence.slice(0, max - 1).trim()}…`;
}

/** Generate ≤2 line editorial copy from title + category — never expose hashtag blocks. */
export function generateCinemaEditorialSummary(title: string, type: CinemaCategory): string {
  const t = title.toLowerCase();
  const label = getCinemaCategoryLabel(type).toLowerCase();

  if (type === "short") return "A short transmission from the Bossie universe.";
  if (type === "official-audio" || /\bofficial audio\b/i.test(title)) {
    if (/crown|abyss/i.test(t)) return "A descent into Bossie's darkest orchestral world.";
    if (/anthem/i.test(t)) return "The Bossie anthem — official audio transmission.";
    if (/gedacht|duizend/i.test(t)) return "Late-night Dutch energy — official audio.";
    return "Official audio from Bossie on the beat.";
  }
  if (type === "lyric-video" || /\blyric/i.test(t)) {
    return "Lyrics unfold inside a cinematic Bossie visual world.";
  }
  if (type === "music-video" || /\bmusic video\b/i.test(title)) {
    return "Official music video — sound and image as one world.";
  }
  if (/gasolina|club/i.test(t)) return "Global club energy captured on screen.";
  if (/crown|abyss|metal|storm/i.test(t)) return "Dark orchestral metal rendered as moving cinema.";
  if (/mountain|nims|nepal/i.test(t)) return "A cinematic tribute at human scale.";
  if (/world cup|one world/i.test(t)) return "A global anthem brought to visual life.";

  return `Bossie ${label} — every track is a new world.`;
}

export function getPublicCinemaSummary(item: CinemaItem & { editorialSummary?: string; providerDescriptionRaw?: string }): string {
  if (item.editorialSummary?.trim()) return item.editorialSummary.trim();

  const raw = item.providerDescriptionRaw ?? item.description;
  if (raw) {
    const stripped = stripHashtags(raw);
    if (stripped && stripped.length <= 120 && !raw.includes("#")) {
      return firstSentence(stripped, 120);
    }
  }

  return generateCinemaEditorialSummary(item.title, item.type);
}

export function formatCinemaMeta(type: CinemaCategory, durationSeconds?: number): string {
  const label = getCinemaCategoryLabel(type).toUpperCase();
  if (durationSeconds == null) return label;
  const mins = Math.floor(durationSeconds / 60);
  const secs = String(durationSeconds % 60).padStart(2, "0");
  return `${label} · ${mins}:${secs}`;
}
