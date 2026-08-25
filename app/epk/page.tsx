import type { Metadata } from "next";
import Link from "next/link";
import { getLiveReleases } from "@/lib/repository/release-repository";
import { ReleaseArtwork } from "@/components/release/ReleaseUI";
import { PageShell } from "@/components/SiteChrome";
import { platformDisplayNames, siteSettings } from "@/lib/site-settings";
import { isVerifiedListenUrl } from "@/lib/links/url";

export const metadata: Metadata = {
  title: "EPK / Press",
  description:
    "Electronic press kit for Bossie on the beat — artist overview, selected music, cinema, genres and official links.",
  alternates: { canonical: "/epk" },
};

export default async function EpkPage() {
  const live = await getLiveReleases();
  const streaming = Object.entries(siteSettings.streaming).filter(([, href]) => isVerifiedListenUrl(href));

  const facts: Array<[string, string]> = [
    ["Artist / producer", siteSettings.artistName],
    ["Positioning", "Producer · Composer · Artist · World Builder"],
    ["Core line", siteSettings.slogan],
    ["Focus", "Cinematic production, cross-genre releases, visual storytelling"],
    ["Availability", "Selected collaborations, press, sync, brand and creative projects"],
  ];

  return (
    <PageShell>
      <section className="page-hero compact-hero">
        <p className="eyebrow">Electronic press kit</p>
        <h1>EPK</h1>
        <p className="epk-role">Artist / producer</p>
        <h2 className="epk-artist-name">{siteSettings.artistName}</h2>
        <p>One professional destination for media, labels, curators, collaborators and brands.</p>
        <p className="epk-download-note">
          Press assets are listed below. A packaged press kit download will appear here when a complete ZIP is available.
        </p>
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
        <p className="eyebrow">Selected music</p>
        <div className="epk-release-grid">
          {live.map((r) => {
            const listen = r.links.find((l) => isVerifiedListenUrl(l.url));
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
        <p>
          Visual worlds and release cinema live on{" "}
          <Link className="text-link" href="/cinema">
            Bossie Cinema
          </Link>
          .
        </p>
      </section>

      <section className="section-pad">
        <p className="eyebrow">Genres</p>
        <div className="meta-row">
          {["Cinematic", "Orchestral", "Metal", "Electronic", "Latin", "World", "Pop"].map((g) => (
            <span key={g} className="meta-chip">
              {g}
            </span>
          ))}
        </div>
      </section>

      {streaming.length > 0 && (
        <section className="section-pad">
          <p className="eyebrow">Official links</p>
          <div className="links-grid">
            {streaming.map(([key, href]) => (
              <a key={key} href={href} target="_blank" rel="noreferrer">
                {platformDisplayNames[key] ?? key} ↗
              </a>
            ))}
            <Link href="/links">All links ↗</Link>
          </div>
        </section>
      )}

      <section className="section-pad">
        <p className="eyebrow">Media assets</p>
        <div className="epk-asset-grid">
          {live
            .filter((r) => r.artworkUrl)
            .map((r) => (
              <a key={r.id} className="epk-asset" href={r.artworkUrl!} target="_blank" rel="noreferrer">
                <ReleaseArtwork release={r} />
                <span>{r.title} artwork ↗</span>
              </a>
            ))}
        </div>
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
