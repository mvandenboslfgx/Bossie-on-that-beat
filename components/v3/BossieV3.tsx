import type { ReleaseWithLinks } from "@/lib/types/release";
import Link from "next/link";
import { BossieMark } from "@/components/brand/BossieMark";
import { BossieLogo } from "@/components/brand/BossieLogo";
import { ReleaseActions } from "@/components/release/ReleaseUI";
import { formatWorldLabel, getTransmissionNumber } from "@/lib/catalog/transmission";

export function CatalogProof({ refreshedAt, liveCount, latestSlug }: { refreshedAt: string; liveCount: number; latestSlug?: string }) {
  return (
    <meta
      name="bossie-catalog-proof"
      content={`refreshed=${refreshedAt};live=${liveCount};latest=${latestSlug ?? "none"}`}
    />
  );
}

export function CurrentWorldHero({
  release,
  live,
}: {
  release: ReleaseWithLinks;
  live: ReleaseWithLinks[];
}) {
  const tx = getTransmissionNumber(live, release.slug);
  const world = formatWorldLabel(release.worldSlug);
  const visual = release.artworkUrl;

  return (
    <header
      className={`current-world-hero world-skin-${release.worldSlug ?? "default"}`}
      style={
        visual
          ? {
              backgroundImage: `linear-gradient(180deg, rgba(5,5,5,.55) 0%, rgba(5,5,5,.92) 68%), url(${visual})`,
            }
          : undefined
      }
    >
      <BossieMark size="xl" className="current-world-watermark" />
      <div className="current-world-inner">
        <BossieLogo variant="primary" href="/" className="current-world-logo" priority />
        <p className="eyebrow transmission-eyebrow">CURRENT WORLD · TRANSMISSION {tx}</p>
        <h1 className="current-world-title">{release.title}</h1>
        <p className="current-world-world">{world}</p>
        {release.genres?.length ? (
          <p className="current-world-meta">{release.genres.slice(0, 3).join(" / ")}</p>
        ) : null}
        <ReleaseActions release={release} />
      </div>
      <div className="transmission-bar" aria-label="Latest signal">
        <span className="transmission-bar-label">LATEST SIGNAL</span>
        <span className="transmission-bar-title">{release.title.toUpperCase()}</span>
        {release.releaseDate && (
          <span className="transmission-bar-date">
            {new Date(release.releaseDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" }).replace(/ /g, ".")}
          </span>
        )}
        <Link className="transmission-bar-link" href={`/go/${release.slug}`}>
          SPOTIFY →
        </Link>
        <Link className="transmission-bar-link" href="/cinema">
          CINEMA →
        </Link>
      </div>
    </header>
  );
}

export function TransmissionBar({ release, live }: { release: ReleaseWithLinks; live: ReleaseWithLinks[] }) {
  const tx = getTransmissionNumber(live, release.slug);
  return (
    <div className="transmission-bar transmission-bar-inline">
      <span>BOSSIE TRANSMISSION {tx} // LIVE</span>
      <span>{release.title.toUpperCase()}</span>
    </div>
  );
}
