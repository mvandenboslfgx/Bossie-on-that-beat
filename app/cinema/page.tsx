import Link from "next/link";
import { getAllCinema } from "@/lib/repository/release-repository";
import { PageShell } from "@/components/SiteChrome";

const categoryLabels: Record<string, string> = {
  film: "Films",
  "music-video": "Music Videos",
  visualizer: "Visualizers",
  "short-film": "Short Films",
  short: "Shorts",
  teaser: "Teasers",
  trailer: "Trailers",
  "behind-the-scenes": "Behind the Scenes",
};

export default async function CinemaPage() {
  const items = await getAllCinema();
  const categories = [...new Set(items.map((i) => i.type))];

  return (
    <PageShell>
      <section className="page-hero">
        <p className="eyebrow">BOSSIE CINEMA</p>
        <h1>CINEMA</h1>
        <p>Music is only half the story.</p>
      </section>

      {categories.map((cat) => {
        const filtered = items.filter((i) => i.type === cat);
        return (
          <section key={cat} className="section-pad">
            <p className="eyebrow">{categoryLabels[cat] ?? cat}</p>
            <div className="cinema-grid-v2">
              {filtered.map((item) => (
                <Link key={item.id} href={`/cinema/${item.slug}`} className="cinema-card-v2">
                  <span className="cinema-type">{item.type.replace("-", " ")}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </PageShell>
  );
}
