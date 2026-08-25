import type { MusicProvider, ProviderRelease } from "@/lib/release-sync/providers/base";
import { isBossieArtist } from "@/lib/release-sync/providers/base";

function highResArtwork(url?: string) {
  if (!url) return undefined;
  return url.replace(/100x100bb/, "1200x1200bb");
}

export function createAppleMusicProvider(): MusicProvider {
  return {
    name: "apple-music",
    async findReleases(): Promise<ProviderRelease[]> {
      const params = new URLSearchParams({
        term: "Bossie on that beat",
        entity: "album",
        limit: "100",
        country: "NL",
      });
      const response = await fetch(`https://itunes.apple.com/search?${params.toString()}`, {
        headers: {
          Accept: "application/json",
          "User-Agent": "BossieReleaseSync/1.0 (+https://bossieonthatbeat.com)",
        },
      });
      if (!response.ok) {
        throw new Error(`apple-music HTTP ${response.status}`);
      }
      const json = (await response.json()) as { results?: Array<Record<string, unknown>> };
      return (json.results ?? [])
        .filter((item) => isBossieArtist(String(item.artistName ?? "")))
        .map((item) => ({
          title: String(item.collectionName ?? ""),
          releaseDate: item.releaseDate ? String(item.releaseDate) : undefined,
          artworkUrl: highResArtwork(item.artworkUrl100 ? String(item.artworkUrl100) : undefined),
          appleMusicId: String(item.collectionId ?? ""),
          genres: item.primaryGenreName ? [String(item.primaryGenreName)] : [],
          links: item.collectionViewUrl
            ? [{ platform: "apple-music" as const, url: String(item.collectionViewUrl), verified: true }]
            : [],
        }));
    },
  };
}

export function createSpotifyProvider(clientId?: string, clientSecret?: string, artistId?: string): MusicProvider | null {
  if (!clientId || !clientSecret || !artistId) return null;

  return {
    name: "spotify",
    async findReleases(): Promise<ProviderRelease[]> {
      try {
        const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
        const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
          method: "POST",
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: "grant_type=client_credentials",
        });
        if (!tokenRes.ok) return [];
        const tokenJson = await tokenRes.json();
        const token = tokenJson?.access_token;
        if (!token) return [];

        const albumsRes = await fetch(
          `https://api.spotify.com/v1/artists/${encodeURIComponent(artistId)}/albums?include_groups=album,single&market=NL&limit=50`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        if (!albumsRes.ok) return [];
        const albumsJson = await albumsRes.json();
        const items = Array.isArray(albumsJson?.items) ? albumsJson.items : [];

        return items.map((item: Record<string, unknown>) => ({
          title: String(item.name ?? ""),
          releaseDate: item.release_date ? String(item.release_date) : undefined,
          artworkUrl: Array.isArray(item.images) && item.images[0]?.url ? String(item.images[0].url) : undefined,
          spotifyId: String(item.id ?? ""),
          links: (item.external_urls as { spotify?: string })?.spotify
            ? [{ platform: "spotify" as const, url: String((item.external_urls as { spotify: string }).spotify), verified: true }]
            : [],
        }));
      } catch {
        return [];
      }
    },
  };
}
