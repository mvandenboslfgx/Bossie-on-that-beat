export type CinemaCategory =
  | "film"
  | "music-video"
  | "official-audio"
  | "visualizer"
  | "lyric-video"
  | "short-film"
  | "short"
  | "teaser"
  | "trailer"
  | "behind-the-scenes";

export interface CinemaItem {
  id: string;
  slug: string;
  /** Provider / YouTube title — never mutate for public display. */
  title: string;
  /** Immutable ingest title when available (falls back to title). */
  providerTitle?: string;
  /** Editorial public title; manual override always wins. */
  displayTitle?: string;
  type: CinemaCategory;
  releaseSlug?: string;
  worldSlug?: string;
  youtubeUrl?: string;
  youtubeVideoId?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  posterUrl?: string;
  /** @deprecated Public UI uses editorialSummary via getPublicCinemaSummary */
  description?: string;
  providerDescriptionRaw?: string;
  editorialSummary?: string;
  durationSeconds?: number;
  publishedAt?: string;
  featured?: boolean;
  /** published = public; pending_review = sync matched with low confidence */
  reviewStatus?: "published" | "pending_review" | "hidden";
  manualOverride?: boolean;
}
