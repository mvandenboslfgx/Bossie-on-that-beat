import type { Metadata } from "next";
import { getAllCinema } from "@/lib/repository/release-repository";
import { BossieMark } from "@/components/brand/BossieMark";
import { CinemaEditorialCard } from "@/components/v3/CinemaEditorialCard";
import { PageShell } from "@/components/SiteChrome";
import type { CinemaCategory } from "@/lib/types/cinema";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cinema",
  description: "Bossie Cinema — music videos, official audio, lyric films and visual worlds.",
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
      <section className="page-hero compact-hero">
        <BossieMark size="lg" className="section-mark" />
        <p className="eyebrow">BOSSIE CINEMA</p>
        <h1>CINEMA</h1>
        <p>Sound in motion — editorial transmissions, not raw feed dumps.</p>
      </section>

      {featured && (
        <section className="section-pad">
          <p className="eyebrow">FEATURED</p>
          <CinemaEditorialCard item={featured} featured />
        </section>
      )}

      {SECTION_GROUPS.map((group) => {
        const filtered = items.filter((i) => group.types.includes(i.type));
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
          <p className="empty-state">No cinema transmissions published yet.</p>
        </section>
      )}
    </PageShell>
  );
}
