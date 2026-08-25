import type { D1Database } from "@cloudflare/workers-types";
import type { CinemaCategory } from "@/lib/types/cinema";
import { normalizeTitle } from "@/lib/release-sync/match";
import { generateCinemaEditorialSummary } from "@/lib/cinema/editorial";
import { siteSettings } from "@/lib/site-settings";
import { isVerifiedListenUrl } from "@/lib/links/url";

export interface CinemaSyncEnv {
  DB: D1Database;
  YOUTUBE_API_KEY?: string;
  YOUTUBE_CHANNEL_ID?: string;
}

export interface CinemaSyncResult {
  found: number;
  created: number;
  updated: number;
  errors: string[];
  providerStatus: "active" | "disabled" | "degraded";
}

type YtSearchItem = {
  id?: { videoId?: string };
  snippet?: {
    title?: string;
    description?: string;
    publishedAt?: string;
    channelId?: string;
    thumbnails?: { high?: { url?: string }; medium?: { url?: string } };
  };
};

type YtVideoItem = {
  id?: string;
  contentDetails?: { duration?: string };
  snippet?: {
    title?: string;
    description?: string;
    publishedAt?: string;
    channelId?: string;
    liveBroadcastContent?: string;
    thumbnails?: { high?: { url?: string }; maxres?: { url?: string } };
  };
};

function parseIsoDuration(value?: string): number | undefined {
  if (!value) return undefined;
  const match = value.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return undefined;
  const hours = Number(match[1] ?? 0);
  const minutes = Number(match[2] ?? 0);
  const seconds = Number(match[3] ?? 0);
  return hours * 3600 + minutes * 60 + seconds;
}

/** Classify YouTube titles into Bossie Cinema categories. */
export function classifyCinemaType(title: string, durationSeconds?: number): CinemaCategory {
  const t = title.toLowerCase();
  if (/\b(official audio)\b/.test(t)) return "official-audio";
  if (/\b(short film|shortfilm)\b/.test(t)) return "short-film";
  if (/\b(lyric\s*video|lyrics?\s*video)\b/.test(t)) return "lyric-video";
  if (/\bvisualizer\b/.test(t)) return "visualizer";
  if (/\b(teaser)\b/.test(t)) return "teaser";
  if (/\b(trailer)\b/.test(t)) return "trailer";
  if (/\b(behind the scenes|bts|making of)\b/.test(t)) return "behind-the-scenes";
  if (/\b(#shorts|shorts)\b/.test(t) || (durationSeconds != null && durationSeconds > 0 && durationSeconds <= 60)) {
    return "short";
  }
  if (/\b(music video|official video|mv)\b/.test(t)) return "music-video";
  if (durationSeconds != null && durationSeconds >= 600) return "short-film";
  return "music-video";
}

function confidenceForMatch(videoTitle: string, releaseTitle: string): number {
  const a = normalizeTitle(videoTitle);
  const b = normalizeTitle(releaseTitle);
  if (!a || !b) return 0;
  if (a === b) return 1;
  if (a.includes(b) || b.includes(a)) return 0.86;
  return 0;
}

async function youtubeGet<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`youtube HTTP ${response.status}`);
  }
  return (await response.json()) as T;
}

/**
 * Official-channel cinema ingest.
 * Disabled until YOUTUBE_API_KEY + YOUTUBE_CHANNEL_ID are set.
 * Never surfaces search URLs. Uncertain release links → pending_review.
 */
