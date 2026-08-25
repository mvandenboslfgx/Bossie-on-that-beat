import type { Metadata } from "next";
import Link from "next/link";
import {
  getFeaturedRelease,
  getLatestRelease,
  getLiveReleases,
  getAllWorlds,
  getAllCinema,
  getProjectReleases,
} from "@/lib/repository/release-repository";
import { ReleaseArtwork, ReleaseActions, ReleaseCard, StatusBadge } from "@/components/release/ReleaseUI";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { getOfficialProfileEntries, siteSettings } from "@/lib/site-settings";
import { isVerifiedListenUrl } from "@/lib/links/url";

export const metadata: Metadata = {
  title: { absolute: siteSettings.defaultSeo.title },
  description: siteSettings.defaultSeo.description,
  alternates: { canonical: "/" },
  openGraph: {
    url: siteSettings.siteUrl,
    title: siteSettings.defaultSeo.title,
    description: siteSettings.defaultSeo.description,
    images: [
      {
        url: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/24/9e/40/249e402f-305e-2b06-2d76-5ace0447c80b/artwork.jpg/1200x1200bb.jpg",
        alt: "CROWN OF THE ABYSS — Bossie on the beat",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteSettings.defaultSeo.title,
    description: siteSettings.defaultSeo.description,
    images: [
      "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/24/9e/40/249e402f-305e-2b06-2d76-5ace0447c80b/artwork.jpg/1200x1200bb.jpg",
    ],
  },
};

export default async function HomePage() {
  const [featured, latest, live, worlds, cinema, projects] = await Promise.all([
    getFeaturedRelease(),
    getLatestRelease(),
    getLiveReleases(),
    getAllWorlds(),
    getAllCinema(),
    getProjectReleases(),
  ]);

  const featuredIsLatest = Boolean(featured && latest && featured.slug === latest.slug);
  const catalogue = live.filter((r) => r.slug !== featured?.slug && r.slug !== latest?.slug);
  const streaming = getOfficialProfileEntries("streaming").filter((e) => isVerifiedListenUrl(e.href));
  const nextWorld = projects[0];

  const schema = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: siteSettings.artistName,
    alternateName: siteSettings.artistAltName,
    url: siteSettings.siteUrl,
    description: siteSettings.defaultSeo.description,
    sameAs: streaming.map((e) => e.href),
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="grain" aria-hidden="true" />
      <SiteNav />

      {featured && (
        <header className={`universe-hero section-pad world-accent-${featured.worldSlug ?? "default"}`}>
          <div className="universe-hero-grid">
            <div className="universe-hero-copy">
              <p className="eyebrow">BOSSIE ON THE BEAT</p>
              <h1>
                BOSSIE
                <span> ON THE BEAT</span>
              </h1>
              <p className="hero-manifesto">{siteSettings.slogan}</p>
              <StatusBadge status={featured.status} />
              <p className="hero-release-label">{featuredIsLatest ? "Featured & latest" : "Featured release"}</p>
              <h2 className="featured-title">{featured.title}</h2>
              <ReleaseActions release={featured} />
            </div>
            <ReleaseArtwork release={featured} large />
          </div>
        </header>
      )}

      {!featuredIsLatest && latest && (
        <section className="section-pad home-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">LATEST RELEASE</p>
              <h2>{latest.title}</h2>
              <p>{latest.tagline ?? latest.description}</p>
            </div>
            <ReleaseActions release={latest} />
          </div>
          <div className="latest-spotlight">
            <ReleaseArtwork release={latest} />
          </div>
        </section>
      )}

      <section className="section-pad home-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">EXPLORE MUSIC</p>
            <h2>Live catalogue.</h2>
          </div>
          <Link className="text-link" href="/music">
            Full catalogue ↗
          </Link>
        </div>
        <div className="release-grid-v2">
          {(catalogue.length ? catalogue : live.slice(0, 4)).map((r) => (
            <ReleaseCard key={r.id} release={r} withListen />
          ))}
        </div>
      </section>

      <section className="section-pad home-section worlds-home">
        <div className="section-heading inverse">
          <div>
            <p className="eyebrow">WORLDS</p>
            <h2>One name. Infinite universes.</h2>
          </div>
          <Link className="text-link" href="/worlds">
            All worlds ↗
          </Link>
        </div>
        <div className="world-grid-v2">
          {worlds.slice(0, 4).map((world) => (
            <Link
              key={world.slug}
              href={`/worlds/${world.slug}`}
              className={`world-card-v2 world-theme-${world.slug}`}
            >
              <span className="world-label">{world.subtitle}</span>
              <h3>{world.title}</h3>
              <p>{world.description}</p>
              <span className="text-link">Enter world ↗</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section-pad home-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">CINEMA</p>
            <h2>Music is only half the story.</h2>
          </div>
          <Link className="text-link" href="/cinema">
            Bossie Cinema ↗
          </Link>
        </div>
        <div className="cinema-grid-v2">
          {cinema.slice(0, 3).map((item) => (
            <Link key={item.id} href={`/cinema/${item.slug}`} className="cinema-card-v2">
              {item.thumbnailUrl ? (
                <div
                  className="cinema-thumb"
                  style={{ backgroundImage: `url(${item.thumbnailUrl})` }}
                  role="img"
                  aria-label={`${item.title} thumbnail`}
                />
              ) : (
                <div className="cinema-thumb cinema-thumb-empty" aria-hidden="true" />
              )}
              <span className="cinema-type">{item.type.replace("-", " ")}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {nextWorld && (
        <section className="section-pad home-section upcoming-home">
          <div className="section-heading">
            <div>
              <p className="eyebrow">NEXT WORLD</p>
              <h2>{nextWorld.title}</h2>
              <p>{nextWorld.tagline ?? nextWorld.description}</p>
            </div>
            <Link className="button button-ghost" href={`/music/${nextWorld.slug}`}>
              Explore project ↗
            </Link>
          </div>
        </section>
      )}

      <section className="section-pad home-section cta-section">
        <p className="eyebrow">CREATE YOUR SONG</p>
        <h2>
          Your story.
          <br />
          <span>Your track.</span>
        </h2>
        <p>Custom songs and soundtracks produced as complete Bossie worlds.</p>
        <div className="cta-row">
          <Link className="button button-gold" href="/request">
            Start your song ↗
          </Link>
        </div>
      </section>

      {streaming.length > 0 && (
        <section className="section-pad home-section stream-section">
          <p className="eyebrow">LISTEN</p>
          <h2>Official artist profiles.</h2>
          <div className="platform-grid-v2">
            {streaming.map(({ key, href, label }) => (
              <a key={key} href={href} target="_blank" rel="noreferrer">
                {label} ↗
              </a>
            ))}
          </div>
        </section>
      )}

      <section className="section-pad home-section industry-teaser">
        <p className="eyebrow">INDUSTRY</p>
        <h2>Work with Bossie.</h2>
        <p>Licensing, collaborations, soundtracks and custom music production.</p>
        <Link className="button button-ghost" href="/industry">
          Work with Bossie ↗
        </Link>
      </section>

      <SiteFooter />
    </main>
  );
}
