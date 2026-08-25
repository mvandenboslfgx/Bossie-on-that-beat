import Link from "next/link";
import {
  getFeaturedRelease,
  getLiveReleases,
  getUpcomingReleases,
  getAllWorlds,
  getAllCinema,
} from "@/lib/repository/release-repository";
import { ReleaseArtwork, ReleaseActions, ReleaseCard, StatusBadge } from "@/components/release/ReleaseUI";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { siteSettings } from "@/lib/site-settings";

export default async function HomePage() {
  const [featured, live, upcoming, worlds, cinema] = await Promise.all([
    getFeaturedRelease(),
    getLiveReleases(),
    getUpcomingReleases(),
    getAllWorlds(),
    getAllCinema(),
  ]);

  const schema = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: siteSettings.artistName,
    alternateName: siteSettings.artistAltName,
    url: siteSettings.siteUrl,
    description: siteSettings.defaultSeo.description,
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="grain" aria-hidden="true" />
      <SiteNav />

      {featured && (
        <header className="universe-hero section-pad">
          <div className="universe-hero-grid">
            <div className="universe-hero-copy">
              <p className="eyebrow">BOSSIE ON THE BEAT</p>
              <h1>
                BOSSIE<span>ON THE BEAT</span>
              </h1>
              <p className="hero-manifesto">{siteSettings.slogan}</p>
              <StatusBadge status={featured.status} />
              <h2 className="featured-title">{featured.title}</h2>
              <ReleaseActions release={featured} />
            </div>
            <ReleaseArtwork release={featured} large />
          </div>
        </header>
      )}

      <section className="section-pad home-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">LATEST RELEASE</p>
            <h2>Live now.</h2>
          </div>
          <Link className="text-link" href="/music/latest">
            Go to latest ↗
          </Link>
        </div>
        <div className="release-grid-v2">{live.slice(0, 4).map((r) => <ReleaseCard key={r.id} release={r} />)}</div>
      </section>

      <section className="section-pad home-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">EXPLORE THE MUSIC</p>
            <h2>Every release. One universe.</h2>
          </div>
          <Link className="text-link" href="/music">
            Full catalogue ↗
          </Link>
        </div>
        <div className="release-grid-v2">{live.map((r) => <ReleaseCard key={r.id} release={r} />)}</div>
      </section>

      <section className="section-pad home-section worlds-home">
        <div className="section-heading inverse">
          <div>
            <p className="eyebrow">ENTER THE WORLDS</p>
            <h2>One name. Infinite universes.</h2>
          </div>
          <Link className="text-link" href="/worlds">
            All worlds ↗
          </Link>
        </div>
        <div className="world-grid-v2">
          {worlds.slice(0, 4).map((world) => (
            <Link key={world.slug} href={`/worlds/${world.slug}`} className="world-card-v2">
              <span className="world-label">{world.subtitle}</span>
              <h3>{world.title}</h3>
              <p>{world.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="section-pad home-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">BOSSIE CINEMA</p>
            <h2>Music is only half the story.</h2>
          </div>
          <Link className="text-link" href="/cinema">
            Bossie Cinema ↗
          </Link>
        </div>
        <div className="cinema-grid-v2">
          {cinema.slice(0, 3).map((item) => (
            <Link key={item.id} href={`/cinema/${item.slug}`} className="cinema-card-v2">
              <span className="cinema-type">{item.type.replace("-", " ")}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {upcoming.length > 0 && (
        <section className="section-pad home-section upcoming-home">
          <div className="section-heading">
            <div>
              <p className="eyebrow">COMING NEXT</p>
              <h2>Next world.</h2>
            </div>
            <Link className="text-link" href="/music/upcoming">
              Upcoming ↗
            </Link>
          </div>
          <div className="release-grid-v2">{upcoming.map((r) => <ReleaseCard key={r.id} release={r} />)}</div>
        </section>
      )}

      <section className="section-pad home-section stream-section">
        <p className="eyebrow">STREAM EVERYWHERE</p>
        <h2>Listen on your platform.</h2>
        <div className="platform-grid-v2">
          {Object.entries(siteSettings.streaming).map(([key, href]) => (
            <a key={key} href={href} target="_blank" rel="noreferrer">
              {key.replace(/([A-Z])/g, " $1").trim()} ↗
            </a>
          ))}
        </div>
      </section>

      <section className="section-pad home-section cta-section">
        <p className="eyebrow">JOIN THE UNIVERSE</p>
        <h2>
          ENTER THE<br />
          <span>NEXT WORLD.</span>
        </h2>
        <div className="cta-row">
          <Link className="button button-gold" href="/links">
            Bossie Links ↗
          </Link>
          <Link className="button button-ghost" href="/request">
            Create Your Song ↗
          </Link>
        </div>
      </section>

      <section className="section-pad home-section industry-teaser">
        <p className="eyebrow">INDUSTRY</p>
        <h2>Work with Bossie.</h2>
        <p>Licensing, collaborations, soundtracks and custom music production.</p>
        <Link className="text-link" href="/industry">
          Industry ↗
        </Link>
      </section>

      <SiteFooter />
    </main>
  );
}
