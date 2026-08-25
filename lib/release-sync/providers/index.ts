import type { MusicProvider, ProviderRelease } from "@/lib/release-sync/providers/base";
import { isBossieArtist } from "@/lib/release-sync/providers/base";
import { siteSettings } from "@/lib/site-settings";
import { normalizeReleaseDate } from "@/lib/release-sync/match";

function highResArtwork(url?: string) {
  if (!url) return undefined;
  return url.replace(/100x100bb/, "1200x1200bb");
}

const APPLE_MAX_RETRIES = 2;
const APPLE_MAX_BACKOFF_MS = 8000;

async function fetchAppleSearch(url: string): Promise<Response> {
  let lastResponse: Response | undefined;
  for (let attempt = 0; attempt <= APPLE_MAX_RETRIES; attempt++) {
    lastResponse = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "BossieReleaseSync/1.0 (+https://bossieonthatbeat.com)",
      },
    });
    if (lastResponse.status !== 429 || attempt === APPLE_MAX_RETRIES) {
      return lastResponse;
    }
    const retryAfter = Number(lastResponse.headers.get("Retry-After"));
    const delayMs =
      Number.isFinite(retryAfter) && retryAfter > 0
        ? Math.min(retryAfter * 1000, APPLE_MAX_BACKOFF_MS)
        : Math.min(1000 * 2 ** attempt, APPLE_MAX_BACKOFF_MS);
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
  return lastResponse!;
}

export function createAppleMusicProvider(): MusicProvider {
  return {
    name: "apple-music",
    async findReleases(): Promise<ProviderRelease[]> {
      const params = new URLSearchParams({
        term: "Bossie on that beat",
        entity: "album",
        limit: "50",
        country: "NL",
      });
      const response = await fetchAppleSearch(`https://itunes.apple.com/search?${params.toString()}`);
      if (response.status === 429) {
        throw new Error("apple-music HTTP 429 (rate limited after bounded retry)");
      }
      if (!response.ok) {
        throw new Error(`apple-music HTTP ${response.status}`);
      }
      const json = (await response.json()) as { results?: Array<Record<string, unknown>> };
      return (json.results ?? [])
        .filter((item) => isBossieArtist(String(item.artistName ?? "")))
        .map((item) => ({
          title: String(item.collectionName ?? ""),
          releaseDate: normalizeReleaseDate(item.releaseDate ? String(item.releaseDate) : undefined),
          artworkUrl: highResArtwork(item.artworkUrl100 ? String(item.artworkUrl100) : undefined),
          appleMusicId: String(item.collectionId ?? ""),
          upc: item.upc ? String(item.upc) : undefined,
          genres: item.primaryGenreName ? [String(item.primaryGenreName)] : [],
          links: item.collectionViewUrl
            ? [{ platform: "apple-music" as const, url: String(item.collectionViewUrl), verified: true }]
            : [],
        }));
    },
  };
}

type SpotifyToken = { access_token?: string };
type SpotifyImage = { url?: string };
type SpotifyAlbum = {
  id?: string;
  name?: string;
  release_date?: string;
  images?: SpotifyImage[];
  external_urls?: { spotify?: string };
  external_ids?: { upc?: string; ean?: string };
  artists?: Array<{ id?: string; name?: string }>;
};
type SpotifyAlbumsPage = {
  items?: SpotifyAlbum[];
  next?: string | null;
};
type SpotifyTracksPage = {
  items?: Array<{
    track?: { external_ids?: { isrc?: string }; artists?: Array<{ id?: string; name?: string }> };
    external_ids?: { isrc?: string };
    artists?: Array<{ id?: string; name?: string }>;
  }>;
};

async function spotifyGet<T>(url: string, token: string): Promise<T> {
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error(`spotify HTTP ${response.status}`);
  }
  return (await response.json()) as T;
}