export async function runCinemaSync(env: CinemaSyncEnv): Promise<CinemaSyncResult> {
  const apiKey = env.YOUTUBE_API_KEY?.trim();
  const channelId = (env.YOUTUBE_CHANNEL_ID || siteSettings.identities.youtubeChannelId || "").trim();

  if (!apiKey || !channelId) {
    return {
      found: 0,
      created: 0,
      updated: 0,
      errors: ["youtube: disabled (missing YOUTUBE_API_KEY or YOUTUBE_CHANNEL_ID)"],
      providerStatus: "disabled",
    };
  }

  const errors: string[] = [];
  let found = 0;
  let created = 0;
  let updated = 0;

  try {
    const channel = await youtubeGet<{ items?: Array<{ id?: string; snippet?: { title?: string } }> }>(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${encodeURIComponent(channelId)}&key=${encodeURIComponent(apiKey)}`,
    );
    const channelItem = channel.items?.[0];
    if (!channelItem?.id || channelItem.id !== channelId) {
      throw new Error("youtube channel id not found");
    }

    const search = await youtubeGet<{ items?: YtSearchItem[] }>(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${encodeURIComponent(channelId)}&maxResults=50&order=date&type=video&key=${encodeURIComponent(apiKey)}`,
    );

    const videoIds = (search.items ?? [])
      .map((item) => item.id?.videoId)
      .filter((id): id is string => Boolean(id));

    if (!videoIds.length) {
      return { found: 0, created: 0, updated: 0, errors, providerStatus: "active" };
    }

    const details = await youtubeGet<{ items?: YtVideoItem[] }>(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${encodeURIComponent(videoIds.join(","))}&key=${encodeURIComponent(apiKey)}`,
    );

    const releaseRows = await env.DB.prepare("SELECT id, slug, title, world_slug FROM releases").all<{
      id: string;
      slug: string;
      title: string;
      world_slug: string | null;
    }>();
    const releases = (releaseRows.results ?? []).map((r) => ({
      id: r.id,
      slug: r.slug,
      title: r.title,
      worldSlug: r.world_slug ?? undefined,
    }));

    found = details.items?.length ?? 0;
    const now = new Date().toISOString();

    for (const video of details.items ?? []) {
      const videoId = video.id;
      const title = video.snippet?.title?.trim();
      if (!videoId || !title) continue;
      if (video.snippet?.channelId && video.snippet.channelId !== channelId) continue;
      if (video.snippet?.liveBroadcastContent && video.snippet.liveBroadcastContent !== "none") continue;

      const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
      if (!isVerifiedListenUrl(youtubeUrl)) continue;

      const durationSeconds = parseIsoDuration(video.contentDetails?.duration);
      const type = classifyCinemaType(title, durationSeconds);
      const thumbnail =
        video.snippet?.thumbnails?.maxres?.url ||
        video.snippet?.thumbnails?.high?.url ||
        `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

      let bestRelease: (typeof releases)[number] | undefined;
      let bestScore = 0;
      for (const release of releases) {
        const score = confidenceForMatch(title, release.title);
        if (score > bestScore) {
          bestScore = score;
          bestRelease = release;
        }
      }

      const reliable = bestScore >= siteSettings.sync.confidenceHigh;
      const releaseSlug = reliable ? bestRelease?.slug : undefined;
      const worldSlug = reliable ? bestRelease?.worldSlug : undefined;
      const status = reliable ? "published" : "pending_review";
      const slug = `yt-${videoId}`;
      const id = `cinema-${videoId}`;

      const existing = await env.DB.prepare("SELECT id, manual_override FROM cinema_items WHERE youtube_video_id = ? OR slug = ?")
        .bind(videoId, slug)
        .first<{ id: string; manual_override: number }>();

      if (existing?.manual_override) continue;

      const rawDescription = video.snippet?.description ?? null;
      const editorialSummary = generateCinemaEditorialSummary(title, type);

      if (existing) {
        await env.DB
          .prepare(
            `UPDATE cinema_items SET
              title = ?,
              type = ?,
              youtube_url = CASE WHEN manual_override = 1 THEN youtube_url ELSE ? END,
              thumbnail_url = COALESCE(NULLIF(thumbnail_url, ''), ?),
              duration_seconds = COALESCE(duration_seconds, ?),
              published_at = COALESCE(published_at, ?),
              release_slug = CASE WHEN manual_override = 1 THEN release_slug WHEN ? IS NOT NULL THEN ? ELSE release_slug END,
              world_slug = CASE WHEN manual_override = 1 THEN world_slug WHEN ? IS NOT NULL THEN ? ELSE world_slug END,
              review_status = CASE WHEN manual_override = 1 THEN review_status ELSE ? END,
              provider_description_raw = CASE WHEN manual_override = 1 THEN provider_description_raw ELSE ? END,
              editorial_summary = CASE WHEN manual_override = 1 THEN editorial_summary ELSE ? END,
              updated_at = ?
             WHERE id = ?`,
          )
          .bind(
            title,
            type,
            youtubeUrl,
            thumbnail,
            durationSeconds ?? null,
            video.snippet?.publishedAt ?? null,
            releaseSlug ?? null,
            releaseSlug ?? null,
            worldSlug ?? null,
            worldSlug ?? null,
            status,
            rawDescription,
            editorialSummary,
            now,
            existing.id,
          )
          .run();
        updated++;
      } else {
        await env.DB
          .prepare(
            `INSERT INTO cinema_items (
              id, slug, title, type, release_slug, world_slug, youtube_url, youtube_video_id,
              thumbnail_url, description, provider_description_raw, editorial_summary,
              duration_seconds, published_at, featured, review_status, manual_override
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, 0)`,
          )
          .bind(
            id,
            slug,
            title,
            type,
            releaseSlug ?? null,
            worldSlug ?? null,
            youtubeUrl,
            videoId,
            thumbnail,
            editorialSummary,
            rawDescription,
            editorialSummary,
            durationSeconds ?? null,
            video.snippet?.publishedAt ?? null,
            status,
          )
          .run();
        created++;
      }
    }
  } catch (error) {
    errors.push(`youtube: ${error instanceof Error ? error.message : "unknown error"}`);
    return { found, created, updated, errors, providerStatus: "degraded" };
  }

  return { found, created, updated, errors, providerStatus: "active" };
}
