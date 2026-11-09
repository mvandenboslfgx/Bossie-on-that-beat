import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getCatalog } from "@/lib/repository/catalog";
import { getPrimaryListenLink, getAllCinema } from "@/lib/repository/release-repository";
import { getBrandAssetUrl } from "@/lib/brand/assets";
import { ReleaseArtwork } from "@/components/release/ReleaseUI";
import { BossieLogo } from "@/components/brand/BossieLogo";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { CatalogProof } from "@/components/v3/BossieV3";
import { getOfficialProfileEntries, siteSettings } from "@/lib/site-settings";
import { isVerifiedListenUrl } from "@/lib/links/url";
import { serializeJsonLd } from "@/lib/seo/json-ld";
import { getPublicCinemaTitle, getPublicCinemaSummary } from "@/lib/cinema/editorial";

export const dynamic = "force-dynamic";
const socialArt = getBrandAssetUrl("socialShare", siteSettings.siteUrl);

export const metadata: Metadata = {
  title: { absolute: "Bossie on that beat | Original Music, Custom Songs & Licensing" },
  description: "Discover the original Bossie on that beat catalogue, commission a personal song or discuss original music and licensing for film, brands and creative projects.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Bossie on that beat — Original Music & Creative Production",
    description: "Every track is a new world. Explore official releases, create your own song or collaborate on a soundtrack.",
    url: siteSettings.siteUrl,
    ...(socialArt ? { images: [{ url: socialArt, alt: "Bossie on that beat official artwork" }] } : {}),
  },
};

