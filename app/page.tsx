import type { Metadata } from "next";
import Link from "next/link";
import { getCatalog } from "@/lib/repository/catalog";
import { getOfficialProfileEntries, siteSettings } from "@/lib/site-settings";
import { isVerifiedListenUrl } from "@/lib/links/url";
import { getBrandAssetUrl } from "@/lib/brand/assets";
import { getPrimaryListenLink } from "@/lib/repository/release-repository";
import { CatalogProof } from "@/components/v3/BossieV3";
import { ReleaseArtwork } from "@/components/release/ReleaseUI";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { serializeJsonLd } from "@/lib/seo/json-ld";

export const dynamic = "force-dynamic";

const ogArt = getBrandAssetUrl("socialShare", siteSettings.siteUrl);

export const metadata: Metadata = {
  title: { absolute: "Bossie on that beat | Custom Music, Original Releases & Licensing" },
  description:
    "Create your own song, discover original Bossie releases, or request custom music and licensing. Independent music producer and composer for people, artists and brands.",
  alternates: { canonical: "/" },
  openGraph: {
    url: siteSettings.siteUrl,
    title: "Bossie on that beat | Custom Music & Original Releases",
    description: "Want your own song? Need music for a film, brand or artist project? Discover Bossie and request music through the official website.",
    ...(ogArt ? { images: [{ url: ogArt, alt: "Bossie on that beat official artwork" }] } : {}),
  },
};

const audiences = [
  {
    index: "01",
    label: "MAKE SOMETHING PERSONAL",
    title: "I want my own song",
    text: "A song for yourself, a birthday, wedding, tribute or special moment. Tell us your story and preferred sound.",
    link: "/request?type=personal",
    action: "Start my song",
  },
  {
    index: "02",
    label: "EXPLORE THE ARTIST",
    title: "I want to listen",
    text: "Hear Bossie's official releases, discover different styles and follow verified links to streaming platforms.",
    link: "/music",
    action: "Explore the music",
  },
  {
    index: "03",
    label: "CREATE FOR A PROJECT",
    title: "I need music for work",
    text: "Original tracks, existing-track licensing and collaborations for brands, creators, filmmakers and artists.",
    link: "/industry",
    action: "Explore business services",
  },
] as const;

const services = [
  {
    n: "01",
    title: "Personalised songs",
    description: "A meaningful song for birthdays, weddings, tributes and moments that deserve their own soundtrack.",
    action: "Request a personal song",
    href: "/request?type=personal",
  },
  {
    n: "02",
    title: "Custom productions",
    description: "Original music built around your story, genre and creative direction — from pop and rap to cinematic sound.",
    action: "Request a production",
    href: "/request?type=custom",
  },
  {
    n: "03",
    title: "Music for brands & film",
    description: "Music briefs for campaigns, video, film, games and digital projects. Scope and usage are agreed first.",
    action: "Discuss a project",
    href: "/request?type=business",
  },
  {
    n: "04",
    title: "Licensing & collaborations",
    description: "Enquire about an existing Bossie track or propose a creative project with defined rights and credits.",
    action: "Explore licensing",
    href: "/industry#licensing",
  },
] as const;

