import type { Metadata } from "next";
import { BossieMark } from "@/components/brand/BossieMark";
import { WorldsOverview } from "@/components/v3/WorldsOverview";
import { getAllWorlds, getReleasesByWorld } from "@/lib/repository/release-repository";
import { PageShell } from "@/components/SiteChrome";
import { getWorldSkin } from "@/lib/worlds/tokens";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Worlds",
  description:
    "Explore the creative universes of Bossie on the beat — each release world with its own sound and visual identity.",
  alternates: { canonical: "/worlds" },
};

export default async function WorldsPage() {
  const worlds = await getAllWorlds();

  const items = await Promise.all(
    worlds.map(async (world) => {
      const releases = await getReleasesByWorld(world.slug);
      return {
        world,
        skin: getWorldSkin(world.slug),
        count: releases.length,
        genres: [...new Set(releases.flatMap((r) => r.genres))].slice(0, 3),
        visual: world.heroImage ?? releases.find((r) => r.artworkUrl)?.artworkUrl,
      };
    }),
  );

  return (
    <PageShell>
      <section className="page-hero compact-hero worlds-index-hero">
        <BossieMark size="md" className="section-mark" />
        <p className="eyebrow">CREATIVE UNIVERSES</p>
        <h1>WORLDS</h1>
        <p className="worlds-index-lede">Eight homes. One brand. Enter a world.</p>
      </section>
      <WorldsOverview items={items} />
    </PageShell>
  );
}
