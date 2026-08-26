import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { FollowSocialBlock } from "@/components/brand/SocialLinks";
import { ShareRelease } from "@/components/brand/ShareRelease";
import { ReleaseMiniWorld, ReleaseSignalBlock } from "@/components/v3/ReleaseMiniWorld";
import { getCatalog } from "@/lib/repository/catalog";
import { getReleaseBySlug, getReleasesByWorld, getWatchLink } from "@/lib/repository/release-repository";
import { PlatformLinks } from "@/components/release/ReleaseUI";
import { PageShell } from "@/components/SiteChrome";
import { siteSettings } from "@/lib/site-settings";
import { isVerifiedListenUrl } from "@/lib/links/url";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

const base = siteSettings.siteUrl;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const r = await getReleaseBySlug(slug);
  if (!r || r.status === "pending_review" || r.status === "project") return {};
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
  if (!r || r.status === "pending_review" || r.status === "project") notFound();

  const [catalog, relatedWorld] = await Promise.all([
    getCatalog(),
    r.worldSlug ? getReleasesByWorld(r.worldSlug) : Promise.resolve([]),
  ]);
  const related = relatedWorld.filter((item) => item.slug !== r.slug && item.status === "live");
  const watch = getWatchLink(r);

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
    <PageShell worldSlug={r.worldSlug}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(recordingSchema) }} />
      <ReleaseMiniWorld release={r} live={catalog.live} />
      <ReleaseSignalBlock release={r} />

      <section className="section-pad release-detail-section">
        <p className="eyebrow">Listen</p>
        <PlatformLinks release={r} smartlink />
      </section>

      {watch && (
        <section className="section-pad">
          <p className="eyebrow">Watch</p>
          <a className="button button-ghost" href={watch.url} target="_blank" rel="noreferrer">
            YouTube ↗
          </a>
        </section>
      )}

      <section className="section-pad release-social-section">
        <FollowSocialBlock title="Follow Bossie" />
        <ShareRelease title={r.title} slug={r.slug} />
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
          <p className="eyebrow">ENTER THE WORLD</p>
          <Link className="button button-ghost" href={`/worlds/${r.worldSlug}`}>
            Explore {r.worldSlug.replace(/-/g, " ")} ↗
          </Link>
        </section>
      )}

      {related.length > 0 && (
        <section className="section-pad">
          <p className="eyebrow">RELATED TRANSMISSIONS</p>
          <div className="related-list">
            {related.map((item) => (
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
