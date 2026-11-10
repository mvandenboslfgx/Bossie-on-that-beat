import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllCinema, getCinemaBySlug } from "@/lib/repository/release-repository";
import { BossieMark } from "@/components/brand/BossieMark";
import { CinemaEditorialCard } from "@/components/v3/CinemaEditorialCard";
import { PageShell } from "@/components/SiteChrome";
import { getCinemaCategoryLabel, getPublicCinemaSummary, getPublicCinemaTitle } from "@/lib/cinema/editorial";
import { isVerifiedListenUrl } from "@/lib/links/url";
import { serializeJsonLd } from "@/lib/seo/json-ld";
import { getYouTubeEmbedUrl } from "@/lib/seo/youtube";

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

  // Keep detail pages connected to the archive without duplicating the same
  // YouTube video in related recommendations. Related work from the same
  // release or world takes priority, and we never surface unreviewed items.
  const allCinema = await getAllCinema();
  const relatedKeys = new Set<string>([getYouTubeEmbedUrl(item.youtubeUrl) ?? item.slug]);
  const related = allCinema
    .filter((candidate) => candidate.slug !== item.slug)
    .sort((left, right) => {
      const score = (candidate: typeof item) =>
        (item.releaseSlug && candidate.releaseSlug === item.releaseSlug ? 4 : 0) +
        (item.worldSlug && candidate.worldSlug === item.worldSlug ? 2 : 0) +
        (candidate.type === item.type ? 1 : 0);
      return score(right) - score(left);
    })
    .filter((candidate) => {
      const key = getYouTubeEmbedUrl(candidate.youtubeUrl) ?? candidate.slug;
      if (relatedKeys.has(key)) return false;
      relatedKeys.add(key);
      return true;
    })
    .slice(0, 2);

  const playerUrl = getYouTubeEmbedUrl(item.youtubeUrl);
  // Publish a VideoObject only with a real thumbnail, publication date and
  // provider player. The watch page is not a direct video file.
  const videoSchema =
    canWatch && playerUrl && item.thumbnailUrl && item.publishedAt
      ? {
          "@context": "https://schema.org",
          "@type": "VideoObject",
          "@id": `https://bossieonthatbeat.com/cinema/${item.slug}#video`,
          name: title,
          description: summary,
          url: `https://bossieonthatbeat.com/cinema/${item.slug}`,
          thumbnailUrl: item.thumbnailUrl,
          uploadDate: item.publishedAt,
          duration: item.durationSeconds ? `PT${item.durationSeconds}S` : undefined,
          embedUrl: playerUrl,
        }
      : null;

  return (
    <PageShell worldSlug={item.worldSlug}>
      {videoSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(videoSchema) }} />
      )}
      <section className="page-hero cinema-detail-hero">
        <nav aria-label="Breadcrumb" className="cinema-detail-breadcrumb">
          <Link href="/cinema">Cinema</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{title}</span>
        </nav>
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

      {related.length > 0 && (
        <section className="section-pad cinema-detail-related" aria-labelledby="cinema-related-heading">
          <div className="cinema-detail-related-heading">
            <div>
              <p className="eyebrow">MORE FROM BOSSIE CINEMA</p>
              <h2 id="cinema-related-heading">Keep exploring <em>the sound.</em></h2>
            </div>
            <Link href="/cinema" className="text-link">View all Cinema ↗</Link>
          </div>
          <div className="cinema-detail-related-grid">
            {related.map((candidate) => (
              <CinemaEditorialCard key={candidate.id} item={candidate} />
            ))}
          </div>
        </section>
      )}

      <div className="cinema-detail-return">
        <Link href="/cinema" className="button button-ghost">← Back to Cinema</Link>
      </div>
    </PageShell>
  );
}
