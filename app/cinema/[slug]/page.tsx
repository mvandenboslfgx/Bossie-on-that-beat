import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllCinema, getCinemaBySlug } from "@/lib/repository/release-repository";
import { PageShell } from "@/components/SiteChrome";
import { isVerifiedListenUrl } from "@/lib/links/url";

export async function generateStaticParams() {
  const items = await getAllCinema();
  return items.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = await getCinemaBySlug(slug);
  if (!item) return {};
  return {
    title: `${item.title} — Cinema`,
    description: item.description ?? `${item.title} from Bossie Cinema.`,
    alternates: { canonical: `/cinema/${item.slug}` },
    openGraph: {
      title: item.title,
      description: item.description,
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

  const videoSchema =
    canWatch && item.youtubeUrl
      ? {
          "@context": "https://schema.org",
          "@type": "VideoObject",
          name: item.title,
          description: item.description,
          thumbnailUrl: item.thumbnailUrl,
          uploadDate: item.publishedAt,
          duration: item.durationSeconds ? `PT${item.durationSeconds}S` : undefined,
          contentUrl: item.youtubeUrl,
        }
      : null;

  return (
    <PageShell>
      {videoSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }} />
      )}
      <section className="page-hero cinema-detail-hero">
        {item.thumbnailUrl && (
          <div
            className="cinema-featured-visual"
            style={{ backgroundImage: `url(${item.thumbnailUrl})` }}
            role="img"
            aria-label={`${item.title} still`}
          />
        )}
        <p className="eyebrow">{item.type.replace("-", " ").toUpperCase()}</p>
        <h1>{item.title}</h1>
        {duration && <p className="cinema-duration">{duration}</p>}
        {item.description && <p>{item.description}</p>}
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
