import type { MusicProvider, ProviderRelease } from "@/lib/release-sync/providers/base";
import {
  canonicalizeArtistCredit,
  includesBossieArtist,
  isBossieArtist,
} from "@/lib/release-sync/providers/base";
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
      // Lookup by immutable artist ID and request songs, not collections. The old
      // text search returned only 27 album/single containers while the canonical
      // profile currently contains 42 individual tracks.
      const params = new URLSearchParams({
        id: siteSettings.identities.appleMusicArtistId,
        entity: "song",
        limit: "200",
        country: "NL",
      });
      const response = await fetchAppleSearch(`https://itunes.apple.com/lookup?${params.toString()}`);
      if (response.status === 429) {
        throw new Error("apple-music HTTP 429 (rate limited after bounded retry)");
      }
      if (!response.ok) {
        throw new Error(`apple-music HTTP ${response.status}`);
      }
      const json = (await response.json()) as { results?: Array<Record<string, unknown>> };
      const sourceTracks = (json.results ?? [])
        .filter((item) => {
          if (String(item.wrapperType ?? "") !== "track" || !item.trackName) return false;
          return (
            String(item.artistId ?? "") === siteSettings.identities.appleMusicArtistId ||
            includesBossieArtist(String(item.artistName ?? ""))
          );
        });
      const tracks = sourceTracks.map((item): ProviderRelease => {
          const artist = canonicalizeArtistCredit(String(item.artistName ?? siteSettings.artistName));
          const trackCount = Number(item.trackCount ?? 1);
          return {
          title: String(item.trackName ?? ""),
          artist,
          type: trackCount > 1 ? "track" : "single",
          collectionTitle: item.collectionName ? String(item.collectionName).replace(/\s+-\s+Single$/i, "") : undefined,
          releaseDate: normalizeReleaseDate(item.releaseDate ? String(item.releaseDate) : undefined),
          artworkUrl: highResArtwork(item.artworkUrl100 ? String(item.artworkUrl100) : undefined),
          appleMusicId: String(item.trackId ?? ""),
          genres: item.primaryGenreName ? [String(item.primaryGenreName)] : [],
          credits: [{ role: "Performing artist", name: artist }],
          officialArtist: true,
          links: item.trackViewUrl
            ? [{ platform: "apple-music" as const, url: String(item.trackViewUrl), verified: true }]
            : [],
          };
        });

      const collections = new Map<string, ProviderRelease>();
      for (const item of sourceTracks) {
        const collectionId = String(item.collectionId ?? "");
        const trackCount = Number(item.trackCount ?? 1);
        if (!collectionId || trackCount <= 1 || collections.has(collectionId)) continue;
        const artist = canonicalizeArtistCredit(String(item.artistName ?? siteSettings.artistName));
        const title = String(item.collectionName ?? "").replace(/\s+-\s+Single$/i, "");
        if (!title) continue;
        collections.set(collectionId, {
          title,
          artist,
          type: trackCount <= 6 ? "ep" : "album",
          releaseDate: normalizeReleaseDate(item.releaseDate ? String(item.releaseDate) : undefined),
          artworkUrl: highResArtwork(item.artworkUrl100 ? String(item.artworkUrl100) : undefined),
          appleMusicId: collectionId,
          genres: item.primaryGenreName ? [String(item.primaryGenreName)] : [],
          credits: [{ role: "Performing artist", name: artist }],
          officialArtist: true,
          links: item.collectionViewUrl
            ? [{ platform: "apple-music", url: String(item.collectionViewUrl), verified: true }]
            : [],
        });
      }

      return [...collections.values(), ...tracks];
    },
  };
}

