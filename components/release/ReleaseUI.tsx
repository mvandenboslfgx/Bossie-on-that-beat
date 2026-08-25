import Link from "next/link";
import type { ReleaseWithLinks } from "@/lib/types/release";
import { getPrimaryListenLink, getWatchLink } from "@/lib/repository/release-repository";
import { platformDisplayNames } from "@/lib/site-settings";
import { isVerifiedListenUrl } from "@/lib/links/url";

const platformOrder = [
  "spotify",
  "apple-music",
  "youtube-music",
  "youtube",
  "amazon-music",
  "deezer",
  "tidal",
  "qobuz",
] as const;

export function ReleaseArtwork({ release, large }: { release: ReleaseWithLinks; large?: boolean }) {
  const className = large ? "release-artwork large" : "release-artwork";
  if (release.artworkUrl && isVerifiedListenUrl(release.artworkUrl)) {
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

function verifiedLinks(release: ReleaseWithLinks) {
  const seen = new Set<string>();
  const links = release.links.filter((l) => l.url && isVerifiedListenUrl(l.url));
  const ordered = [
    ...platformOrder.flatMap((platform) => links.filter((l) => l.platform === platform)),
    ...links.filter((l) => !platformOrder.includes(l.platform as (typeof platformOrder)[number])),
  ];
  return ordered.filter((link) => {
    const key = `${link.platform}:${link.url}`;
    if (seen.has(key) || seen.has(link.platform)) return false;
    seen.add(key);
    seen.add(link.platform);
    return true;
  });
}

export function PlatformLinks({ release, smartlink }: { release: ReleaseWithLinks; smartlink?: boolean }) {
  const links = verifiedLinks(release);
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
          {platformDisplayNames[link.platform] ?? link.platform} ↗
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
          LISTEN NOW ↗
        </Link>
      )}
      {watch && (
        <a className="button button-ghost" href={watch.url} target="_blank" rel="noreferrer">
          WATCH ↗
        </a>
      )}
      {release.worldSlug && (
        <Link className="button button-ghost" href={`/worlds/${release.worldSlug}`}>
          ENTER WORLD ↗
        </Link>
      )}
    </div>
  );
}

export function ReleaseCard({ release, withListen }: { release: ReleaseWithLinks; withListen?: boolean }) {
  const listen = withListen ? getPrimaryListenLink(release) : null;

  return (
    <article className={`release-card-v2 world-accent-${release.worldSlug ?? "default"}`}>
      <Link href={`/music/${release.slug}`} className="release-card-link">
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
      {withListen && listen && (
        <div className="release-card-actions">
          <Link className="button button-gold" href={`/go/${release.slug}`}>
            LISTEN ↗
          </Link>
          <Link className="text-link" href={`/music/${release.slug}`}>
            Explore ↗
          </Link>
        </div>
      )}
    </article>
  );
}

export function ReleaseHero({ release }: { release: ReleaseWithLinks }) {
  return (
    <section className={`release-hero section-pad world-accent-${release.worldSlug ?? "default"}`}>
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
            {release.releaseDate && <span className="meta-chip">{release.releaseDate}</span>}
          </div>
          <ReleaseActions release={release} />
        </div>
      </div>
    </section>
  );
}
