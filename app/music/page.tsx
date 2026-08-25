import type { Metadata } from "next";
import Link from "next/link";
import { getCatalog } from "@/lib/repository/catalog";
import { slugifyGenre } from "@/lib/repository/release-repository";
import { ReleaseCard } from "@/components/release/ReleaseUI";
import { PageShell } from "@/components/SiteChrome";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Music",
  description: "Official Bossie on the beat music catalogue — live releases, worlds and streaming links.",
  alternates: { canonical: "/music" },
};

export default async function MusicPage() {
  const { live, upcoming, genres } = await getCatalog();

  return (
    <PageShell>
      <section className="page-hero compact-hero">
        <p className="eyebrow">THE COMPLETE CATALOGUE</p>
        <h1>MUSIC</h1>
        <p>Live releases with verified listen links. Every track is a new world.</p>
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
            <p className="eyebrow">LIVE NOW</p>
            <h2>Out now worldwide.</h2>
          </div>
        </div>
        <div className="release-grid-v2">{live.map((r) => <ReleaseCard key={r.id} release={r} withListen />)}</div>
      </section>

      {upcoming.length > 0 && (
        <section className="section-pad upcoming-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">COMING NEXT</p>
              <h2>Next transmissions.</h2>
            </div>
            <Link className="text-link" href="/music/upcoming">
              All upcoming ↗
            </Link>
          </div>
          <div className="release-grid-v2">{upcoming.map((r) => <ReleaseCard key={r.id} release={r} />)}</div>
        </section>
      )}
    </PageShell>
  );
}
