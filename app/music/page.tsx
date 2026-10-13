import type { Metadata } from "next";
import Link from "next/link";
import { getCatalog } from "@/lib/repository/catalog";
import { slugifyGenre } from "@/lib/repository/release-repository";
import { MusicEditorialArchive } from "@/components/v3/MusicEditorialArchive";
import { BossieMark } from "@/components/brand/BossieMark";
import { PageShell } from "@/components/SiteChrome";
import { CatalogProof } from "@/components/v3/BossieV3";
import { TrackCatalog } from "@/components/release/TrackCatalog";
import { PlatformAvailability } from "@/components/music/PlatformAvailability";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Music",
  description:
    "Complete official Bossie on that beat track and release archive with verified streaming links and worldwide distribution across 26 platforms.",
  alternates: { canonical: "/music" },
};

export default async function MusicPage() {
  const catalog = await getCatalog();
  const { live, trackCount, collections, upcoming, genres, refreshedAt, latest } = catalog;
  const releaseShowcase = collections.length ? collections.slice(0, 6) : live.slice(0, 6);

  return (
    <PageShell>
      <CatalogProof refreshedAt={refreshedAt} liveCount={live.length} latestSlug={latest?.slug} />
      <section className="page-hero compact-hero">
        <BossieMark size="lg" className="section-mark" />
        <p className="eyebrow">ALL OFFICIAL TRACKS &amp; RELEASES</p>
        <h1>MUSIC</h1>
        <p>{trackCount} verified tracks across {collections.length || live.length} releases. One identity, no genre borders.</p>
      </section>

      <section className="music-filters section-pad">
        <div className="filter-row" role="navigation" aria-label="Genre filters">
          <Link className="filter-chip active" href="/music">
            All
          </Link>
          {genres.map((genre) => (
            <Link key={genre} className="filter-chip" href={`/music/genre/${slugifyGenre(genre)}`}>
              {genre}
            </Link>
          ))}
        </div>
      </section>

      <section className="section-pad">
        <div className="section-heading">
          <div>
            <p className="eyebrow">LATEST RELEASES</p>
            <h2>Start with the worlds.</h2>
          </div>
        </div>
        <MusicEditorialArchive live={releaseShowcase} catalog={live} />
      </section>

      <PlatformAvailability />

      <section className="section-pad complete-track-section" aria-labelledby="complete-track-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">COMPLETE DISCOGRAPHY</p>
            <h2 id="complete-track-title">Every verified track.</h2>
          </div>
          <p className="track-count">{live.length} catalogue items</p>
        </div>
        <TrackCatalog items={live} />
      </section>

      {upcoming.length > 0 && (
        <section className="section-pad upcoming-section">
          <p className="eyebrow">COMING NEXT</p>
          <p className="empty-state">{upcoming.length} upcoming releases — <Link href="/music/upcoming">view all ↗</Link></p>
        </section>
      )}
    </PageShell>
  );
}
