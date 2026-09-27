import Link from "next/link";
import type { ReleaseWithLinks } from "@/lib/types/release";
import { TrackedLink } from "@/components/analytics/TrackedLink";

export function TrackCatalog({ items }: { items: ReleaseWithLinks[] }) {
  return (
    <div className="track-catalog">
      {items.map((release, index) => (
        <article className="track-catalog-row" key={release.id}>
          <span className="track-catalog-index">{String(index + 1).padStart(2, "0")}</span>
          <div className="track-catalog-title">
            <p>{release.type}{release.collectionTitle && release.collectionTitle !== release.title ? ` · ${release.collectionTitle}` : ""}</p>
            <h3><Link href={`/music/${release.slug}`}>{release.title}</Link></h3>
            <span>{release.artist}</span>
          </div>
          <time dateTime={release.releaseDate}>{release.releaseDate ?? "—"}</time>
          <div className="track-catalog-actions">
            <TrackedLink href={`/go/${release.slug}`} releaseId={release.id} platform="smartlink">Listen ↗</TrackedLink>
            <Link href={`/music/${release.slug}`}>Details ↗</Link>
          </div>
        </article>
      ))}
    </div>
  );
}
