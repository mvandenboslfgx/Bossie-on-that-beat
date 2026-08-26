import Link from "next/link";
import type { CinemaItem } from "@/lib/types/cinema";
import type { ReleaseWithLinks } from "@/lib/types/release";
import type { World } from "@/lib/types/world";
import { BossieMark } from "@/components/brand/BossieMark";
import { CinemaEditorialCard } from "@/components/v3/CinemaEditorialCard";
import { getAdjacentWorlds, getWorldSkin } from "@/lib/worlds/tokens";
import { getPrimaryListenLink, getWatchLink } from "@/lib/repository/release-repository";
import { isVerifiedListenUrl } from "@/lib/links/url";

export function WorldExperience({
  world,
  releases,
  cinema,
}: {
  world: World;
  releases: ReleaseWithLinks[];
  cinema: CinemaItem[];
}) {
  const skin = getWorldSkin(world.slug);
  const adjacent = getAdjacentWorlds(world.slug);
  const visual = world.heroImage ?? releases.find((r) => r.artworkUrl)?.artworkUrl;
  const lore = skin?.lore ?? world.description;
  const number = skin?.number ?? "000";
  const markTreatment = skin?.markTreatment ?? "crown";
  const typography = skin?.typography ?? "anthem";

  const primaryRelease = releases.find((r) => r.status === "live") ?? releases[0];
  const listenLink = primaryRelease ? getPrimaryListenLink(primaryRelease) : undefined;
  const watchFromRelease = primaryRelease ? getWatchLink(primaryRelease) : undefined;
  const watchCinema = cinema.find((c) => c.youtubeUrl && isVerifiedListenUrl(c.youtubeUrl));
  const watchHref = watchCinema?.youtubeUrl ?? watchFromRelease?.url;

  return (
    <div className={`world-experience world-typo-${typography} world-mark-${markTreatment}`}>
      <header
        className="world-viewport-hero"
        style={
          visual
            ? {
                backgroundImage: `linear-gradient(180deg, rgba(5,5,5,.25) 0%, rgba(5,5,5,.55) 45%, rgba(5,5,5,.96) 100%), url(${visual})`,
              }
            : undefined
        }
      >
        <BossieMark size="xl" className={`world-hero-mark world-mark-${markTreatment}`} decorative={false} />
        <div className="world-hero-lightstripes" aria-hidden="true" />
        <div className="world-hero-inner">
          <p className="eyebrow world-id">WORLD {number}</p>
          <p className="world-hero-subtitle">{world.subtitle ?? skin?.label}</p>
          <h1 className="world-hero-title">{world.title}</h1>
          <div className="world-hero-actions">
            {listenLink?.url && (
              <a className="button button-gold" href={listenLink.url} target="_blank" rel="noreferrer">
                {skin?.listenLabel ?? "LISTEN TO THIS WORLD"} ↗
              </a>
            )}
            {watchHref && (
              <a className="button button-ghost" href={watchHref} target="_blank" rel="noreferrer">
                {skin?.watchLabel ?? "WATCH THIS WORLD"} ↗
              </a>
            )}
            {!listenLink && primaryRelease && (
              <Link className="button button-gold" href={`/music/${primaryRelease.slug}`}>
                {skin?.listenLabel ?? "LISTEN TO THIS WORLD"} ↗
              </Link>
            )}
          </div>
        </div>
      </header>

      <section className="world-lore section-pad">
        <BossieMark size="md" className="world-lore-seal" />
        <p className="eyebrow">MANIFESTO</p>
        <blockquote className="world-lore-quote">{lore}</blockquote>
        {world.themes && world.themes.length > 0 && (
          <div className="meta-row world-theme-chips">
            {world.themes.map((t) => (
              <span key={t} className="meta-chip">
                {t}
              </span>
            ))}
          </div>
        )}
      </section>

      {releases.length > 0 && (
        <section className="section-pad world-releases">
          <p className="eyebrow">RELEASES IN THIS WORLD</p>
          <div className="world-release-stack">
            {releases.map((release, index) => (
              <Link
                key={release.id}
                href={`/music/${release.slug}`}
                className={`world-release-row ${index % 2 === 1 ? "world-release-alt" : ""}`}
              >
                {release.artworkUrl && (
                  <div
                    className="world-release-art"
                    style={{ backgroundImage: `url(${release.artworkUrl})` }}
                    role="img"
                    aria-label={`${release.title} artwork`}
                  />
                )}
                <div className="world-release-copy">
                  <p className="eyebrow">
                    {String(index + 1).padStart(2, "0")} · {release.releaseDate?.slice(0, 4) ?? "LIVE"}
                  </p>
                  <h2>{release.title}</h2>
                  <p>{release.tagline ?? release.genres?.join(" / ")}</p>
                  <span className="text-link">Enter transmission ↗</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {cinema.length > 0 && (
        <section className="section-pad world-cinema">
          <p className="eyebrow">CINEMA FROM THIS WORLD</p>
          <div className="cinema-editorial-stack">
            {cinema.map((item) => (
              <CinemaEditorialCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      <section className="section-pad world-transit">
        <p className="eyebrow">CROSS INTO ANOTHER WORLD</p>
        <div className="world-transit-grid">
          {adjacent.prev && (
            <Link href={`/worlds/${adjacent.prev.slug}`} className="world-transit-card world-transit-prev">
              <BossieMark size="sm" />
              <span>PREVIOUS</span>
              <strong>{adjacent.prev.label}</strong>
            </Link>
          )}
          {adjacent.next && (
            <Link href={`/worlds/${adjacent.next.slug}`} className="world-transit-card world-transit-next">
              <BossieMark size="sm" />
              <span>NEXT</span>
              <strong>{adjacent.next.label}</strong>
            </Link>
          )}
        </div>
        <Link className="back-link" href="/worlds">
          ← All worlds
        </Link>
      </section>
    </div>
  );
}
