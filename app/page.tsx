import type { Metadata } from "next";
import Link from "next/link";
import { getCatalog } from "@/lib/repository/catalog";
import { getAllWorlds, getAllCinema } from "@/lib/repository/release-repository";
import { getSameAsUrls } from "@/lib/brand/socials";
import { CatalogProof, CurrentWorldHero } from "@/components/v3/BossieV3";
import { CinemaEditorialCard } from "@/components/v3/CinemaEditorialCard";
import { MusicEditorialArchive } from "@/components/v3/MusicEditorialArchive";
import { BossieMark } from "@/components/brand/BossieMark";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { getOfficialProfileEntries, siteSettings } from "@/lib/site-settings";
import { isVerifiedListenUrl } from "@/lib/links/url";
import { getBrandAssetUrl } from "@/lib/brand/assets";

export const dynamic = "force-dynamic";

const ogArt = getBrandAssetUrl("socialShare", siteSettings.siteUrl);

export const metadata: Metadata = {
  title: { absolute: siteSettings.defaultSeo.title },
  description: siteSettings.defaultSeo.description,
  alternates: { canonical: "/" },
  openGraph: {
    url: siteSettings.siteUrl,
    title: siteSettings.defaultSeo.title,
    description: siteSettings.defaultSeo.description,
    ...(ogArt ? { images: [{ url: ogArt, alt: "Bossie on the beat official logo" }] } : {}),
  },
};

export default async function HomePage() {
  const [catalog, worlds, cinema] = await Promise.all([getCatalog(), getAllWorlds(), getAllCinema()]);
  const { latest, live, refreshedAt } = catalog;
  const current = latest ?? catalog.featured;
  const streaming = getOfficialProfileEntries("streaming").filter((e) => isVerifiedListenUrl(e.href));

  const schema = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: siteSettings.artistName,
    alternateName: siteSettings.artistAltName,
    url: siteSettings.siteUrl,
    description: siteSettings.defaultSeo.description,
    sameAs: getSameAsUrls(),
  };

  return (
    <main>
      <CatalogProof refreshedAt={refreshedAt} liveCount={live.length} latestSlug={latest?.slug} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="grain" aria-hidden="true" />
      <SiteNav />

      {current && <CurrentWorldHero release={current} live={live} />}

      <section className="section-pad home-section">
        <div className="section-heading">
          <BossieMark size="md" className="section-mark" />
          <div>
            <p className="eyebrow">MUSIC ARCHIVE</p>
            <h2>Signals from every world.</h2>
          </div>
          <Link className="text-link" href="/music">
            Full archive ↗
          </Link>
        </div>
        <MusicEditorialArchive live={live.slice(0, 4)} />
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
              className={`world-card-v2 world-theme-${world.slug} world-skin-${world.slug}`}
            >
              <BossieMark size="sm" className="world-card-mark" />
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
        <div className="cinema-editorial-stack">
          {cinema.slice(0, 3).map((item, i) => (
            <CinemaEditorialCard key={item.id} item={item} featured={i === 0} />
          ))}
        </div>
      </section>

      <section className="section-pad home-section cta-section">
        <BossieMark size="lg" className="section-mark" />
        <p className="eyebrow">BUILD YOUR WORLD</p>
        <h2>Your story. Your track. Your universe.</h2>
        <Link className="button button-gold" href="/request">
          Start your song ↗
        </Link>
      </section>

      {streaming.length > 0 && (
        <section className="section-pad home-section stream-section">
          <p className="eyebrow">LISTEN</p>
          <div className="platform-grid-v2">
            {streaming.map(({ key, href, label }) => (
              <a key={key} href={href} target="_blank" rel="noreferrer">
                {label} ↗
              </a>
            ))}
          </div>
        </section>
      )}

      <SiteFooter />
    </main>
  );
}
