import Link from "next/link";
import type { ReleaseWithLinks } from "@/lib/types/release";
import { getPrimaryListenLink, getWatchLink } from "@/lib/repository/release-repository";

const platformLabels: Record<string, string> = {
  spotify: "Spotify",
  "apple-music": "Apple Music",
  youtube: "YouTube",
  "youtube-music": "YouTube Music",
  "amazon-music": "Amazon Music",
  deezer: "Deezer",
  tidal: "TIDAL",
  qobuz: "Qobuz",
};

export function ReleaseArtwork({ release, large }: { release: ReleaseWithLinks; large?: boolean }) {
  const className = large ? "release-artwork large" : "release-artwork";
  if (release.artworkUrl) {
    return (
      <div
        className={className}
        style={{ backgroundImage: `url(${release.artworkUrl})` }}
        role="img"
        aria-label={`${release.title} artwork`}
      />
    );
  }
  return (
    <div className={className} aria-label={`${release.title} artwork placeholder`}>
      <span className="artwork-monogram">B</span>
      <span className="artwork-title">{release.title}</span>
    </div>
  );
}

export function StatusBadge({ status }: { status: ReleaseWithLinks["status"] }) {
  const labels: Record<string, string> = {
    live: "LIVE NOW",
    upcoming: "COMING NEXT",
    announced: "COMING SOON",
    project: "IN DEVELOPMENT",
    archived: "ARCHIVED",
    pending_review: "PENDING",
  };
  return <span className={`status-badge status-${status}`}>{labels[status] ?? status}</span>;
}

export function PlatformLinks({ release, smartlink }: { release: ReleaseWithLinks; smartlink?: boolean }) {
  const links = release.links.filter((l) => l.url);
  if (!links.length) return null;

  return (
    <div className="platform-links">
      {links.map((link) => (
        <a
          key={link.id}
          href={smartlink ? `/go/${release.slug}?platform=${link.platform}` : link.url}
          className="platform-btn"
          target={smartlink ? undefined : "_blank"}
          rel={smartlink ? undefined : "noreferrer"}
        >
          {platformLabels[link.platform] ?? link.platform} ↗
        </a>
      ))}
    </div>
  );
}

export function ReleaseActions({ release }: { release: ReleaseWithLinks }) {
  const listen = getPrimaryListenLink(release);
  const watch = getWatchLink(release);

  return (
    <div className="release-actions-v2">
      {listen && (
        <Link className="button button-gold" href={`/go/${release.slug}`}>
          PLAY NOW ↗
        </Link>
      )}
      {watch && (
        <a className="button button-ghost" href={watch.url} target="_blank" rel="noreferrer">
          WATCH ↗
        </a>
      )}
      {release.worldSlug && (
        <Link className="button button-ghost" href={`/worlds/${release.worldSlug}`}>
          ENTER THE WORLD ↗
        </Link>
      )}
    </div>
  );
}

export function ReleaseCard({ release }: { release: ReleaseWithLinks }) {
  return (
    <Link href={`/music/${release.slug}`} className="release-card-v2">
      <ReleaseArtwork release={release} />
      <div className="release-card-body">
        <StatusBadge status={release.status} />
        <h3>{release.title}</h3>
        <p>{release.tagline ?? release.description}</p>
        <span className="release-meta">
          {release.genres.slice(0, 2).join(" · ")}
          {release.releaseDate ? ` · ${release.releaseDate.slice(0, 4)}` : ""}
        </span>
      </div>
    </Link>
  );
}

export function ReleaseHero({ release }: { release: ReleaseWithLinks }) {
  return (
    <section className="release-hero section-pad">
      <div className="release-hero-grid">
        <ReleaseArtwork release={release} large />
        <div className="release-hero-copy">
          <StatusBadge status={release.status} />
          <p className="eyebrow">{release.type.toUpperCase()}</p>
          <h1>{release.title}</h1>
          <p className="release-artist">{release.artist}</p>
          {release.tagline && <p className="release-tagline">{release.tagline}</p>}
          <div className="release-meta-row">
            {release.genres.map((g) => (
              <span key={g} className="meta-chip">
                {g}
              </span>
            ))}
          </div>
          <ReleaseActions release={release} />
        </div>
      </div>
    </section>
  );
}
