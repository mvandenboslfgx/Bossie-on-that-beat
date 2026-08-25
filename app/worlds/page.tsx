import type { Metadata } from "next";
import Link from "next/link";
import { getAllWorlds, getReleasesByWorld } from "@/lib/repository/release-repository";
import { PageShell } from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "Worlds",
  description: "Explore the creative universes of Bossie on the beat — each release world with its own sound and visual identity.",
  alternates: { canonical: "/worlds" },
};

export default async function WorldsPage() {
  const worlds = await getAllWorlds();

  const withMeta = await Promise.all(
    worlds.map(async (world) => {
      const releases = await getReleasesByWorld(world.slug);
      return {
        world,
        count: releases.length,
        genres: [...new Set(releases.flatMap((r) => r.genres))].slice(0, 3),
        visual: world.heroImage ?? releases.find((r) => r.artworkUrl)?.artworkUrl,
      };
    }),
  );

  return (
    <PageShell>
      <section className="page-hero compact-hero">
        <p className="eyebrow">CREATIVE UNIVERSES</p>
        <h1>WORLDS</h1>
        <p>Bossie is organized by worlds, not genre boxes. Each world carries its own sound, art direction and visual language.</p>
      </section>
      <section className="worlds-page-grid section-pad">
        {withMeta.map(({ world, count, genres, visual }, index) => (
          <Link
            key={world.slug}
            href={`/worlds/${world.slug}`}
            className={`world-page-card world-theme-${world.slug}`}
            style={visual ? { backgroundImage: `linear-gradient(180deg, rgba(5,5,5,.35), rgba(5,5,5,.92)), url(${visual})` } : undefined}
          >
            <span>WORLD {String(index + 1).padStart(3, "0")}</span>
            <h2>{world.title}</h2>
            <strong>{world.subtitle}</strong>
            <p>{world.description}</p>
            <div className="world-card-meta">
              <span>{count} release{count === 1 ? "" : "s"}</span>
              {genres.length > 0 && <span>{genres.join(" · ")}</span>}
            </div>
            <span className="text-link">Enter world ↗</span>
          </Link>
        ))}
      </section>
    </PageShell>
  );
}
