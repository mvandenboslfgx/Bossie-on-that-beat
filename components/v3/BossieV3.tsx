import type { ReleaseWithLinks } from "@/lib/types/release";
import Link from "next/link";
import { BossieMark } from "@/components/brand/BossieMark";
import { ReleaseActions, ReleaseArtwork } from "@/components/release/ReleaseUI";
import { formatWorldLabel, getTransmissionNumber } from "@/lib/catalog/transmission";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { siteSettings } from "@/lib/site-settings";

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
  const visual = release.heroImageUrl || release.artworkUrl;
  const backdropStyle = visual
    ? { backgroundImage: `url("${visual.replace(/"/g, "%22")}")` }
    : undefined;

  return (
    <header className={`current-world-hero world-skin-${release.worldSlug ?? "default"}`}>
      {backdropStyle ? (
        <div className="current-world-backdrop" style={backdropStyle} aria-hidden="true" />
      ) : null}
      <div className="current-world-scrim" aria-hidden="true" />
      <BossieMark size="xl" className="current-world-watermark" />
      <div className="current-world-grid">
        <div className="current-world-inner">
          <p className="eyebrow current-world-eyebrow">
            <span>Newest release</span>
            <span aria-hidden="true">/</span>
            <span>{tx}</span>
          </p>
          <p className="current-world-brand">{siteSettings.artistName}</p>
          <p className="current-world-role">Independent producer · composer · artist</p>
          <h1 className="current-world-title">{release.title}</h1>
          <p className="current-world-lede">
            {release.tagline ?? release.description ?? "A new world in sound and image."}
          </p>
          <div className="current-world-details" aria-label="Release details">
            <span>{world}</span>
            {release.releaseDate ? <span>{release.releaseDate.slice(0, 4)}</span> : null}
            {release.genres?.slice(0, 2).map((genre) => <span key={genre}>{genre}</span>)}
          </div>
          <ReleaseActions release={release} />
        </div>
        <Link className="current-world-art" href={`/music/${release.slug}`} aria-label={`Explore ${release.title}`}>
          <span className="current-world-art-index">B/{tx}</span>
          <ReleaseArtwork release={release} large priority />
          <span className="current-world-art-caption">Sound · Image · Story</span>
        </Link>
      </div>
      <div className="transmission-bar" aria-label="Latest release">
        <span className="transmission-bar-label">NEWEST RELEASE</span>
        <span className="transmission-bar-title">{release.title.toUpperCase()}</span>
        {release.releaseDate && (
          <span className="transmission-bar-date">
            {new Date(release.releaseDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" }).replace(/ /g, ".")}
          </span>
        )}
        <TrackedLink className="transmission-bar-link" href={`/go/${release.slug}`} releaseId={release.id} platform="smartlink">
          LISTEN →
        </TrackedLink>
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
      <span>RELEASE {tx} // LIVE</span>
      <span>{release.title.toUpperCase()}</span>
    </div>
  );
}