export default async function HomePage() {
  const [catalog, cinema] = await Promise.all([getCatalog(), getAllCinema()]);
  const featuredFilm = cinema.find((item) => item.thumbnailUrl && isVerifiedListenUrl(item.thumbnailUrl));
  const sectionTotal = featuredFilm ? "05" : "04";
  const { live, latest, featured, refreshedAt, trackCount, collections } = catalog;
  const headline = latest ?? featured;
  const releases = (collections.length ? collections : live)
    .filter((release) => release.id !== headline?.id)
    .slice(0, 6);
  const listen = headline ? Boolean(getPrimaryListenLink(headline)) : false;
  const profiles = getOfficialProfileEntries("streaming").filter((profile) => isVerifiedListenUrl(profile.href));

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": siteSettings.siteUrl + "/#home",
    url: siteSettings.siteUrl,
    name: "Bossie on that beat — independent music and custom production",
    about: { "@id": siteSettings.siteUrl + "/#artist" },
  };

  return (
    <>
      <SiteNav />
      <main id="main-content" className="atelier">
        <CatalogProof refreshedAt={refreshedAt} liveCount={live.length} latestSlug={latest?.slug} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }} />

        <header className="atelier-hero" aria-labelledby="atelier-hero-title">
          <div className="atelier-hero-inner">
            <div className="atelier-hero-copy">
              <div className="atelier-ident">
                <span className="atelier-ident-line" aria-hidden="true" />
                <span>INDEPENDENT MUSIC / EST. IN THE NETHERLANDS</span>
              </div>
              <h1 id="atelier-hero-title">Not just a beat.<br /><em>A whole world.</em></h1>
              <p className="atelier-intro">
                Original releases, personal songs and music built for a story.
                From the first idea to the final note, <strong>Bossie on that beat</strong> makes sound with its own identity.
              </p>
              <div className="atelier-actions">
                <Link className="atelier-action atelier-action-primary" href="/music">Explore the music <span aria-hidden="true">↗</span></Link>
                <Link className="atelier-action atelier-action-secondary" href="/request?type=personal">Create your song <span aria-hidden="true">↗</span></Link>
              </div>
              <div className="atelier-hero-signature">
                <span>COMPOSED TO CONNECT</span>
                <span>01 / THE SOUND</span>
              </div>
            </div>

            <div className="atelier-feature">
              {headline ? (
                <article className="atelier-feature-card">
                  <div className="atelier-feature-top"><span><i aria-hidden="true" /> LATEST FROM THE STUDIO</span><span>OFFICIAL RELEASE</span></div>
                  <Link className="atelier-feature-image" href={"/music/" + headline.slug} aria-label={"Discover " + headline.title}>
                    <ReleaseArtwork release={headline} large priority />
                  </Link>
                  <div className="atelier-feature-bottom">
                    <div>
                      <p>IN ROTATION</p>
                      <h2>{headline.title}</h2>
                      <span>{headline.genres.slice(0, 2).join(" / ") || "Original music"}</span>
                    </div>
                    <Link className="atelier-feature-link" href={listen ? "/go/" + headline.slug : "/music/" + headline.slug} aria-label={listen ? "Listen to " + headline.title : "View " + headline.title}>
                      {listen ? "LISTEN" : "EXPLORE"} <span aria-hidden="true">↗</span>
                    </Link>
                  </div>
                </article>
              ) : (
                <div className="atelier-feature-card atelier-feature-empty">
                  <span>THE BOSSIE CATALOGUE</span>
                  <strong>Every track opens another world.</strong>
                  <Link href="/music">Explore the music ↗</Link>
                </div>
              )}
            </div>
          </div>
          <div className="atelier-hero-footer">
            <span>SONGS / SOUNDTRACKS / SONIC WORLDS</span>
            <a href="#discover" aria-label="Discover the studio">SCROLL TO EXPLORE ↓</a>
          </div>
        </header>

        <section className="atelier-introduction" id="discover" aria-labelledby="atelier-introduction-title">
          <div className="atelier-section-label">THE IDEA <span>01 / {sectionTotal}</span></div>
          <div className="atelier-introduction-body">
            <h2 id="atelier-introduction-title">Every track has<br /><em>something to say.</em></h2>
            <div className="atelier-introduction-aside">
              <p>Music is more than background. It can hold a memory, build tension, move a crowd or give a brand its own pulse.</p>
              <p>Bossie crosses cinematic, electronic, metal, pop and global influences to find the sound that fits.</p>
              <Link className="atelier-text-link" href="/about">Meet the artist <span aria-hidden="true">↗</span></Link>
            </div>
          </div>
        </section>

        <section className="atelier-music" aria-labelledby="atelier-music-title">
          <div className="atelier-section-label">THE DISCOGRAPHY <span>02 / {sectionTotal}</span></div>
          <div className="atelier-music-head">
            <div>
              <p className="atelier-overline">ORIGINAL MUSIC, NO SINGLE GENRE</p>
              <h2 id="atelier-music-title">The listening room<span className="atelier-stop">.</span></h2>
            </div>
            <Link className="atelier-text-link" href="/music">View complete catalogue <span aria-hidden="true">↗</span></Link>
          </div>
          {releases.length > 0 ? (
            <div className="atelier-release-grid">
              {releases.map((release, index) => (
                <article className="atelier-release" key={release.id}>
                  <Link className="atelier-release-art" href={"/music/" + release.slug} aria-label={"Explore " + release.title}>
                    <ReleaseArtwork release={release} />
                    <span className="atelier-release-open" aria-hidden="true">↗</span>
                  </Link>
                  <div className="atelier-release-meta">
                    <span>{String(index + 1).padStart(2, "0")} / {release.type.toUpperCase()}</span>
                    <span>{release.releaseDate ? release.releaseDate.slice(0, 4) : "BOSSIE"}</span>
                  </div>
                  <h3><Link href={"/music/" + release.slug}>{release.title}</Link></h3>
                  <p>{release.genres.slice(0, 2).join(" / ") || "Original release"}</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="atelier-empty">Official releases appear here as they become available.</p>
          )}
          <div className="atelier-music-bottom">
            <p>{trackCount} verified tracks in the official catalogue. Releases and individual album tracks are grouped clearly in the archive.</p>
            <Link className="atelier-action atelier-action-outline" href="/music">Discover all releases <span aria-hidden="true">↗</span></Link>
          </div>
        </section>

        {featuredFilm && (
          <section className="atelier-cinema" aria-labelledby="atelier-cinema-title">
            <div className="atelier-section-label">THE CINEMA <span>03 / {sectionTotal}</span></div>
            <div className="atelier-cinema-layout">
              <Link
                href={`/cinema/${featuredFilm.slug}`}
                className="atelier-cinema-art"
                aria-label={`Explore ${getPublicCinemaTitle(featuredFilm)} in Bossie Cinema`}
              >
                <Image
                  src={featuredFilm.thumbnailUrl!}
                  alt={`Still from ${getPublicCinemaTitle(featuredFilm)}`}
                  fill
                  unoptimized
                  loading="lazy"
                  sizes="(max-width: 850px) 92vw, 53vw"
                  className="atelier-cinema-image"
                />
                <span className="atelier-cinema-play" aria-hidden="true">▶</span>
              </Link>
              <div className="atelier-cinema-copy">
                <p className="atelier-overline">MUSIC YOU CAN SEE</p>
                <h2 id="atelier-cinema-title">Sound in<br /><em>motion.</em></h2>
                <p className="atelier-cinema-feature-label">FEATURED VISUAL / {getPublicCinemaTitle(featuredFilm)}</p>
                <p className="atelier-cinema-summary">{getPublicCinemaSummary(featuredFilm)}</p>
                <Link className="atelier-action atelier-action-outline" href="/cinema">Step inside Cinema <span aria-hidden="true">↗</span></Link>
              </div>
            </div>
          </section>
        )}

        <section className="atelier-commission" aria-labelledby="atelier-commission-title">
          <div className="atelier-section-label">THE STUDIO <span>{featuredFilm ? "04" : "03"} / {sectionTotal}</span></div>
          <div className="atelier-commission-intro">
            <p className="atelier-overline">A SOUND CREATED FOR YOU</p>
            <h2 id="atelier-commission-title">Your story.<br /><em>Its own soundtrack.</em></h2>
            <p>Some music is made to be heard. Other music is made for someone, somewhere or something specific.</p>
          </div>
          <div className="atelier-commission-grid">
            <article className="atelier-commission-personal">
              <div className="atelier-commission-count">01 / PERSONAL</div>
              <h3>A song that means something.</h3>
              <p>A birthday, a wedding, a tribute or a moment that deserves its own sound. Tell us the story and the atmosphere you imagine.</p>
              <Link className="atelier-action atelier-action-primary" href="/request?type=personal">Start a personal song <span aria-hidden="true">↗</span></Link>
            </article>
            <article className="atelier-commission-business">
              <div className="atelier-commission-count">02 / CREATIVE PROJECTS</div>
              <h3>Music that serves the picture.</h3>
              <p>Original composition, an existing-track licence or an artist collaboration for film, campaigns, creators and brands. Rights and scope are agreed first.</p>
              <Link className="atelier-action atelier-action-secondary" href="/industry">Explore studio services <span aria-hidden="true">↗</span></Link>
            </article>
          </div>
        </section>

        <section className="atelier-process" aria-labelledby="atelier-process-title">
          <div className="atelier-section-label">THE PROCESS <span>{featuredFilm ? "05" : "04"} / {sectionTotal}</span></div>
          <div className="atelier-process-content">
            <div className="atelier-process-heading">
              <p className="atelier-overline">CLEAR FROM THE FIRST CONVERSATION</p>
              <h2 id="atelier-process-title">An idea is<br /><em>where it starts.</em></h2>
            </div>
            <ol className="atelier-steps">
              <li><span>01</span><div><h3>Share the brief.</h3><p>Tell us the story, intended use, sound and timing.</p></div></li>
              <li><span>02</span><div><h3>Shape the approach.</h3><p>We review the scope and discuss pricing, rights and what is possible.</p></div></li>
              <li><span>03</span><div><h3>Agree, then create.</h3><p>Production begins after the deliverables and terms are confirmed in writing.</p></div></li>
            </ol>
          </div>
        </section>

        {profiles.length > 0 && (
          <aside className="atelier-stream" aria-label="Verified music platforms">
            <span>FOLLOW THE SOUND</span>
            <div>{profiles.map((profile) => (
              <a key={profile.key} href={profile.href} target="_blank" rel="noopener noreferrer">
                {profile.label} ↗
              </a>
            ))}</div>
          </aside>
        )}

        <section className="atelier-outro" aria-labelledby="atelier-outro-title">
          <div className="atelier-outro-brand"><BossieLogo variant="primary" href="" /><span>ORIGINAL MUSIC. REAL STORIES.</span></div>
          <div>
            <p className="atelier-overline">THE NEXT SOUND STARTS HERE</p>
            <h2 id="atelier-outro-title">Let’s make it<br /><em>unforgettable.</em></h2>
            <div className="atelier-outro-actions">
              <Link className="atelier-action atelier-action-primary" href="/request">Tell us your idea <span aria-hidden="true">↗</span></Link>
              <Link className="atelier-text-link" href="/epk">Press &amp; artist information <span aria-hidden="true">↗</span></Link>
            </div>
            <p className="atelier-outro-note">An enquiry is free. Production, delivery, revisions and usage rights are discussed before any commitment.</p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
