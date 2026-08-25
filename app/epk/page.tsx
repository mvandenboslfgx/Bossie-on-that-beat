import type { Metadata } from "next";
import Link from "next/link";
import { BossieLogo } from "@/components/brand/BossieLogo";
import { BossieMark } from "@/components/brand/BossieMark";
import { FollowSocialBlock, ListenSocialBlock } from "@/components/brand/SocialLinks";
import { getDownloadableBrandAssets } from "@/lib/brand/assets";
import { getCatalog } from "@/lib/repository/catalog";
import { getAllCinema } from "@/lib/repository/release-repository";
import { ReleaseArtwork } from "@/components/release/ReleaseUI";
import { PageShell } from "@/components/SiteChrome";
import { platformDisplayNames, siteSettings } from "@/lib/site-settings";
import { isVerifiedListenUrl } from "@/lib/links/url";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "EPK / Press",
  description:
    "Electronic press kit for Bossie on the beat — artist overview, selected music, cinema, genres and official links.",
  alternates: { canonical: "/epk" },
};

export default async function EpkPage() {
  const { live } = await getCatalog();
  const cinema = await getAllCinema();
  const brandDownloads = getDownloadableBrandAssets();

  const curatedSlugs = [
    "crown-of-the-abyss",
    "gasolina",
    "nachtgeld",
    "symphony-of-the-storm",
    "one-world-one-dream",
    "the-mountain-remembers",
  ];
  const selectedReleases = curatedSlugs
    .map((slug) => live.find((r) => r.slug === slug))
    .filter((r): r is (typeof live)[number] => Boolean(r))
    .slice(0, 6);
  const picks = selectedReleases.length ? selectedReleases : live.slice(0, 6);
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
      <section className="page-hero compact-hero epk-hero">
        <BossieLogo variant="primary" href="/" className="epk-hero-logo" />
        <p className="eyebrow">Electronic press kit</p>
        <h1>EPK</h1>
        <p className="epk-role">Producer · Composer · Artist</p>
        <h2 className="epk-artist-name">{siteSettings.artistName}</h2>
        <p>Curated press destination for media, labels, curators and collaborators.</p>
      </section>
      <section className="section-pad epk-layout">
        <div className="epk-statement">
          <p className="eyebrow">Artist overview</p>
          <h2>Genre-fluid. Cinematic by design.</h2>
          <p>
            Bossie on the beat is an independent producer and artist project built around contrast, scale and complete
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

      <section className="section-pad">
        <p className="eyebrow">Short bio</p>
        <p>
          An independent producer/composer/artist creating cinematic, orchestral, metal, electronic, rap and global music —
          organized as Worlds rather than a single genre lane.
        </p>
      </section>

      <section className="section-pad">
        <p className="eyebrow">Selected work</p>
        <div className="epk-release-grid">
          {picks.map((r) => {            const listen = r.links.find((l) => isVerifiedListenUrl(l.url));
            return (
              <article key={r.id} className="epk-release-card">
                <ReleaseArtwork release={r} />
                <h3>{r.title}</h3>
                <p>{r.tagline ?? r.description}</p>
                <div className="epk-card-links">
                  <Link href={`/music/${r.slug}`}>Release page ↗</Link>
                  {listen && (
                    <a href={listen.url} target="_blank" rel="noreferrer">
                      {platformDisplayNames[listen.platform] ?? "Listen"} ↗
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section-pad">
        <p className="eyebrow">Selected cinema</p>
        <div className="epk-release-grid">
          {selectedCinema.map((item) => (
            <article key={item.id} className="epk-release-card">
              {item.thumbnailUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.thumbnailUrl} alt="" className="epk-cinema-thumb" />
              ) : null}
              <h3>{item.title}</h3>
              <Link className="text-link" href={`/cinema/${item.slug}`}>
                View ↗
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
        <p>For press, sync and collaboration enquiries:</p>
        <div className="cta-row">
          <Link className="button button-gold" href="/request">
            Work with Bossie ↗
          </Link>
          <Link className="button button-ghost" href="/industry">
            Industry ↗
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
