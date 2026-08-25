import { NextResponse } from "next/server";
import { getLiveReleases } from "@/lib/repository/release-repository";
import { isVerifiedListenUrl } from "@/lib/links/url";
import { siteSettings } from "@/lib/site-settings";

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

/**
 * Public catalog reads D1/seed only.
 * Never call Spotify/Apple live on pageview/API GET.
 */
export async function GET() {
  const live = await getLiveReleases();

  const releases: CuratedRelease[] = live.map((release) => {
    const links = Object.fromEntries(
      release.links
        .filter((l) => l.url && isVerifiedListenUrl(l.url))
        .map((l) => [l.platform, l.url]),
    );

    return {
      title: release.title,
      status: "live",
      spotify: links.spotify ?? null,
      appleMusic: links["apple-music"] ?? null,
      amazonMusic: links["amazon-music"] ?? null,
      youtube: links.youtube ?? null,
      artwork: release.artworkUrl || null,
      releaseDate: release.releaseDate ?? null,
    };
  });

  return NextResponse.json(
    {
      artist: siteSettings.artistName,
      releases,
      automatic: true,
      source: "d1",
      refreshedAt: new Date().toISOString(),
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400",
      },
    },
  );
}
