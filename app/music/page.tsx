import type { Metadata } from "next";
import Link from "next/link";
import { getCatalog } from "@/lib/repository/catalog";
import { slugifyGenre, getPrimaryListenLink } from "@/lib/repository/release-repository";
import { ReleaseArtwork } from "@/components/release/ReleaseUI";
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
  const { live, trackCount, collections, upcoming, genres, refreshedAt, latest } = catalog;
  const releaseShowcase = (collections.length ? collections : live).slice(0, 9);
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

        <section id="latest-releases" className="studio-music-featured section-pad" aria-labelledby="music-featured-heading">
          <div className="studio-section-top">
            <div><p className="studio-kicker">START LISTENING</p><h2 id="music-featured-heading">Start with the latest.</h2></div>
            <p>Tap a cover to see the track details, artwork, credits and verified listening options.</p>
          </div>
          <div className="studio-music-grid">
            {releaseShowcase.map((release) => {
              const canListen = Boolean(getPrimaryListenLink(release));
              return (
                <article className="studio-music-card" key={release.id}>
                  <Link href={`/music/${release.slug}`} className="studio-music-cover" aria-label={`View ${release.title}`}>
                    <ReleaseArtwork release={release} />
                  </Link>
                  <div className="studio-music-card-body">
                    <span>{release.type.toUpperCase()} {release.releaseDate ? `· ${release.releaseDate.slice(0, 4)}` : ""}</span>
                    <h3><Link href={`/music/${release.slug}`}>{release.title}</Link></h3>
                    <p>{release.genres.slice(0, 3).join(" · ")}</p>
                    <div className="studio-music-card-links">
                      {canListen && <Link href={`/go/${release.slug}`}>Listen now ↗</Link>}
                      <Link href={`/music/${release.slug}`}>Release details ↗</Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          {releaseShowcase.length === 0 && <p className="studio-empty-catalog">Verified releases will appear here when available.</p>}
        </section>

        <section className="studio-music-genres section-pad" aria-label="Browse music by genre">
          <div><p className="studio-kicker">FIND YOUR SOUND</p><h2>Explore by genre.</h2></div>
          <nav className="studio-genre-links" aria-label="Music genre filters">
            <Link href="/music" aria-current="page">All music</Link>
            {genres.map((genre) => <Link key={genre} href={`/music/genre/${slugifyGenre(genre)}`}>{genre}</Link>)}
          </nav>
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