type SpotifyToken = { access_token?: string };
type SpotifyImage = { url?: string };
type SpotifyAlbum = {
  id?: string;
  name?: string;
  album_type?: string;
  album_group?: string;
  total_tracks?: number;
  release_date?: string;
  images?: SpotifyImage[];
  external_urls?: { spotify?: string };
  external_ids?: { upc?: string; ean?: string };
  artists?: Array<{ id?: string; name?: string }>;
};
type SpotifyTrack = {
  id?: string;
  name?: string;
  artists?: Array<{ id?: string; name?: string }>;
  external_urls?: { spotify?: string };
  external_ids?: { isrc?: string };
};
type SpotifyAlbumDetail = SpotifyAlbum & { tracks?: SpotifyTracksPage };
type SpotifyAlbumsPage = {
  items?: SpotifyAlbum[];
  next?: string | null;
};
type SpotifyTracksPage = {
  items?: SpotifyTrack[];
  next?: string | null;
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
    `https://api.spotify.com/v1/artists/${encodeURIComponent(artistId)}/albums?include_groups=album,single,appears_on,compilation&market=NL&limit=50`;

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

function spotifyArtistMatch(artists: SpotifyTrack["artists"], artistId: string) {
  return (artists ?? []).some(
    (artist) => artist.id === artistId || isBossieArtist(String(artist.name ?? "")),
  );
}

async function fetchAlbumDetails(token: string, albums: SpotifyAlbum[]): Promise<SpotifyAlbumDetail[]> {
  const details: SpotifyAlbumDetail[] = [];
  for (let index = 0; index < albums.length; index += 20) {
    const ids = albums.slice(index, index + 20).map((album) => album.id).filter(Boolean).join(",");
    if (!ids) continue;
    const page = await spotifyGet<{ albums?: Array<SpotifyAlbumDetail | null> }>(
      `https://api.spotify.com/v1/albums?ids=${encodeURIComponent(ids)}&market=NL`,
      token,
    );
    details.push(...(page.albums ?? []).filter((album): album is SpotifyAlbumDetail => Boolean(album)));
  }
  return details;
}

async function fetchFullTracks(token: string, trackIds: string[]): Promise<Map<string, SpotifyTrack>> {
  const tracks = new Map<string, SpotifyTrack>();
  for (let index = 0; index < trackIds.length; index += 50) {
    const ids = trackIds.slice(index, index + 50).join(",");
    if (!ids) continue;
    const page = await spotifyGet<{ tracks?: Array<SpotifyTrack | null> }>(
      `https://api.spotify.com/v1/tracks?ids=${encodeURIComponent(ids)}&market=NL`,
      token,
    );
    for (const track of page.tracks ?? []) {
      if (track?.id) tracks.set(track.id, track);
    }
  }
  return tracks;
}

async function mapSpotifyTracks(
  token: string,
  albums: SpotifyAlbum[],
  artistId: string,
): Promise<ProviderRelease[]> {
  const details = await fetchAlbumDetails(token, albums);
  const simplified = details.flatMap((album) => album.tracks?.items ?? []);
  const matchingIds = [
    ...new Set(
      simplified
        .filter((track) => spotifyArtistMatch(track.artists, artistId))
        .map((track) => track.id)
        .filter((id): id is string => Boolean(id)),
    ),
  ];
  const fullTracks = await fetchFullTracks(token, matchingIds);
  const releases = new Map<string, ProviderRelease>();

  for (const album of details) {
    if (!album.id || !album.name) continue;
    const artwork = album.images?.[0]?.url ? String(album.images[0].url) : undefined;
    const totalTracks = Number(album.total_tracks ?? album.tracks?.items?.length ?? 1);
    if (totalTracks > 1 && spotifyArtistMatch(album.artists, artistId)) {
      const artistNames = (album.artists ?? [])
        .map((artist) => canonicalizeArtistCredit(String(artist.name ?? "")))
        .filter(Boolean);
      const artist = artistNames.join(", ") || siteSettings.artistName;
      releases.set(`collection:${album.id}`, {
        title: album.name,
        artist,
        type: totalTracks <= 6 ? "ep" : "album",
        releaseDate: normalizeReleaseDate(album.release_date),
        artworkUrl: artwork,
        spotifyId: album.id,
        upc: album.external_ids?.upc ?? album.external_ids?.ean,
        credits: artistNames.map((name) => ({ role: "Performing artist", name })),
        officialArtist: true,
        links: [{
          platform: "spotify",
          url: album.external_urls?.spotify ?? `https://open.spotify.com/album/${album.id}`,
          verified: true,
        }],
      });
    }
    for (const simplifiedTrack of album.tracks?.items ?? []) {
      if (!simplifiedTrack.id || !spotifyArtistMatch(simplifiedTrack.artists, artistId)) continue;
      const track = fullTracks.get(simplifiedTrack.id) ?? simplifiedTrack;
      if (!track.name) continue;
      const trackId = track.id ?? simplifiedTrack.id;
      const artistNames = (track.artists ?? [])
        .map((artist) => canonicalizeArtistCredit(String(artist.name ?? "")))
        .filter(Boolean);
      const artist = artistNames.join(", ") || siteSettings.artistName;
      releases.set(trackId, {
        title: track.name,
        artist,
        type: totalTracks > 1 ? "track" : "single",
        collectionTitle: album.name,
        releaseDate: normalizeReleaseDate(album.release_date),
        artworkUrl: artwork,
        spotifyId: trackId,
        isrc: track.external_ids?.isrc,
        credits: artistNames.map((name) => ({ role: "Performing artist", name })),
        officialArtist: true,
        links: [
          {
            platform: "spotify",
            url: track.external_urls?.spotify ?? `https://open.spotify.com/track/${trackId}`,
            verified: true,
          },
        ],
      });
    }
  }

  return [...releases.values()];
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
      return mapSpotifyTracks(token, albums, resolvedArtistId);
    },
  };
}
