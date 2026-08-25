import type { D1Database, Fetcher } from "@cloudflare/workers-types";

export interface CloudflareEnv {
  DB?: D1Database;
  ASSETS?: Fetcher;
  SITE_URL?: string;
  SYNC_INTERVAL_HOURS?: string;
  SPOTIFY_CLIENT_ID?: string;
  SPOTIFY_CLIENT_SECRET?: string;
  SPOTIFY_ARTIST_ID?: string;
  YOUTUBE_API_KEY?: string;
  YOUTUBE_CHANNEL_ID?: string;
  CRON_SECRET?: string;
}
