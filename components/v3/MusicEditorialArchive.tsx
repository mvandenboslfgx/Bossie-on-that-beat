import Link from "next/link";
import type { ReleaseWithLinks } from "@/lib/types/release";
import { BossieMark } from "@/components/brand/BossieMark";
import { ReleaseArtwork } from "@/components/release/ReleaseUI";
import { formatWorldLabel, getTransmissionNumber } from "@/lib/catalog/transmission";

export function MusicEditorialArchive({ live }: { live: ReleaseWithLinks[] }) {
  return (
    <div className="music-editorial-archive">
      {live.map((release, index) => {
        const tx = getTransmissionNumber(live, release.slug);
        const isHero = index === 0;
        const isAlt = index % 2 === 1;

        return (
          <article
            key={release.id}
            className={`music-editorial-item ${isHero ? "music-editorial-hero" : ""} ${isAlt ? "music-editorial-alt" : ""} world-skin-${release.worldSlug ?? "default"}`}
          >
            <BossieMark size={isHero ? "lg" : "md"} className="music-editorial-mark" />
            <div className="music-editorial-index">
              <span className="music-editorial-num">{tx}</span>
            </div>
            <div className="music-editorial-visual">
              <Link href={`/music/${release.slug}`}>
                <ReleaseArtwork release={release} large={isHero} />
              </Link>
            </div>
            <div className="music-editorial-copy">
              <p className="eyebrow">{formatWorldLabel(release.worldSlug)}</p>
              <h2>
                <Link href={`/music/${release.slug}`}>{release.title}</Link>
              </h2>
              <p className="music-editorial-meta">
                {[release.releaseDate?.slice(0, 4), ...(release.genres ?? []).slice(0, 2)].filter(Boolean).join(" / ")}
              </p>
              {release.tagline && <p className="music-editorial-tagline">{release.tagline}</p>}
              <div className="music-editorial-actions">
                <Link className="button button-gold" href={`/go/${release.slug}`}>
                  LISTEN ↗
                </Link>
                <Link className="text-link" href={`/music/${release.slug}`}>
                  Explore ↗
                </Link>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
