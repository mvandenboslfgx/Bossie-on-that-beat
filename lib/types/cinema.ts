export type CinemaCategory =
  | "film"
  | "music-video"
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
  title: string;
  type: CinemaCategory;
  releaseSlug?: string;
  worldSlug?: string;
  youtubeUrl?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  posterUrl?: string;
  description?: string;
  durationSeconds?: number;
  publishedAt?: string;
  featured?: boolean;
}
