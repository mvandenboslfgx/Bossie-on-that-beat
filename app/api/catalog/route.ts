import { NextResponse } from "next/server";
import { getCatalog } from "@/lib/repository/catalog";
import { isVerifiedListenUrl } from "@/lib/links/url";
import { siteSettings } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

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
  const { live, refreshedAt } = await getCatalog();

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
      refreshedAt,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    },
  );
}
