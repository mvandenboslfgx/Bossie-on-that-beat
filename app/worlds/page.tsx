import Link from "next/link";
import { getAllWorlds } from "@/lib/repository/release-repository";
import { PageShell } from "@/components/SiteChrome";

export default async function WorldsPage() {
  const worlds = await getAllWorlds();

  return (
    <PageShell>
      <section className="page-hero">
        <p className="eyebrow">CREATIVE UNIVERSES</p>
        <h1>WORLDS</h1>
        <p>Bossie is organized by worlds, not genre boxes. Each world carries its own sound, art direction and visual language.</p>
      </section>
      <section className="worlds-page-grid section-pad">
        {worlds.map((world, index) => (
          <Link key={world.slug} href={`/worlds/${world.slug}`} className="world-page-card">
            <span>WORLD {String(index + 1).padStart(3, "0")}</span>
            <h2>{world.title}</h2>
            <strong>{world.subtitle}</strong>
            <p>{world.description}</p>
          </Link>
        ))}
      </section>
    </PageShell>
  );
}
