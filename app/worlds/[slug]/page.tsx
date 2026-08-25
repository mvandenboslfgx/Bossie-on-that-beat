import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllWorlds,
  getWorldBySlug,
  getReleasesByWorld,
  getAllCinema,
} from "@/lib/repository/release-repository";
import { ReleaseCard } from "@/components/release/ReleaseUI";
import { PageShell } from "@/components/SiteChrome";
import { isVerifiedListenUrl } from "@/lib/links/url";
import { getPublicCinemaSummary } from "@/lib/cinema/editorial";

export async function generateStaticParams() {
  const worlds = await getAllWorlds();
  return worlds.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const world = await getWorldBySlug(slug);
  if (!world) return {};
  return {
    title: `${world.title} — World`,
    description: world.description,
    alternates: { canonical: `/worlds/${world.slug}` },
    openGraph: {
      title: `${world.title} | Bossie on the beat`,
      description: world.description,
      images: world.heroImage ? [{ url: world.heroImage }] : undefined,
    },
  };
}

export default async function WorldDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const world = await getWorldBySlug(slug);
  if (!world) notFound();

  const [releases, cinemaAll] = await Promise.all([getReleasesByWorld(slug), getAllCinema()]);
  const cinema = cinemaAll.filter((c) => c.worldSlug === slug);
  const visual = world.heroImage ?? releases.find((r) => r.artworkUrl)?.artworkUrl;

  return (
    <PageShell worldSlug={slug}>
      <section
        className={`page-hero world-hero world-theme-${world.slug}`}
        style={
          visual
            ? {
                backgroundImage: `linear-gradient(120deg, rgba(5,5,5,.88), rgba(5,5,5,.55)), url(${visual})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      >
        <p className="eyebrow">BOSSIE WORLD</p>
        <h1>{world.title}</h1>
        {world.subtitle && <p className="world-subtitle">{world.subtitle}</p>}
        <p>{world.description}</p>
      </section>

      {world.themes && world.themes.length > 0 && (
        <section className="section-pad">
          <div className="meta-row">
            {world.themes.map((t) => (
              <span key={t} className="meta-chip">
                {t}
              </span>
            ))}
          </div>
        </section>
      )}

      <section className="section-pad">
        <p className="eyebrow">RELEASES IN THIS WORLD</p>
        <div className="release-grid-v2">
          {releases.length ? (
            releases.map((r) => <ReleaseCard key={r.id} release={r} withListen={r.status === "live"} />)
          ) : (
            <p className="empty-state">No releases linked to this world yet.</p>
          )}
        </div>
      </section>

      {cinema.length > 0 && (
        <section className="section-pad">
          <p className="eyebrow">CINEMA</p>
          <div className="cinema-grid-v2">
            {cinema.map((item) => (
              <Link key={item.id} href={`/cinema/${item.slug}`} className="cinema-card-v2">
                {item.thumbnailUrl && (
                  <div
                    className="cinema-thumb"
                    style={{ backgroundImage: `url(${item.thumbnailUrl})` }}
                    role="img"
                    aria-label={`${item.title} thumbnail`}
                  />
                )}
                <h3>{item.title}</h3>
                <p>{getPublicCinemaSummary(item)}</p>
                {item.youtubeUrl && isVerifiedListenUrl(item.youtubeUrl) && (
                  <span className="text-link">Watch ↗</span>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="section-pad">
        <Link className="back-link" href="/worlds">
          ← All worlds
        </Link>
      </section>
    </PageShell>
  );
}
