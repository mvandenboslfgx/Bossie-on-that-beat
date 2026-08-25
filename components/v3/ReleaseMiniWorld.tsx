import Link from "next/link";
import type { ReleaseWithLinks } from "@/lib/types/release";
import { BossieMark } from "@/components/brand/BossieMark";
import { ReleaseActions, StatusBadge } from "@/components/release/ReleaseUI";
import { formatWorldLabel, getTransmissionNumber } from "@/lib/catalog/transmission";

export function ReleaseMiniWorld({
  release,
  live,
}: {
  release: ReleaseWithLinks;
  live: ReleaseWithLinks[];
}) {
  const tx = getTransmissionNumber(live, release.slug);
  const visual = release.artworkUrl;
  const signal = release.tagline ?? release.description;

  return (
    <header
      className={`release-mini-world world-skin-${release.worldSlug ?? "default"}`}
      style={
        visual
          ? {
              backgroundImage: `linear-gradient(180deg, rgba(5,5,5,.4) 0%, rgba(5,5,5,.94) 75%), url(${visual})`,
            }
          : undefined
      }
    >
      <BossieMark size="xl" className="release-mini-watermark" />
      <div className="release-signal-block">
        <p className="eyebrow">
          TRANSMISSION {tx} · {formatWorldLabel(release.worldSlug)}
        </p>
        <StatusBadge status={release.status} />
        <h1>{release.title}</h1>
        <p className="release-artist">{release.artist}</p>
        {release.genres?.length ? (
          <p className="current-world-meta">{release.genres.join(" / ")} · {release.releaseDate?.slice(0, 4)}</p>
        ) : null}
        <ReleaseActions release={release} />
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
