import { notFound } from "next/navigation";
import { getAllGenres, getReleasesByGenre, slugifyGenre } from "@/lib/repository/release-repository";
import { ReleaseCard } from "@/components/release/ReleaseUI";
import { PageShell } from "@/components/SiteChrome";

export async function generateStaticParams() {
  const genres = await getAllGenres();
  return genres.map((g) => ({ slug: slugifyGenre(g) }));
}

export default async function GenrePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const genres = await getAllGenres();
  const genre = genres.find((g) => slugifyGenre(g) === slug);
  if (!genre) notFound();

  const releases = await getReleasesByGenre(slug);

  return (
    <PageShell>
      <section className="page-hero">
        <p className="eyebrow">GENRE</p>
        <h1>{genre.toUpperCase()}</h1>
        <p>Bossie releases in the {genre} universe.</p>
      </section>
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
