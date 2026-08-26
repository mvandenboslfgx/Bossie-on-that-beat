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
  const minimal = Boolean(skin?.overviewMinimalCopy);
  const brandedArt = Boolean(skin?.artworkContainsBrandMark);
  const hasVisual = Boolean(visual);
  const meta = [
    `${count} ${count === 1 ? "RELEASE" : "RELEASES"}`,
    ...genres.slice(0, 2).map((g) => g.toUpperCase()),
  ].join(" · ");

  const classes = [
    "world-poster",
    `world-poster-${layout}`,
    `world-skin-${world.slug}`,
    hasVisual ? "world-poster-has-visual" : "world-poster-novisual",
    brandedArt ? "world-poster-branded-art" : "",
    minimal ? "world-poster-minimal" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Link
      href={`/worlds/${world.slug}`}
      className={classes}
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
      {hasVisual && !brandedArt && (
        <BossieMark size="md" className={`world-poster-mark world-mark-${skin?.markTreatment ?? "crown"}`} />
      )}
      {hasVisual && brandedArt && (
        <BossieMark
          size="lg"
          className={`world-poster-mark world-poster-mark-ghost world-mark-${skin?.markTreatment ?? "crown"}`}
        />
      )}
      {!hasVisual && (
        <BossieMark size="lg" className={`world-poster-mark world-poster-mark-threshold world-mark-${skin?.markTreatment ?? "portal"}`} />
      )}

      <div className="world-poster-copy">
        <p className="world-poster-id">WORLD {skin?.number ?? "—"}</p>
        <WorldTitle label={world.title} layout={layout} />
        {world.subtitle && <p className="world-poster-sub">{world.subtitle}</p>}
        {!minimal && <p className="world-poster-teaser">{teaser}</p>}
        {!minimal && <p className="world-poster-meta">{meta}</p>}
        {minimal && <p className="world-poster-meta world-poster-meta-alone">{meta}</p>}
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
