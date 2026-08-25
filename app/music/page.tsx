import Link from "next/link";
import {
  getAllReleases,
  getLiveReleases,
  getUpcomingReleases,
  getAllGenres,
  slugifyGenre,
} from "@/lib/repository/release-repository";
import { ReleaseCard } from "@/components/release/ReleaseUI";
import { PageShell } from "@/components/SiteChrome";

export default async function MusicPage() {
  const [live, upcoming, genres] = await Promise.all([
    getLiveReleases(),
    getUpcomingReleases(),
    getAllGenres(),
  ]);

  return (
    <PageShell>
      <section className="page-hero">
        <p className="eyebrow">THE COMPLETE CATALOGUE</p>
        <h1>MUSIC</h1>
        <p>Every Bossie release and world in one place. Live releases carry verified store links.</p>
      </section>

      <section className="music-filters section-pad">
        <div className="filter-row">
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
        <div className="release-grid-v2">{live.map((r) => <ReleaseCard key={r.id} release={r} />)}</div>
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
