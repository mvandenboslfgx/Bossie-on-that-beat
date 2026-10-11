import type { Metadata } from "next";
import Link from "next/link";
import { getCatalog } from "@/lib/repository/catalog";
import { getAllWorlds, getAllCinema } from "@/lib/repository/release-repository";
import { CatalogProof, CurrentWorldHero } from "@/components/v3/BossieV3";
import { CinemaEditorialCard } from "@/components/v3/CinemaEditorialCard";
import { MusicEditorialArchive } from "@/components/v3/MusicEditorialArchive";
import { BossieMark } from "@/components/brand/BossieMark";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { getOfficialProfileEntries, siteSettings } from "@/lib/site-settings";
import { isVerifiedListenUrl } from "@/lib/links/url";
import { getBrandAssetUrl } from "@/lib/brand/assets";
import { serializeJsonLd } from "@/lib/seo/json-ld";

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
    ...(ogArt ? { images: [{ url: ogArt, alt: "Bossie on that beat official logo" }] } : {}),
  },
};

export default async function HomePage() {
  const [catalog, worlds, cinema] = await Promise.all([getCatalog(), getAllWorlds(), getAllCinema()]);
  const { latest, live, trackCount, collections, refreshedAt } = catalog;
  const current = latest ?? catalog.featured;
  const latestReleases = collections.length ? collections : live;
  const streaming = getOfficialProfileEntries("streaming").filter((e) => isVerifiedListenUrl(e.href));

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": `${siteSettings.siteUrl}/#profile-page`,
        url: siteSettings.siteUrl,
        name: `Who is ${siteSettings.artistName}?`,
        description: siteSettings.defaultSeo.description,
        mainEntity: { "@id": `${siteSettings.siteUrl}/#artist` },
      },
      {
        "@type": "ItemList",
        "@id": `${siteSettings.siteUrl}/#latest-music`,
        name: `Latest music by ${siteSettings.artistName}`,
        numberOfItems: live.length,
        itemListElement: live.slice(0, 20).map((release, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `${siteSettings.siteUrl}/music/${release.slug}`,
          name: release.title,
        })),
      },
    ],
  };

  return (
    <>
      <CatalogProof refreshedAt={refreshedAt} liveCount={live.length} latestSlug={latest?.slug} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }} />
      <div className="grain" aria-hidden="true" />
      <SiteNav />

      <main id="main-content">
        {current && <CurrentWorldHero release={current} live={live} />}

        <section className="section-pad identity-intro" aria-labelledby="who-is-bossie">
          <div className="identity-intro-kicker">
            <BossieMark size="md" className="section-mark" />
            <p className="eyebrow">WHO IS BOSSIE ON THAT BEAT?</p>
          </div>
          <div className="identity-intro-copy">
            <h2 id="who-is-bossie">Producer. Composer. Artist. World builder.</h2>
            <p className="identity-intro-lede">
              Bossie on that beat is an independent music project that turns every release into a complete world of sound,
              image and story. The catalogue moves through cinematic, orchestral, metal, electronic, rap and global music
              without losing one recognizable identity.
            </p>
            <div className="identity-actions">
              <Link className="button button-gold" href="/about">Meet Bossie ↗</Link>
              <Link className="text-link" href="/epk">Official EPK ↗</Link>
            </div>
          </div>
          <dl className="identity-proof-grid">
            <div><dt>Official catalogue</dt><dd>{trackCount} verified tracks</dd></div>
            <div><dt>Creative system</dt><dd>{worlds.length} distinct worlds</dd></div>
            <div><dt>Visual archive</dt><dd>{cinema.length ? `${cinema.length} films & transmissions` : "Sound · image · story"}</dd></div>
          </dl>
        </section>

        <section className="section-pad home-section" aria-labelledby="latest-releases-title">
          <div className="section-heading">
            <BossieMark size="md" className="section-mark" />
            <div>
              <p className="eyebrow">LATEST RELEASES</p>
              <h2 id="latest-releases-title">Every official track. One living archive.</h2>
            </div>
            <Link className="text-link" href="/music">
              Full archive ↗
            </Link>
          </div>
          <MusicEditorialArchive live={latestReleases.slice(0, 4)} catalog={live} />
        </section>

        <section className="section-pad home-section worlds-home" aria-labelledby="worlds-home-title">
          <div className="section-heading inverse">
            <div>
              <p className="eyebrow">WORLDS</p>
              <h2 id="worlds-home-title">Every sound becomes a place.</h2>
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

        <section className="section-pad home-section" aria-labelledby="cinema-home-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">CINEMA</p>
              <h2 id="cinema-home-title">The picture continues where the track ends.</h2>
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

        <section className="section-pad home-section cta-section" aria-labelledby="bespoke-home-title">
          <BossieMark size="lg" className="section-mark" />
          <p className="eyebrow">BESPOKE PRODUCTION</p>
          <h2 id="bespoke-home-title">Commission a world of your own.</h2>
          <Link className="button button-gold" href="/request">
            Start your song ↗
          </Link>
        </section>

        {streaming.length > 0 && (
          <section className="section-pad home-section stream-section" aria-labelledby="listen-home-title">
            <p className="eyebrow" id="listen-home-title">LISTEN</p>
            <div className="platform-grid-v2">
              {streaming.map(({ key, href, label }) => (
                <a key={key} href={href} target="_blank" rel="noreferrer">
                  {label} ↗
                </a>
              ))}
            </div>
          </section>
        )}
      </main>

      <SiteFooter />
    </>
  );
}
