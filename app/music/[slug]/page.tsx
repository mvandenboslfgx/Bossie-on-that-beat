import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllReleases, getReleaseBySlug, getReleasesByWorld } from "@/lib/repository/release-repository";
import { ReleaseHero, PlatformLinks } from "@/components/release/ReleaseUI";
import { PageShell } from "@/components/SiteChrome";
import { siteSettings } from "@/lib/site-settings";
import { isVerifiedListenUrl } from "@/lib/links/url";

const base = siteSettings.siteUrl;

export async function generateStaticParams() {
  const releases = await getAllReleases();
  return releases.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const r = await getReleaseBySlug(slug);
  if (!r) return {};
  const description =
    r.seo?.description ??
    `${r.title} by ${r.artist} — ${r.tagline ?? r.description ?? ""}. Listen, watch and explore the official release page.`;
  return {
    title: r.seo?.title ?? `${r.title} — Official Release`,
    description,
    alternates: { canonical: `/music/${r.slug}` },
    openGraph: {
      type: "music.song",
      url: `${base}/music/${r.slug}`,
      title: `${r.title} | ${siteSettings.artistName}`,
      description,
      images: r.artworkUrl ? [{ url: r.artworkUrl, alt: `${r.title} cover artwork` }] : undefined,
    },
  };
}

export default async function ReleasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = await getReleaseBySlug(slug);
  if (!r) notFound();

  const related = r.worldSlug ? await getReleasesByWorld(r.worldSlug) : [];

  const sameAs = r.links.map((l) => l.url).filter((url) => url && isVerifiedListenUrl(url));
  const recordingSchema = {
    "@context": "https://schema.org",
    "@type": "MusicRecording",
    "@id": `${base}/music/${r.slug}#recording`,
    name: r.title,
    url: `${base}/music/${r.slug}`,
    datePublished: r.releaseDate,
    genre: r.genres,
    description: r.description,
    byArtist: {
      "@type": "MusicGroup",
      "@id": `${base}/#artist`,
      name: siteSettings.artistName,
      url: base,
    },
    image: r.artworkUrl || undefined,
    ...(sameAs.length ? { sameAs } : {}),
  };

  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(recordingSchema) }} />
      <ReleaseHero release={r} />

      <section className="section-pad release-detail-section">
        <PlatformLinks release={r} smartlink />
      </section>

      {r.story && (
        <section className="section-pad release-story">
          <p className="eyebrow">THE STORY</p>
          <h2>Where this world begins.</h2>
          <p>{r.story}</p>
        </section>
      )}

      {r.credits && r.credits.length > 0 && (
        <section className="section-pad">
          <p className="eyebrow">CREDITS</p>
          <div className="credits-grid">
            {r.credits.map((c) => (
              <div key={`${c.role}-${c.name}`}>
                <span>{c.role}</span>
                <strong>{c.name}</strong>
              </div>
            ))}
          </div>
        </section>
      )}

      {r.lyrics && (
        <section className="section-pad">
          <details className="lyrics-block">
            <summary>Lyrics</summary>
            <pre>{r.lyrics}</pre>
          </details>
        </section>
      )}

      {r.worldSlug && (
        <section className="section-pad">
          <p className="eyebrow">ENTER THIS WORLD</p>
          <Link className="button button-ghost" href={`/worlds/${r.worldSlug}`}>
            Explore {r.worldSlug.replace(/-/g, " ")} ↗
          </Link>
        </section>
      )}

      {related.filter((item) => item.slug !== r.slug).length > 0 && (
        <section className="section-pad">
          <p className="eyebrow">RELATED RELEASES</p>
          <div className="related-list">
            {related
              .filter((item) => item.slug !== r.slug)
              .map((item) => (
                <Link key={item.id} href={`/music/${item.slug}`}>
                  {item.title} ↗
                </Link>
              ))}
          </div>
        </section>
      )}

      <section className="section-pad">
        <Link className="back-link" href="/music">
          ← Back to catalogue
        </Link>
      </section>
    </PageShell>
  );
}
