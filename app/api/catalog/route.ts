import { NextResponse } from "next/server";

type CuratedRelease = {
  title: string;
  status?: "pre-save" | "live";
  spotify?: string | null;
  hyperfollow?: string | null;
  appleMusic?: string | null;
  amazonMusic?: string | null;
  youtube?: string | null;
  artwork?: string | null;
  releaseDate?: string | null;
};

type AppleAlbum = {
  artistName: string;
  collectionId: number;
  collectionName: string;
  collectionViewUrl?: string;
  artworkUrl100?: string;
  releaseDate?: string;
  primaryGenreName?: string;
  trackCount?: number;
};

const CONTENT_FEED =
  "https://raw.githubusercontent.com/mvandenboslfgx/Bossie-on-that-beat/content/data/releases.json";

const acceptedArtistNames = new Set([
  "bossie on that beat",
  "bossie on the beat",
]);

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function highResArtwork(url?: string) {
  if (!url) return null;
  return url.replace(/100x100bb/, "1200x1200bb");
}

async function getCuratedFeed(): Promise<CuratedRelease[]> {
  try {
    const response = await fetch(CONTENT_FEED, {
      next: { revalidate: 300 },
    });

    if (!response.ok) return [];
    const json = await response.json();
    return Array.isArray(json?.releases) ? json.releases : [];
  } catch {
    return [];
  }
}

async function getAppleCatalog(): Promise<CuratedRelease[]> {
  try {
    const params = new URLSearchParams({
      term: "Bossie on that beat",
      entity: "album",
      limit: "100",
      country: "NL",
    });

    const response = await fetch(`https://itunes.apple.com/search?${params.toString()}`, {
      next: { revalidate: 3600 },
      headers: { Accept: "application/json" },
    });

    if (!response.ok) return [];

    const json = (await response.json()) as { results?: AppleAlbum[] };
    const results = Array.isArray(json.results) ? json.results : [];

    return results
      .filter((item) => acceptedArtistNames.has(normalize(item.artistName)))
      .map((item) => ({
        title: item.collectionName,
        status: "live" as const,
        appleMusic: item.collectionViewUrl ?? null,
        artwork: highResArtwork(item.artworkUrl100),
        releaseDate: item.releaseDate ?? null,
      }));
  } catch {
    return [];
  }
}

async function getSpotifyCatalog(): Promise<CuratedRelease[]> {
  const artistId = process.env.SPOTIFY_ARTIST_ID;
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!artistId || !clientId || !clientSecret) return [];

  try {
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
      cache: "no-store",
    });

    if (!tokenResponse.ok) return [];
    const tokenJson = await tokenResponse.json();
    const token = tokenJson?.access_token;
    if (!token) return [];

    const albumsResponse = await fetch(
      `https://api.spotify.com/v1/artists/${encodeURIComponent(artistId)}/albums?include_groups=album,single&market=NL&limit=50`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      },
    );

    if (!albumsResponse.ok) return [];
    const albumsJson = await albumsResponse.json();
    const items = Array.isArray(albumsJson?.items) ? albumsJson.items : [];

    return items.map((item: any) => ({
      title: item.name,
      status: "live" as const,
      spotify: item.external_urls?.spotify ?? null,
      artwork: item.images?.[0]?.url ?? null,
      releaseDate: item.release_date ?? null,
    }));
  } catch {
    return [];
  }
}

function mergeCatalog(sources: CuratedRelease[][]) {
  const merged = new Map<string, CuratedRelease>();

  for (const source of sources) {
    for (const release of source) {
      if (!release.title) continue;
      const key = normalize(release.title);
      const current = merged.get(key) ?? { title: release.title };
      merged.set(key, {
        ...current,
        ...Object.fromEntries(
          Object.entries(release).filter(([, value]) => value !== null && value !== undefined),
        ),
      });
    }
  }

  return [...merged.values()].sort((a, b) => {
    const aDate = a.releaseDate ? Date.parse(a.releaseDate) : 0;
    const bDate = b.releaseDate ? Date.parse(b.releaseDate) : 0;
    return bDate - aDate;
  });
}

export async function GET() {
  const [curated, apple, spotify] = await Promise.all([
    getCuratedFeed(),
    getAppleCatalog(),
    getSpotifyCatalog(),
  ]);

  const releases = mergeCatalog([apple, spotify, curated]);

  return NextResponse.json(
    {
      artist: "Bossie on that beat",
      releases,
      automatic: true,
      refreshedAt: new Date().toISOString(),
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400",
      },
    },
  );
}
