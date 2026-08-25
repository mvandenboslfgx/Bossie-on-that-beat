import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllWorlds, getWorldBySlug, getReleasesByWorld } from "@/lib/repository/release-repository";
import { ReleaseCard } from "@/components/release/ReleaseUI";
import { PageShell } from "@/components/SiteChrome";

export async function generateStaticParams() {
  const worlds = await getAllWorlds();
  return worlds.map((w) => ({ slug: w.slug }));
}

export default async function WorldDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const world = await getWorldBySlug(slug);
  if (!world) notFound();

  const releases = await getReleasesByWorld(slug);

  return (
    <PageShell>
      <section className="page-hero world-hero">
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
            releases.map((r) => <ReleaseCard key={r.id} release={r} />)
          ) : (
            <p className="empty-state">No releases linked to this world yet.</p>
          )}
        </div>
      </section>

      <section className="section-pad">
        <Link className="back-link" href="/worlds">
          ← All worlds
        </Link>
      </section>
    </PageShell>
  );
}
