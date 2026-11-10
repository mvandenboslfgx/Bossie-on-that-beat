import type { Metadata } from "next";
import { getAllCinema } from "@/lib/repository/release-repository";
import { BossieMark } from "@/components/brand/BossieMark";
import { CinemaEditorialCard } from "@/components/v3/CinemaEditorialCard";
import { PageShell } from "@/components/SiteChrome";
import type { CinemaCategory } from "@/lib/types/cinema";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cinema",
  description: "Watch the official Bossie on that beat visual archive: music videos, short films and creative releases connected to original music.",
  alternates: { canonical: "/cinema" },
};

const SECTION_GROUPS: Array<{ key: string; label: string; types: CinemaCategory[] }> = [
  { key: "features", label: "Feature Films", types: ["short-film", "film"] },
  { key: "music-videos", label: "Music Videos", types: ["music-video"] },
  { key: "official-audio", label: "Official Audio", types: ["official-audio"] },
  { key: "lyric-films", label: "Lyric Films", types: ["lyric-video"] },
  { key: "visualizers", label: "Visualizers", types: ["visualizer"] },
  { key: "shorts", label: "Shorts", types: ["short"] },
];

export default async function CinemaPage() {
  const items = await getAllCinema();
  const featured = items[0];

  return (
    <PageShell>
      <section className="page-hero compact-hero cinema-index-hero studio-secondary-hero">
        <BossieMark size="lg" className="section-mark" />
        <p className="eyebrow">BOSSIE CINEMA</p>
        <h1>Sound in<br /><em>motion.</em></h1>
        <p>Official music videos, short films, visualizers and moving stories from the Bossie catalogue.</p>
      </section>

      {featured && (
        <section className="section-pad">
          <p className="eyebrow">FEATURED</p>
          <CinemaEditorialCard item={featured} featured />
        </section>
      )}

      {SECTION_GROUPS.map((group) => {
        const filtered = items.filter((item) => item.id !== featured?.id && group.types.includes(item.type));
        if (!filtered.length) return null;
        return (
          <section key={group.key} className="section-pad">
            <div className="cinema-section-heading">
              <BossieMark size="sm" />
              <p className="eyebrow">{group.label.toUpperCase()}</p>
            </div>
            <div className="cinema-editorial-stack">
              {filtered.map((item) => (
                <CinemaEditorialCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        );
      })}

      {items.length === 0 && (
        <section className="section-pad">
          <p className="empty-state">No films published yet.</p>
        </section>
      )}
    </PageShell>
  );
}