async function fetchAllArtistAlbums(token: string, artistId: string): Promise<SpotifyAlbum[]> {
  const albums: SpotifyAlbum[] = [];
  let url: string | null =
    `https://api.spotify.com/v1/artists/${encodeURIComponent(artistId)}/albums?include_groups=album,single&market=NL&limit=10`;

  while (url) {
    const page: SpotifyAlbumsPage = await spotifyGet<SpotifyAlbumsPage>(url, token);
    for (const item of page.items ?? []) {
      if (!item?.id) continue;
      // Deduplicate by album id (Spotify returns market variants).
      if (albums.some((a) => a.id === item.id)) continue;
      albums.push(item);
    }
    url = page.next ?? null;
  }

  return albums;
}

async function enrichAlbumMeta(token: string, album: SpotifyAlbum): Promise<ProviderRelease | null> {
  if (!album.id || !album.name) return null;

  const artists = album.artists ?? [];
  const artistMatch =
    artists.some((a) => a.id === siteSettings.identities.spotifyArtistId) ||
    artists.some((a) => isBossieArtist(String(a.name ?? "")));
  if (!artistMatch) return null;

  let upc = album.external_ids?.upc ?? album.external_ids?.ean;
  let isrc: string | undefined;

  try {
    const detail = await spotifyGet<SpotifyAlbum & { tracks?: SpotifyTracksPage }>(
      `https://api.spotify.com/v1/albums/${encodeURIComponent(album.id)}?market=NL`,
      token,
    );
    upc = detail.external_ids?.upc ?? detail.external_ids?.ean ?? upc;
    const track = detail.tracks?.items?.[0];
    isrc = track?.external_ids?.isrc ?? track?.track?.external_ids?.isrc;
  } catch {
    // Album list payload is still usable without track enrichment.
  }

  const artwork =
    Array.isArray(album.images) && album.images[0]?.url ? String(album.images[0].url) : undefined;
  const spotifyUrl = album.external_urls?.spotify
    ? String(album.external_urls.spotify)
    : `https://open.spotify.com/album/${album.id}`;

  return {
    title: String(album.name),
    releaseDate: normalizeReleaseDate(album.release_date ? String(album.release_date) : undefined),
    artworkUrl: artwork,
    spotifyId: String(album.id),
    upc: upc ? String(upc) : undefined,
    isrc: isrc ? String(isrc) : undefined,
    links: [{ platform: "spotify", url: spotifyUrl, verified: true }],
  };
}

/**
 * Official Spotify artist sync. Disabled (returns null) until client id/secret exist.
 * Artist ID defaults to the proven Bossie canonical ID in site-settings.
 */
export function createSpotifyProvider(
  clientId?: string,
  clientSecret?: string,
  artistId?: string,
): MusicProvider | null {
  const resolvedArtistId = (artistId || siteSettings.identities.spotifyArtistId || "").trim();
  if (!clientId || !clientSecret || !resolvedArtistId) return null;

  if (resolvedArtistId !== siteSettings.identities.spotifyArtistId) {
    // Allow override only when explicit — still warn via throw on wrong artist later.
  }

  return {
    name: "spotify",
    async findReleases(): Promise<ProviderRelease[]> {
      const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
      const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
      });
      if (!tokenRes.ok) {
        throw new Error(`spotify token HTTP ${tokenRes.status}`);
      }
      const tokenJson = (await tokenRes.json()) as SpotifyToken;
      const token = tokenJson?.access_token;
      if (!token) throw new Error("spotify token missing");

      // Prove artist identity before ingesting catalogue.
      const artist = await spotifyGet<{ id?: string; name?: string }>(
        `https://api.spotify.com/v1/artists/${encodeURIComponent(resolvedArtistId)}`,
        token,
      );
      if (!artist?.id || artist.id !== resolvedArtistId) {
        throw new Error(`spotify artist id mismatch (expected ${resolvedArtistId})`);
      }
      if (!isBossieArtist(String(artist.name ?? ""))) {
        throw new Error(`spotify artist name rejected: ${artist.name ?? "(empty)"}`);
      }

      const albums = await fetchAllArtistAlbums(token, resolvedArtistId);
      const releases: ProviderRelease[] = [];
      for (const album of albums) {
        const mapped = await enrichAlbumMeta(token, album);
        if (mapped) releases.push(mapped);
      }
      return releases;
    },
  };
}
