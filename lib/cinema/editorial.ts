import type { CinemaCategory, CinemaItem } from "@/lib/types/cinema";

const CATEGORY_STRIP =
  /\b(official\s+audio|official\s+lyrics?\s*video|official\s+music\s*video|official\s+video|lyrics?\s*video|lyric\s*film|music\s*video|visualizer|behind\s+the\s+scenes|#?\s*shorts)\b/gi;

const BRAND_STRIP =
  /\b(bossie\s+on\s+th(?:e|at)\s+beat|bossie\s+on\s+that\s+beat|bossie)\b/gi;

const EMOJI_STRIP =
  /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}\u{1F1E0}-\u{1F1FF}]/gu;

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

function stripEmojis(text: string): string {
  return text.replace(EMOJI_STRIP, "").replace(/\s{2,}/g, " ").trim();
}

function cleanSeparators(text: string): string {
  return text
    .replace(/\([^)]*\)/g, " ")
    .replace(/\[[^\]]*]/g, " ")
    .replace(/\s*[|·•/]+\s*/g, " ")
    .replace(/\s*[—–-]+\s*$/g, "")
    .replace(/^\s*[—–-]+\s*/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/**
 * Derive a public cinema title from a raw provider title.
 * Never mutates the provider string — returns a new value.
 * Doubtful cases (nothing meaningful stripped) stay effectively unchanged.
 */
export function normalizeCinemaDisplayTitle(providerTitle: string): string {
  const original = providerTitle.trim();
  if (!original) return original;

  const hasCategoryCue = CATEGORY_STRIP.test(original);
  CATEGORY_STRIP.lastIndex = 0;
  const hasEmoji = EMOJI_STRIP.test(original);
  EMOJI_STRIP.lastIndex = 0;
  const hasPipeBrand = /\|/.test(original) && BRAND_STRIP.test(original);
  BRAND_STRIP.lastIndex = 0;

  if (!hasCategoryCue && !hasEmoji && !hasPipeBrand) {
    return original;
  }

  let working = original;
  let baseline = original;

  // Prefer the lead segment before branding pipes.
  if (working.includes("|")) {
    const lead = working.split("|")[0]?.trim() ?? working;
    if (lead.length >= 3) {
      working = lead;
      baseline = lead;
    }
  }

  working = stripEmojis(working);
  working = working.replace(CATEGORY_STRIP, " ");
  CATEGORY_STRIP.lastIndex = 0;

  const beforeBrand = working;
  working = working.replace(BRAND_STRIP, " ");
  BRAND_STRIP.lastIndex = 0;
  if (beforeBrand !== working) {
    baseline = working;
  }

  working = stripHashtags(working);
  working = cleanSeparators(working);

  // Leading brand separators: "BOSSIE … — TITLE"
  working = working.replace(/^\s*[—–-]+\s*/, "").trim();

  // Trailing subtitle after em dash when left side is the title.
  const dashSplit = working.split(/\s+[—–-]\s+/);
  if (dashSplit.length > 1) {
    const head = dashSplit[0]?.trim() ?? "";
    const tail = dashSplit.slice(1).join(" ");
    if (head.length >= 3 && (CATEGORY_STRIP.test(tail) || BRAND_STRIP.test(head))) {
      // Prefer the non-brand side.
      if (BRAND_STRIP.test(head) && !BRAND_STRIP.test(tail)) {
        working = tail;
      } else if (CATEGORY_STRIP.test(tail)) {
        working = head;
      }
    }
    CATEGORY_STRIP.lastIndex = 0;
    BRAND_STRIP.lastIndex = 0;
  }

  working = working.replace(/\s{2,}/g, " ").trim();
  working = working.replace(/^[\s\-—–:|·•]+|[\s\-—–:|·•]+$/g, "").trim();

  if (working.length < 3) return original;

  const alnumBaseline = stripEmojis(baseline).replace(/[^a-zA-Z0-9]/g, "").length;
  const alnumWorking = working.replace(/[^a-zA-Z0-9]/g, "").length;
  if (alnumBaseline > 0 && alnumWorking / alnumBaseline < 0.2) {
    return original;
  }

  return working.toUpperCase();
}

/** Public cinema title — manual displayTitle always wins; never exposes raw provider junk when normalizable. */
export function getPublicCinemaTitle(
  item: Pick<CinemaItem, "title" | "providerTitle" | "displayTitle" | "manualOverride">,
): string {
  if (item.displayTitle?.trim()) return item.displayTitle.trim();
  const provider = item.providerTitle?.trim() || item.title;
  return normalizeCinemaDisplayTitle(provider);
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
