import type { Metadata } from "next";
import Link from "next/link";
import { getCatalog } from "@/lib/repository/catalog";
import { slugifyGenre } from "@/lib/repository/release-repository";
import { MusicEditorialArchive } from "@/components/v3/MusicEditorialArchive";
import { BossieMark } from "@/components/brand/BossieMark";
import { PageShell } from "@/components/SiteChrome";
import { CatalogProof } from "@/components/v3/BossieV3";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Music",
  description: "Official Bossie on the beat music archive — live releases, worlds and streaming links.",
  alternates: { canonical: "/music" },
};

export default async function MusicPage() {
  const catalog = await getCatalog();
  const { live, upcoming, genres, refreshedAt, latest } = catalog;

  return (
    <PageShell>
      <CatalogProof refreshedAt={refreshedAt} liveCount={live.length} latestSlug={latest?.slug} />
      <section className="page-hero compact-hero">
        <BossieMark size="lg" className="section-mark" />
        <p className="eyebrow">THE COMPLETE ARCHIVE</p>
        <h1>MUSIC</h1>
        <p>{live.length} live transmissions. Every track is a new world.</p>
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
        <MusicEditorialArchive live={live} />
      </section>

      {upcoming.length > 0 && (
        <section className="section-pad upcoming-section">
          <p className="eyebrow">COMING NEXT</p>
          <p className="empty-state">{upcoming.length} upcoming transmissions — <Link href="/music/upcoming">view all ↗</Link></p>
        </section>
      )}
    </PageShell>
  );
}
