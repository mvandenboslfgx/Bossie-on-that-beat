import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllCinema, getCinemaBySlug } from "@/lib/repository/release-repository";
import { PageShell } from "@/components/SiteChrome";

export async function generateStaticParams() {
  const items = await getAllCinema();
  return items.map((c) => ({ slug: c.slug }));
}

export default async function CinemaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getCinemaBySlug(slug);
  if (!item) notFound();

  const duration =
    item.durationSeconds != null
      ? `${Math.floor(item.durationSeconds / 60)}:${String(item.durationSeconds % 60).padStart(2, "0")}`
      : null;

  const videoSchema = item.youtubeUrl
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
        <p className="eyebrow">{item.type.replace("-", " ").toUpperCase()}</p>
        <h1>{item.title}</h1>
        {duration && <p className="cinema-duration">{duration}</p>}
        {item.description && <p>{item.description}</p>}
        <div className="cinema-actions">
          {item.youtubeUrl && (
            <a className="button button-gold" href={item.youtubeUrl} target="_blank" rel="noreferrer">
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