export default async function HomePage() {
  const catalog = await getCatalog();
  const { live, latest, featured, refreshedAt, trackCount, collections } = catalog;
  const current = latest ?? featured;
  const releases = (collections.length ? collections : live).slice(0, 3);
  const streaming = getOfficialProfileEntries("streaming").filter((entry) => isVerifiedListenUrl(entry.href));
  const latestCanListen = current ? Boolean(getPrimaryListenLink(current)) : false;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${siteSettings.siteUrl}/#homepage`,
        url: siteSettings.siteUrl,
        name: "Bossie on that beat — Custom music, releases and licensing",
        description: "Create custom songs, explore official releases and request professional music production.",
        about: { "@id": `${siteSettings.siteUrl}/#artist` },
      },
      {
        "@type": "ItemList",
        "@id": `${siteSettings.siteUrl}/#featured-releases`,
        name: "Official Bossie music releases",
        numberOfItems: releases.length,
        itemListElement: releases.map((release, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: release.title,
          url: `${siteSettings.siteUrl}/music/${release.slug}`,
        })),
      },
    ],
  };

  return (
    <main id="main-content" className="studio-home">
      <CatalogProof refreshedAt={refreshedAt} liveCount={live.length} latestSlug={latest?.slug} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }} />
      <SiteNav />

      <header className="studio-hero section-pad">
        <div className="studio-hero-layout">
          <div className="studio-hero-copy">
            <p className="studio-kicker"><span className="studio-kicker-dot" /> INDEPENDENT MUSIC PRODUCTION · WORLDWIDE</p>
            <h1>Music made<br />for <em>your story.</em></h1>
            <p className="studio-hero-lead">
              Want a song of your own? Looking for original music or a track worth sharing?
              Welcome to <strong>Bossie on that beat</strong> — an independent producer and composer
              creating music for people, artists and creative projects.
            </p>
            <div className="studio-hero-actions">
              <Link className="studio-btn studio-btn-primary" href="/request?type=personal">Create my song <span aria-hidden="true">↗</span></Link>
              <Link className="studio-btn studio-btn-outline" href="/music">Listen to music <span aria-hidden="true">↗</span></Link>
            </div>
            <div className="studio-hero-meta" aria-label="Studio services">
              <span>Personal songs</span>
              <span>Original releases</span>
              <span>Music for business</span>
            </div>
          </div>

          <div className="studio-hero-visual">
            {current ? (
              <article className="studio-feature">
                <div className="studio-feature-top">
                  <span className="studio-feature-live"><span aria-hidden="true" /> LATEST RELEASE</span>
                  <span>BOSSIE ORIGINAL</span>
                </div>
                <Link className="studio-feature-art" href={`/music/${current.slug}`} aria-label={`View ${current.title} release details`}>
                  <ReleaseArtwork release={current} large priority />
                </Link>
                <div className="studio-feature-bottom">
                  <div>
                    <p>NOW PLAYING IN THE BOSSIE CATALOGUE</p>
                    <h2>{current.title}</h2>
                    <span>{current.genres.slice(0, 2).join(" · ") || "Original music"}</span>
                  </div>
                  <Link href={latestCanListen ? `/go/${current.slug}` : `/music/${current.slug}`} className="studio-feature-play">
                    {latestCanListen ? "Listen now" : "View release"} ↗
                  </Link>
                </div>
              </article>
            ) : (
              <div className="studio-feature studio-feature-empty">
                <span className="studio-feature-live">OFFICIAL MUSIC CATALOGUE</span>
                <h2>Every track starts with an idea.</h2>
                <Link className="studio-btn studio-btn-primary" href="/music">Explore our music ↗</Link>
              </div>
            )}
            <span className="studio-visual-caption">BOSSIE ON THAT BEAT / SOUND WITH CHARACTER</span>
          </div>
        </div>
      </header>

      <section className="studio-paths section-pad" aria-labelledby="studio-paths-heading">
        <div className="studio-section-top">
          <div>
            <p className="studio-kicker">YOUR STARTING POINT</p>
            <h2 id="studio-paths-heading">What brings you here?</h2>
          </div>
          <p>Choose what you want to do. No confusing menus or unnecessary steps.</p>
        </div>
        <div className="studio-path-grid">
          {audiences.map((audience) => (
            <Link className="studio-path" href={audience.link} key={audience.index}>
              <span className="studio-path-number">{audience.index} / {audience.label}</span>
              <h3>{audience.title}</h3>
              <p>{audience.text}</p>
              <span className="studio-path-action">{audience.action}<span aria-hidden="true">↗</span></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="studio-services section-pad" aria-labelledby="studio-services-heading">
        <div className="studio-section-top">
          <div>
            <p className="studio-kicker">WHAT BOSSIE DOES</p>
            <h2 id="studio-services-heading">More than a music catalogue.</h2>
          </div>
          <p>One creative identity. Different sounds, stories and ways to work together.</p>
        </div>
        <div className="studio-service-grid">
          {services.map((service) => (
            <article className="studio-service" key={service.n}>
              <span className="studio-service-index">{service.n}</span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <Link href={service.href}>{service.action} <span aria-hidden="true">↗</span></Link>
            </article>
          ))}
        </div>
      </section>

      {releases.length > 0 && (
        <section className="studio-releases section-pad" aria-labelledby="studio-releases-heading">
          <div className="studio-section-top">
            <div>
              <p className="studio-kicker">LISTEN &amp; DISCOVER</p>
              <h2 id="studio-releases-heading">Music you can hear today.</h2>
            </div>
            <Link className="studio-inline-link" href="/music">Explore the complete catalogue ↗</Link>
          </div>
          <div className="studio-release-grid">
            {releases.map((release) => (
              <article className="studio-release-card" key={release.id}>
                <Link href={`/music/${release.slug}`} className="studio-release-art" aria-label={`Discover ${release.title}`}>
                  <ReleaseArtwork release={release} />
                </Link>
                <div className="studio-release-content">
                  <p>{release.type.toUpperCase()} {release.releaseDate ? `· ${release.releaseDate.slice(0, 4)}` : ""}</p>
                  <h3><Link href={`/music/${release.slug}`}>{release.title}</Link></h3>
                  <span>{release.genres.slice(0, 2).join(" · ") || "Bossie original"}</span>
                  <Link href={`/music/${release.slug}`} className="studio-inline-link">Listen &amp; explore ↗</Link>
                </div>
              </article>
            ))}
          </div>
          <p className="studio-release-count">{trackCount} verified tracks in the official catalogue. Explore releases and verified listening links.</p>
        </section>
      )}

      <section className="studio-about section-pad" aria-labelledby="studio-about-heading">
        <div className="studio-about-signature" aria-hidden="true">
          <span className="studio-about-letter">B</span>
          <span>BOSSIE ON THAT BEAT</span>
          <small>EVERY TRACK IS A NEW WORLD</small>
        </div>
        <div className="studio-about-copy">
          <p className="studio-kicker">MEET THE PRODUCER</p>
          <h2 id="studio-about-heading">Who is Bossie on that beat?</h2>
          <p>
            Bossie is an independent music producer, composer and artist project.
            The sound crosses cinematic music, electronic, pop, rap, metal, orchestral
            and global influences. The goal is straightforward: create music that fits the story.
          </p>
          <p>
            Alongside original releases, Bossie accepts selected custom music and licensing
            enquiries. Project requests and business arrangements are managed through
            VDB Digital Software in the Netherlands.
          </p>
          <div className="studio-about-actions">
            <Link className="studio-inline-link" href="/about">More about Bossie ↗</Link>
            <Link className="studio-inline-link" href="/epk">Official press kit ↗</Link>
          </div>
        </div>
      </section>

      <section className="studio-process section-pad" aria-labelledby="studio-process-heading">
        <div className="studio-section-top">
          <div>
            <p className="studio-kicker">SIMPLE &amp; TRANSPARENT</p>
            <h2 id="studio-process-heading">How a music request works.</h2>
          </div>
          <p>From the first idea to an agreed project, you know what happens next.</p>
        </div>
        <ol className="studio-process-grid">
          <li><span>STEP 01</span><h3>Tell us your idea.</h3><p>Choose your project and describe the style, story, audience and deadline.</p></li>
          <li><span>STEP 02</span><h3>We review your brief.</h3><p>Bossie checks the request and discusses scope, feasibility, price and any usage rights.</p></li>
          <li><span>STEP 03</span><h3>Agree before we create.</h3><p>Production, revisions, delivery and licensing terms are confirmed in writing before any commitment.</p></li>
        </ol>
        <div className="studio-process-cta">
          <Link className="studio-btn studio-btn-primary" href="/request?type=custom">Start a music request <span aria-hidden="true">↗</span></Link>
          <p>Sending an enquiry is free and does not obligate you to purchase.</p>
        </div>
      </section>

      {streaming.length > 0 && (
        <section className="studio-platforms section-pad" aria-label="Official streaming profiles">
          <div>
            <p className="studio-kicker">OFFICIAL LISTENING LINKS</p>
            <h2>Listen on your favourite platform.</h2>
          </div>
          <div className="studio-platform-list">
            {streaming.map(({ href, label, key }) => (
              <a key={key} href={href} target="_blank" rel="noopener noreferrer">
                {label} <span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </section>
      )}

      <section className="studio-final section-pad" aria-labelledby="studio-final-heading">
        <p className="studio-kicker">YOUR IDEA STARTS HERE</p>
        <h2 id="studio-final-heading">Ready to make<br /><em>something worth hearing?</em></h2>
        <p>Personal music, independent artist projects, licensing or a creative collaboration — tell Bossie what you have in mind.</p>
        <div className="studio-hero-actions">
          <Link className="studio-btn studio-btn-primary" href="/request">Request your music ↗</Link>
          <Link className="studio-btn studio-btn-outline" href="/industry">View studio services ↗</Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
