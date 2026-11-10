import type { Metadata } from "next";
import Link from "next/link";
import { getCatalog } from "@/lib/repository/catalog";
import { getPrimaryListenLink } from "@/lib/repository/release-repository";
import { MusicDiscovery, type MusicDiscoveryItem } from "@/components/music/MusicDiscovery";
import { PageShell } from "@/components/SiteChrome";
import { CatalogProof } from "@/components/v3/BossieV3";
import { TrackCatalog } from "@/components/release/TrackCatalog";
import { PlatformAvailability } from "@/components/music/PlatformAvailability";
import { getOfficialProfileEntries } from "@/lib/site-settings";
import { isVerifiedListenUrl } from "@/lib/links/url";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Listen to Music | Bossie Official Releases",
  description:
    "Explore the original music of Bossie on that beat. Listen to verified releases, browse genres, find streaming links and explore the complete official discography.",
  alternates: { canonical: "/music" },
};

export default async function MusicPage() {
  const catalog = await getCatalog();
  const { live, trackCount, upcoming, refreshedAt, latest } = catalog;
  // Every published track should be discoverable in the same catalogue;
  // do not silently hide individual recordings when an album or EP exists.
  const published = live;
  const discoveryItems: MusicDiscoveryItem[] = published.map((release) => ({
    id: release.id,
    slug: release.slug,
    title: release.title,
    type: release.type,
    year: release.releaseDate?.slice(0, 4) ?? null,
    genres: release.genres,
    artworkUrl: release.artworkUrl && isVerifiedListenUrl(release.artworkUrl) ? release.artworkUrl : null,
    canListen: Boolean(getPrimaryListenLink(release)),
  }));
  const official = getOfficialProfileEntries("streaming").filter((entry) => isVerifiedListenUrl(entry.href));

  return (
    <PageShell>
      <div className="studio-music-page">
        <CatalogProof refreshedAt={refreshedAt} liveCount={live.length} latestSlug={latest?.slug} />
        <header className="studio-music-header section-pad">
          <div>
            <p className="studio-kicker">OFFICIAL BOSSIE MUSIC CATALOGUE</p>
            <h1>Find a world.<br /><em>Press play.</em></h1>
            <p>
              Cinematic sound, club energy, metal and everything in between. Discover Bossie’s original releases,
              explore the artwork and open verified links to listen on your favourite platform.
            </p>
            <div className="studio-music-header-actions">
              <Link className="studio-btn studio-btn-primary" href="#latest-releases">Browse releases ↓</Link>
              <Link className="studio-btn studio-btn-outline" href="/request?type=custom">Want your own song? ↗</Link>
            </div>
          </div>
          <div className="studio-music-count">
            <strong>{trackCount}</strong>
            <span>VERIFIED TRACKS</span>
            <p>Original Bossie music in one official archive.</p>
          </div>
        </header>

        <section id="latest-releases" className="studio-music-featured section-pad" aria-label="Search and discover official releases">
          <MusicDiscovery releases={discoveryItems} />
        </section>

        <section className="studio-music-archive section-pad" aria-labelledby="complete-track-title">
          <div className="studio-section-top">
            <div><p className="studio-kicker">COMPLETE DISCOGRAPHY</p><h2 id="complete-track-title">The full archive.</h2></div>
            <p>{live.length} catalogue items, including individual tracks from albums and EPs.</p>
          </div>
          <details className="studio-archive-details">
            <summary>View full track list <span aria-hidden="true">↓</span></summary>
            <TrackCatalog items={live} />
          </details>
          {upcoming.length > 0 && (
            <p className="studio-upcoming-note">
              {upcoming.length} upcoming releases · <Link href="/music/upcoming">See what is next ↗</Link>
            </p>
          )}
        </section>

        <section className="studio-music-listen section-pad" aria-labelledby="studio-streaming-heading">
          <div>
            <p className="studio-kicker">OFFICIAL PROFILES</p>
            <h2 id="studio-streaming-heading">Listen where you like.</h2>
            <p>Use verified Bossie artist profiles for reliable listening links.</p>
          </div>
          <div className="studio-platform-list">
            {official.map(({ key, href, label }) => (
              <a key={key} href={href} target="_blank" rel="noopener noreferrer">{label} ↗</a>
            ))}
          </div>
        </section>

        <section className="atelier-distribution section-pad" aria-label="Expanded distribution network">
          <details className="atelier-distribution-details">
            <summary>
              <span><strong>Find Bossie on music platforms</strong><small>View the wider distribution network and discovery services</small></span>
              <span aria-hidden="true" className="atelier-distribution-toggle">+</span>
            </summary>
            <PlatformAvailability />
          </details>
        </section>

        <section className="studio-final section-pad">
          <p className="studio-kicker">WANT MUSIC OF YOUR OWN?</p>
          <h2>Let's create<br /><em>your next song.</em></h2>
          <p>From a personal gift to a company production, send your idea through our guided music request.</p>
          <div className="studio-hero-actions">
            <Link className="studio-btn studio-btn-primary" href="/request?type=personal">Create a song ↗</Link>
            <Link className="studio-btn studio-btn-outline" href="/industry">Business &amp; licensing ↗</Link>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
