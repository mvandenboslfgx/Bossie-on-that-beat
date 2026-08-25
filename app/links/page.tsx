import type { Metadata } from "next";
import Link from "next/link";
import { getLatestRelease, getLiveReleases } from "@/lib/repository/release-repository";
import { ReleaseArtwork, ReleaseActions } from "@/components/release/ReleaseUI";
import { PageShell } from "@/components/SiteChrome";
import { platformDisplayNames, siteSettings } from "@/lib/site-settings";
import { isVerifiedListenUrl } from "@/lib/links/url";

export const metadata: Metadata = {
  title: "Links",
  description: "Official Bossie on the beat links — listen, watch, follow and explore the universe.",
  alternates: { canonical: "/links" },
};

export default async function LinksPage() {
  const [latest, live] = await Promise.all([getLatestRelease(), getLiveReleases()]);
  const streaming = Object.entries(siteSettings.streaming).filter(([, href]) => isVerifiedListenUrl(href));
  const social = Object.entries(siteSettings.social).filter(([, href]) => isVerifiedListenUrl(href));

  return (
    <PageShell>
      <section className="page-hero compact-hero links-hero">
        <p className="eyebrow">BOSSIE LINK</p>
        <h1>LINKS</h1>
        <p>Official gateway into the Bossie universe.</p>
      </section>

      {latest && (
        <section className="section-pad links-latest">
          <ReleaseArtwork release={latest} large />
          <div>
            <p className="eyebrow">LATEST RELEASE</p>
            <h2>{latest.title}</h2>
            <p>{siteSettings.artistName}</p>
            <ReleaseActions release={latest} />
          </div>
        </section>
      )}

      {streaming.length > 0 && (
        <section className="section-pad links-section">
          <h2>Listen</h2>
          <div className="links-grid">
            {streaming.map(([key, href]) => (
              <a key={key} href={href} target="_blank" rel="noreferrer">
                {platformDisplayNames[key] ?? key} ↗
              </a>
            ))}
            {live.slice(0, 3).map((r) => (
              <Link key={r.id} href={`/go/${r.slug}`}>
                {r.title} ↗
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="section-pad links-section">
        <h2>Watch</h2>
        <div className="links-grid">
          <Link href="/cinema">Bossie Cinema ↗</Link>
        </div>
      </section>

      {social.length > 0 && (
        <section className="section-pad links-section">
          <h2>Follow</h2>
          <div className="links-grid">
            {social.map(([key, href]) => (
              <a key={key} href={href} target="_blank" rel="noreferrer">
                {platformDisplayNames[key] ?? key} ↗
              </a>
            ))}
          </div>
        </section>
      )}

      <section className="section-pad links-section">
        <h2>Explore</h2>
        <div className="links-grid">
          <Link href="/music">Music ↗</Link>
          <Link href="/worlds">Worlds ↗</Link>
          <Link href="/cinema">Cinema ↗</Link>
          <Link href="/request">Create Your Song ↗</Link>
          <Link href="/go/latest">Latest Release ↗</Link>
          <Link href="/about">About ↗</Link>
          <Link href="/epk">EPK ↗</Link>
          <Link href="/industry">Industry ↗</Link>
        </div>
      </section>
    </PageShell>
  );
}
