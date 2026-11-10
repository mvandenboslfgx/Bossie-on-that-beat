import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllGenres, getReleasesByGenre, slugifyGenre } from "@/lib/repository/release-repository";
import { ReleaseCard } from "@/components/release/ReleaseUI";
import { PageShell } from "@/components/SiteChrome";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const genres = await getAllGenres();
  const genre = genres.find((item) => slugifyGenre(item) === slug);
  if (!genre) return {};
  return {
    title: `${genre} music`,
    description: `Explore official ${genre} tracks and releases by Bossie on that beat.`,
    alternates: { canonical: `/music/genre/${slug}` },
  };
}

export default async function GenrePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const genres = await getAllGenres();
  const genre = genres.find((g) => slugifyGenre(g) === slug);
  if (!genre) notFound();

  const releases = await getReleasesByGenre(slug);

  return (
    <PageShell>
      <header className="page-hero brand-standard-hero">
        <p className="eyebrow">EXPLORE BY GENRE</p>
        <h1>{genre}<br /><em>music.</em></h1>
        <p>Discover original Bossie tracks and releases in the {genre} catalogue.</p>
      </header>
      <section className="section-pad">
        <div className="release-grid-v2">
          {releases.length ? (
            releases.map((r) => <ReleaseCard key={r.id} release={r} />)
          ) : (
            <p className="empty-state">No releases in this genre yet.</p>
          )}
        </div>
      </section>
    </PageShell>
  );
}
