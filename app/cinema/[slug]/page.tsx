import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCinemaBySlug } from "@/lib/repository/release-repository";
import { BossieMark } from "@/components/brand/BossieMark";
import { PageShell } from "@/components/SiteChrome";
import { getCinemaCategoryLabel, getPublicCinemaSummary, getPublicCinemaTitle } from "@/lib/cinema/editorial";
import { isVerifiedListenUrl } from "@/lib/links/url";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = await getCinemaBySlug(slug);
  if (!item) return {};
  const summary = getPublicCinemaSummary(item);
  const title = getPublicCinemaTitle(item);
  return {
    title: `${title} — Cinema`,
    description: summary,
    alternates: { canonical: `/cinema/${item.slug}` },
    openGraph: {
      title,
      description: summary,
      images: item.thumbnailUrl ? [{ url: item.thumbnailUrl }] : undefined,
    },
  };
}

export default async function CinemaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getCinemaBySlug(slug);
  if (!item) notFound();

  const duration =
    item.durationSeconds != null
      ? `${Math.floor(item.durationSeconds / 60)}:${String(item.durationSeconds % 60).padStart(2, "0")}`
      : null;

  const canWatch = Boolean(item.youtubeUrl && isVerifiedListenUrl(item.youtubeUrl));
  const summary = getPublicCinemaSummary(item);
  const title = getPublicCinemaTitle(item);
  const categoryLabel = getCinemaCategoryLabel(item.type);

  const videoSchema =
    canWatch && item.youtubeUrl
      ? {
          "@context": "https://schema.org",
          "@type": "VideoObject",
          name: title,
          description: summary,
          thumbnailUrl: item.thumbnailUrl,
          uploadDate: item.publishedAt,
          duration: item.durationSeconds ? `PT${item.durationSeconds}S` : undefined,
          contentUrl: item.youtubeUrl,
        }
      : null;

  return (
    <PageShell worldSlug={item.worldSlug}>
      {videoSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }} />
      )}
      <section className="page-hero cinema-detail-hero">
        <BossieMark size="lg" className="section-mark" />
        {item.thumbnailUrl && (
          <div
            className="cinema-featured-visual cinema-detail-visual"
            style={{ backgroundImage: `url(${item.thumbnailUrl})` }}
            role="img"
            aria-label={`${title} still`}
          />
        )}
        <p className="eyebrow">{categoryLabel.toUpperCase()}{duration ? ` · ${duration}` : ""}</p>
        <h1>{title}</h1>
        {summary && <blockquote className="cinema-editorial-quote">{summary}</blockquote>}
        <div className="cinema-actions">
          {canWatch && (
            <a className="button button-gold" href={item.youtubeUrl!} target="_blank" rel="noreferrer">
              WATCH ↗
            </a>
          )}
          {item.releaseSlug && (
            <Link className="button button-ghost" href={`/music/${item.releaseSlug}`}>
              Explore release ↗
            </Link>
          )}
          {item.worldSlug && (
            <Link className="button button-ghost" href={`/worlds/${item.worldSlug}`}>
              Explore world ↗
            </Link>
          )}
        </div>
      </section>
    </PageShell>
  );
}
