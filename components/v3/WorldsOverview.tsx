import Link from "next/link";
import type { World } from "@/lib/types/world";
import type { WorldSkin } from "@/lib/worlds/tokens";
import { BossieMark } from "@/components/brand/BossieMark";
import { splitWorldTitle } from "@/lib/worlds/tokens";

export type WorldOverviewItem = {
  world: World;
  skin: WorldSkin | null;
  count: number;
  genres: string[];
  visual?: string;
};

function WorldTitle({ label, layout }: { label: string; layout: string }) {
  const parts = splitWorldTitle(label);
  if ((layout === "seal" || layout === "alpine") && parts.length === 2) {
    return (
      <h2 className="world-poster-title world-poster-title-split">
        <span>{parts[0]}</span>
        <span>{parts[1]}</span>
      </h2>
    );
  }
  return <h2 className="world-poster-title">{label}</h2>;
}

export function WorldOverviewCard({ item }: { item: WorldOverviewItem }) {
  const { world, skin, count, genres, visual } = item;
  const layout = skin?.overviewLayout ?? "noir";
  const teaser = skin?.teaser ?? world.description.split(/[.!?]/)[0] + ".";
  const cta = skin?.ctaLabel ?? "ENTER";
  const meta = [
    `${count} ${count === 1 ? "RELEASE" : "RELEASES"}`,
    ...genres.slice(0, 2).map((g) => g.toUpperCase()),
  ].join(" · ");

  return (
    <Link
      href={`/worlds/${world.slug}`}
      className={`world-poster world-poster-${layout} world-skin-${world.slug}`}
      style={
        visual
          ? {
              ["--world-poster-image" as string]: `url(${visual})`,
            }
          : undefined
      }
    >
      <div className="world-poster-media" aria-hidden="true" />
      <div className="world-poster-scrim" aria-hidden="true" />
      <BossieMark size="md" className={`world-poster-mark world-mark-${skin?.markTreatment ?? "crown"}`} decorative={false} />

      <div className="world-poster-copy">
        <p className="world-poster-id">WORLD {skin?.number ?? "—"}</p>
        <WorldTitle label={world.title} layout={layout} />
        {world.subtitle && <p className="world-poster-sub">{world.subtitle}</p>}
        <p className="world-poster-teaser">{teaser}</p>
        <p className="world-poster-meta">{meta}</p>
        <span className="world-poster-cta">
          {cta} <span aria-hidden="true">↗</span>
        </span>
      </div>
    </Link>
  );
}

export function WorldsOverview({ items }: { items: WorldOverviewItem[] }) {
  return (
    <section className="worlds-poster-rail section-pad" aria-label="Bossie Worlds">
      {items.map((item) => (
        <WorldOverviewCard key={item.world.slug} item={item} />
      ))}
    </section>
  );
}
