import Link from "next/link";
import type { ReleaseWithLinks } from "@/lib/types/release";
import { BossieMark } from "@/components/brand/BossieMark";
import { ReleaseActions, StatusBadge } from "@/components/release/ReleaseUI";
import { formatWorldLabel, getTransmissionNumber } from "@/lib/catalog/transmission";
import { getWorldSkin } from "@/lib/worlds/tokens";

export function ReleaseMiniWorld({
  release,
  live,
}: {
  release: ReleaseWithLinks;
  live: ReleaseWithLinks[];
}) {
  const tx = getTransmissionNumber(live, release.slug);
  const visual = release.artworkUrl;
  const skin = getWorldSkin(release.worldSlug);
  const markTreatment = skin?.markTreatment ?? "crown";
  const typography = skin?.typography ?? "anthem";
  const isLight = skin?.navTone === "light";
  const overlay = isLight
    ? "linear-gradient(180deg, rgba(232,238,244,.35) 0%, rgba(247,245,240,.92) 78%)"
    : "linear-gradient(180deg, rgba(5,5,5,.35) 0%, rgba(5,5,5,.92) 78%)";

  return (
    <header
      className={`release-mini-world world-skin-${release.worldSlug ?? "default"} world-typo-${typography} world-mark-${markTreatment}`}
      style={
        visual
          ? {
              backgroundImage: `${overlay}, url(${visual})`,
            }
          : undefined
      }
    >
      <BossieMark size="xl" className={`release-mini-watermark world-mark-${markTreatment}`} />
      <div className="world-hero-lightstripes" aria-hidden="true" />
      <div className="release-signal-block">
        <p className="eyebrow">
          TRANSMISSION {tx} · {formatWorldLabel(release.worldSlug)}
          {skin ? ` · WORLD ${skin.number}` : ""}
        </p>
        <StatusBadge status={release.status} />
        <h1>{release.title}</h1>
        <p className="release-artist">{release.artist}</p>
        {release.genres?.length ? (
          <p className="current-world-meta">{release.genres.join(" / ")} · {release.releaseDate?.slice(0, 4)}</p>
        ) : null}
        <ReleaseActions release={release} />
        {release.worldSlug && (
          <Link className="text-link release-world-enter" href={`/worlds/${release.worldSlug}`}>
            Enter {skin?.label ?? formatWorldLabel(release.worldSlug)} ↗
          </Link>
        )}
      </div>
    </header>
  );
}

export function ReleaseSignalBlock({ release }: { release: ReleaseWithLinks }) {
  const signal = release.tagline ?? release.description;
  if (!signal) return null;
  return (
    <section className="section-pad release-signal-section">
      <p className="eyebrow">THE SIGNAL</p>
      <blockquote>{signal}</blockquote>
    </section>
  );
}
