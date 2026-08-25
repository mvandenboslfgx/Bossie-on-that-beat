import Link from "next/link";
import type { ReleaseWithLinks } from "@/lib/types/release";

export function ReleaseCover({ release }: { release: ReleaseWithLinks }) {
  return (
    <div
      className="catalog-cover"
      style={release.artworkUrl ? { backgroundImage: `url(${release.artworkUrl})` } : undefined}
    >
      {!release.artworkUrl && (
        <>
          <span className="cover-monogram">B</span>
          <span className="cover-title">{release.title}</span>
        </>
      )}
    </div>
  );
}

export function ReleaseCard({ release }: { release: ReleaseWithLinks }) {
  return (
    <Link href={`/music/${release.slug}`} className="catalog-card">
      <ReleaseCover release={release} />
      <div className="catalog-card-copy">
        <div className="catalog-meta">
          {release.releaseDate?.slice(0, 4) ?? "BOSSIE"} · {release.genres[0] ?? "Music"}
        </div>
        <h3>{release.title}</h3>
        <p>{release.tagline ?? release.description}</p>
        <span className="catalog-open">Open release ↗</span>
      </div>
    </Link>
  );
}
