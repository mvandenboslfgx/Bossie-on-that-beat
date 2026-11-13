import type { Metadata } from "next";
import { getAllCinema } from "@/lib/repository/release-repository";
import { BossieMark } from "@/components/brand/BossieMark";
import { CinemaEditorialCard } from "@/components/v3/CinemaEditorialCard";
import { PageShell } from "@/components/SiteChrome";
import type { CinemaCategory } from "@/lib/types/cinema";
import { getYouTubeEmbedUrl } from "@/lib/seo/youtube";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cinema",
  description: "Watch the official Bossie on that beat visual archive: music videos, short films and creative releases connected to original music.",
  alternates: { canonical: "/cinema" },
};

const SECTION_GROUPS: Array<{ key: string; label: string; types: CinemaCategory[] }> = [
  { key: "features", label: "Films & Stories", types: ["short-film", "film"] },
  { key: "music-videos", label: "Music Videos", types: ["music-video"] },
  { key: "official-audio", label: "Official Audio", types: ["official-audio"] },
  { key: "lyric-films", label: "Lyric Films", types: ["lyric-video"] },
  { key: "visualizers", label: "Visualizers", types: ["visualizer"] },
  { key: "shorts", label: "Shorts", types: ["short"] },
  { key: "previews", label: "Teasers & Trailers", types: ["teaser", "trailer"] },
  { key: "behind-the-scenes", label: "Behind the Scenes", types: ["behind-the-scenes"] },
];

export default async function CinemaPage() {
  const catalogue = await getAllCinema();
  // Keep separate edits of the same title, but never show an identical upload twice.
  const seenVideos = new Set<string>();
  const items = catalogue.filter((item) => {
    const key = item.youtubeVideoId || getYouTubeEmbedUrl(item.youtubeUrl);
    if (!key) return true;
    if (seenVideos.has(key)) return false;
    seenVideos.add(key);
    return true;
  });
  // Editorial selections take precedence; otherwise lead with a proper film
  // or music video rather than automatically promoting the newest Short.
  const featured =
    items.find((item) => item.featured) ??
    items.find((item) => ["film", "short-film", "music-video"].includes(item.type)) ??
    items[0];

  return (
    <PageShell>
      <section className="page-hero compact-hero cinema-index-hero studio-secondary-hero">
        <BossieMark size="lg" className="section-mark" />
        <p className="eyebrow">BOSSIE CINEMA</p>
        <h1>Sound in<br /><em>motion.</em></h1>
        <p>Official music videos, short films, visualizers and moving stories from the Bossie catalogue.</p>
      </section>

      {featured && (
        <section className="section-pad cinema-index-section" aria-labelledby="cinema-featured-heading">
          <p className="eyebrow">CURATED SELECTION</p>
          <h2 id="cinema-featured-heading" className="cinema-section-title">Featured <em>story.</em></h2>
          <CinemaEditorialCard item={featured} featured />
        </section>
      )}

      {SECTION_GROUPS.map((group) => {
        const filtered = items.filter((item) => item.id !== featured?.id && group.types.includes(item.type));
        if (!filtered.length) return null;
        return (
          <section key={group.key} className={`section-pad cinema-index-section cinema-collection-${group.key}`} aria-labelledby={`cinema-${group.key}-heading`}>
            <div className="cinema-section-heading">
              <BossieMark size="sm" />
              <div>
                <p className="eyebrow">BOSSIE CINEMA COLLECTION</p>
                <h2 id={`cinema-${group.key}-heading`} className="cinema-section-title">{group.label}</h2>
              </div>
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
