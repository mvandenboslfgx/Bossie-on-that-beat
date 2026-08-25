import type { Metadata } from "next";
import Link from "next/link";
import { getAllCinema } from "@/lib/repository/release-repository";
import { PageShell } from "@/components/SiteChrome";
import { isVerifiedListenUrl } from "@/lib/links/url";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cinema",
  description: "Bossie Cinema — music videos, short films and visual worlds from Bossie on the beat.",
  alternates: { canonical: "/cinema" },
};

const categoryLabels: Record<string, string> = {
  film: "Films",
  "music-video": "Music Videos",
  visualizer: "Visualizers",
  "short-film": "Short Films",
  short: "Shorts",
  teaser: "Teasers",
  trailer: "Trailers",
  "behind-the-scenes": "Behind the Scenes",
};

function formatDuration(seconds?: number) {
  if (seconds == null) return null;
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

export default async function CinemaPage() {
  const items = await getAllCinema();
  const featured = items.find((i) => i.featured) ?? items[0];
  const categories = [...new Set(items.map((i) => i.type))];

  return (
    <PageShell>
      <section className="page-hero compact-hero">
        <p className="eyebrow">BOSSIE CINEMA</p>
        <h1>CINEMA</h1>
        <p>Music is only half the story.</p>
      </section>

      {featured && (
        <section className="section-pad cinema-featured">
          <div className="cinema-featured-frame">
            {featured.thumbnailUrl ? (
              <div
                className="cinema-featured-visual"
                style={{ backgroundImage: `url(${featured.thumbnailUrl})` }}
                role="img"
                aria-label={`${featured.title} still`}
              />
            ) : (
              <div className="cinema-featured-visual cinema-thumb-empty" aria-hidden="true" />
            )}
            <div className="cinema-featured-copy">
              <p className="eyebrow">FEATURED FILM</p>
              <h2>{featured.title}</h2>
              {formatDuration(featured.durationSeconds) && (
                <p className="cinema-duration">{formatDuration(featured.durationSeconds)}</p>
              )}
              <p>{featured.description}</p>
              <div className="cinema-actions">
                {featured.youtubeUrl && isVerifiedListenUrl(featured.youtubeUrl) && (
                  <a className="button button-gold" href={featured.youtubeUrl} target="_blank" rel="noreferrer">
                    WATCH NOW ↗
                  </a>
                )}
                <Link className="button button-ghost" href={`/cinema/${featured.slug}`}>
                  Explore ↗
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {categories.map((cat) => {
        const filtered = items.filter((i) => i.type === cat);
        const isShort = cat === "short";
        return (
          <section key={cat} className="section-pad">
            <p className="eyebrow cinema-section-label">{categoryLabels[cat] ?? cat}</p>
            <div className={`cinema-grid-v2 ${isShort ? "cinema-grid-shorts" : ""}`}>
              {filtered.map((item) => {
                const canWatch = Boolean(item.youtubeUrl && isVerifiedListenUrl(item.youtubeUrl));
                return (
                  <article key={item.id} className={`cinema-card-v2 ${isShort ? "cinema-card-short" : ""}`}>
                    {item.thumbnailUrl ? (
                      <div
                        className="cinema-thumb"
                        style={{ backgroundImage: `url(${item.thumbnailUrl})` }}
                        role="img"
                        aria-label={`${item.title} thumbnail`}
                      />
                    ) : (
                      <div className="cinema-thumb cinema-thumb-empty" aria-hidden="true" />
                    )}
                    <span className="cinema-type">{item.type.replace("-", " ")}</span>
                    <h3>{item.title}</h3>
                    {formatDuration(item.durationSeconds) && (
                      <p className="cinema-duration">{formatDuration(item.durationSeconds)}</p>
                    )}
                    <p>{item.description}</p>
                    <div className="cinema-actions">
                      {canWatch && (
                        <a className="button button-gold" href={item.youtubeUrl!} target="_blank" rel="noreferrer">
                          Watch ↗
                        </a>
                      )}
                      <Link className="button button-ghost" href={`/cinema/${item.slug}`}>
                        Details ↗
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        );
      })}
    </PageShell>
  );
}
