import type { Metadata } from "next";
import Link from "next/link";
import { BossieLogo } from "@/components/brand/BossieLogo";
import { BossieMark } from "@/components/brand/BossieMark";
import { FollowSocialBlock, ListenSocialBlock } from "@/components/brand/SocialLinks";
import { getDownloadableBrandAssets } from "@/lib/brand/assets";
import { getCatalog } from "@/lib/repository/catalog";
import { getAllCinema } from "@/lib/repository/release-repository";
import { ReleaseActions, ReleaseArtwork } from "@/components/release/ReleaseUI";
import { PageShell } from "@/components/SiteChrome";
import { platformDisplayNames, siteSettings } from "@/lib/site-settings";
import { getPublicCinemaTitle } from "@/lib/cinema/editorial";
import { isVerifiedListenUrl } from "@/lib/links/url";
import { CatalogProof } from "@/components/v3/BossieV3";
import { TrackedLink } from "@/components/analytics/TrackedLink";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "EPK / Press",
  description:
    "Official Bossie on that beat press kit: artist biography, verified releases, video, logos and contact for press, sync licensing and production enquiries.",
  alternates: { canonical: "/epk" },
};

export default async function EpkPage() {
  const { live, latest, refreshedAt, collections } = await getCatalog();
  const cinema = await getAllCinema();
  const brandDownloads = getDownloadableBrandAssets();

  // Press selections should feature distinct recordings and covers.
  // Do not repeat the newest hero or fill the grid with tracks from one EP.
  const selectedArtwork = new Set<string>();
  const picks = [...collections, ...live.filter((release) => release.type === "track")]
    .filter((release) => {
      if (release.id === latest?.id) return false;
      const identity = release.artworkUrl?.trim() || release.id;
      if (selectedArtwork.has(identity)) return false;
      selectedArtwork.add(identity);
      return true;
    })
    .slice(0, 6);
  const selectedCinema = cinema.slice(0, 3);
  const facts: Array<[string, string]> = [
    ["Artist / producer", siteSettings.artistName],
    ["Positioning", "Producer · Composer · Artist · World Builder"],
    ["Core line", siteSettings.slogan],
    ["Focus", "Cinematic production, cross-genre releases, visual storytelling"],
    ["Availability", "Selected collaborations, press, sync, brand and creative projects"],
  ];

  return (
    <PageShell>
      <CatalogProof refreshedAt={refreshedAt} liveCount={live.length} latestSlug={latest?.slug} />
      <section className="page-hero compact-hero epk-hero studio-secondary-hero">
        <div className="epk-seal">
          <BossieMark size="sm" decorative={false} />
          <span>OFFICIAL BOSSIE PRESS MATERIAL</span>
        </div>
        <BossieLogo variant="primary" href="/" className="epk-hero-logo" />
        <p className="eyebrow">Electronic press kit</p>
        <h1>Press <em>&amp; media.</em></h1>
        <p className="epk-role">Producer · Composer · Artist</p>
        <p>Official artist information, release artwork, music, video and press resources for media, labels and creative collaborators.</p>
      </section>
      <section className="section-pad epk-layout">
        <div className="epk-statement">
          <p className="eyebrow">Artist overview</p>
          <h2>Genre-fluid. Cinematic by design.</h2>
          <p>
            Bossie on that beat is an independent producer and artist project built around contrast, scale and complete
            release worlds. Each project is developed as sound, image and story rather than as an isolated track.
          </p>
        </div>
        <dl className="epk-fact-list">
          {facts.map(([label, value]) => (
            <div className="epk-fact-row" key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {latest && (
        <section className="section-pad epk-latest" aria-labelledby="epk-latest-heading">
          <div className="epk-latest-art">
            <ReleaseArtwork release={latest} large priority />
          </div>
          <div className="epk-latest-copy">
            <p className="eyebrow">Newest release</p>
            <h2 id="epk-latest-heading">{latest.title}</h2>
            <p>{latest.tagline ?? latest.description}</p>
            <ReleaseActions release={latest} />
          </div>
        </section>
      )}

      <section className="section-pad epk-editorial-section" aria-labelledby="epk-bio-heading">
        <p className="eyebrow">PRESS BIOGRAPHY</p>
        <h2 id="epk-bio-heading" className="epk-editorial-title">An independent voice across genres.</h2>
        <p>
          Bossie on that beat is a Netherlands-based independent producer and composer creating original music
          across cinematic, electronic, metal and global influences. Alongside artist releases, Bossie considers
          custom compositions, collaborations and licensing enquiries for film, brands and creative projects.
        </p>
      </section>

      <section className="section-pad epk-editorial-section" aria-labelledby="epk-selected-heading">
        <p className="eyebrow">SELECTED DISCOGRAPHY</p>
        <h2 id="epk-selected-heading" className="epk-editorial-title">Music from different worlds.</h2>
        <div className="epk-release-grid">
          {picks.map((r) => {
            const listen = r.links.find((l) => isVerifiedListenUrl(l.url));
            return (
              <article key={r.id} className="epk-release-card">
                <ReleaseArtwork release={r} />
                <h3>{r.title}</h3>
                <p>{r.tagline?.trim() || r.description?.trim() || [r.type.toUpperCase(), ...r.genres.slice(0, 2), r.releaseDate?.slice(0, 4)].filter(Boolean).join(" · ")}</p>
                <div className="epk-card-links">
                  <Link href={`/music/${r.slug}`}>Release page ↗</Link>
                  {listen && (
                    <TrackedLink
                      href={listen.url}
                      releaseId={r.id}
                      platform={listen.platform}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {platformDisplayNames[listen.platform] ?? "Listen"} ↗
                    </TrackedLink>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section-pad epk-editorial-section" aria-labelledby="epk-cinema-heading">
        <p className="eyebrow">SELECTED CINEMA</p>
        <h2 id="epk-cinema-heading" className="epk-editorial-title">The sound in motion.</h2>
        <div className="epk-release-grid epk-cinema-grid">
          {selectedCinema.map((item) => (
            <article key={item.id} className="epk-release-card epk-cinema-card">
              <Link
                className="epk-cinema-thumb-link"
                href={`/cinema/${item.slug}`}
                aria-label={`Watch ${getPublicCinemaTitle(item)}`}
              >
                {item.thumbnailUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.thumbnailUrl}
                    alt={`Still from ${getPublicCinemaTitle(item)}`}
                    className="epk-cinema-thumb"
                    width={1280}
                    height={720}
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <span className="epk-cinema-placeholder" aria-hidden="true">B</span>
                )}
              </Link>
              <h3>{getPublicCinemaTitle(item)}</h3>
              <Link className="text-link" href={`/cinema/${item.slug}`}>
                Watch film ↗
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section-pad">
        <p className="eyebrow">Brand assets</p>
        <div className="epk-brand-grid">
          {brandDownloads.map((asset) => (
            <a key={asset.variant} className="epk-brand-asset" href={asset.src} download target="_blank" rel="noreferrer">
              {asset.variant === "primary" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={asset.src} alt={asset.alt} className="epk-brand-preview" />
              ) : (
                <BossieMark size="lg" decorative={false} />
              )}
              <span>{asset.downloadLabel} ↗</span>
            </a>
          ))}
        </div>
      </section>

      <ListenSocialBlock title="Official links — Listen" />
      <FollowSocialBlock title="Official links — Follow" />

      <section className="section-pad">
        <p className="eyebrow">Website</p>
        <a className="text-link" href={siteSettings.siteUrl}>
          {siteSettings.domain} ↗
        </a>
      </section>
      <section className="section-pad">
        <p className="eyebrow">Contact</p>
        <p>For press, sync licensing, music production and collaboration enquiries. Licensing and usage rights are reviewed and agreed per project.</p>
        <p><a className="text-link" href="mailto:algemeen@vdbdigital.nl?subject=Bossie%20press%20or%20licensing">Contact: algemeen@vdbdigital.nl ↗</a></p>
        <div className="cta-row">
          <Link className="button button-gold" href="/request?type=business">
            Submit a project brief ↗
          </Link>
          <Link className="button button-ghost" href="/industry">
            Services &amp; licensing ↗
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
