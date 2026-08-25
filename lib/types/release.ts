export type ReleaseStatus =
  | "project"
  | "announced"
  | "upcoming"
  | "live"
  | "archived"
  | "pending_review";

export type ReleaseType = "single" | "ep" | "album" | "soundtrack";

export type StreamingPlatform =
  | "spotify"
  | "apple-music"
  | "youtube"
  | "youtube-music"
  | "amazon-music"
  | "deezer"
  | "tidal"
  | "qobuz"
  | "soundcloud"
  | "audiomack"
  | "anghami"
  | "boomplay"
  | "pandora"
  | "other";

export interface ReleaseCredit {
  role: string;
  name: string;
}

export interface ReleaseSeo {
  title?: string;
  description?: string;
  keywords?: string[];
}

export interface Release {
  id: string;
  slug: string;
  title: string;
  artist: string;
  type: ReleaseType;
  status: ReleaseStatus;
  releaseDate?: string;
  announcementDate?: string;
  isrc?: string;
  upc?: string;
  spotifyId?: string;
  appleMusicId?: string;
  artworkUrl: string;
  heroImageUrl?: string;
  genres: string[];
  subgenres?: string[];
  moods?: string[];
  bpm?: number;
  languages?: string[];
  vocalTypes?: string[];
  explicit?: boolean;
  energy?: string;
  tagline?: string;
  description?: string;
  story?: string;
  worldSlug?: string;
  cinemaIds?: string[];
  lyrics?: string;
  credits?: ReleaseCredit[];
  featured?: boolean;
  priority?: number;
  seo?: ReleaseSeo;
  classificationConfidence?: number;
  manualOverride?: boolean;
  firstSeenAt?: string;
  lastSyncedAt?: string;
}

export interface ReleaseLink {
  id: string;
  releaseId: string;
  platform: StreamingPlatform;
  url: string;
  verified: boolean;
  manualOverride?: boolean;
  firstSeenAt: string;
  lastVerifiedAt?: string;
}

export interface ReleaseWithLinks extends Release {
  links: ReleaseLink[];
}
