"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import styles from "./MusicDiscovery.module.css";

export type MusicDiscoveryItem = {
  id: string;
  slug: string;
  title: string;
  type: string;
  year: string | null;
  genres: string[];
  artworkUrl: string | null;
  canListen: boolean;
};

const PAGE_SIZE = 12;

/**
 * Browse actual published Bossie releases without hiding the catalogue behind
 * a static landing page. Search and genre selection run locally; no analytics
 * payload or external request is sent for entered search terms.
 */
export function MusicDiscovery({ releases }: { releases: MusicDiscoveryItem[] }) {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("all");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const genres = useMemo(() => {
    const counts = new Map<string, number>();
    for (const release of releases) {
      for (const name of release.genres) {
        counts.set(name, (counts.get(name) ?? 0) + 1);
      }
    }
    return [...counts.keys()].sort((a, b) => a.localeCompare(b));
  }, [releases]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return releases.filter((release) => {
      const matchesGenre = genre === "all" || release.genres.includes(genre);
      const matchesQuery =
        !needle ||
        [release.title, release.type, ...release.genres]
          .some((part) => part.toLocaleLowerCase().includes(needle));
      return matchesGenre && matchesQuery;
    });
  }, [releases, genre, query]);

  const visibleReleases = filtered.slice(0, visible);

  function updateSearch(value: string) {
    setQuery(value);
    setVisible(PAGE_SIZE);
  }

  function chooseGenre(value: string) {
    setGenre(value);
    setVisible(PAGE_SIZE);
  }

  return (
    <div className={styles.discovery}>
      <div className={styles.controls}>
        <div className={styles.filterHead}>
          <div>
            <p className={styles.eyebrow}>DISCOVER THE CATALOGUE</p>
            <h2>Find your next favourite.</h2>
          </div>
          <label className={styles.search}>
            <span className={styles.searchLabel}>Search releases</span>
            <input
              type="search"
              value={query}
              onChange={(event) => updateSearch(event.target.value)}
              placeholder="Search a title or sound…"
              aria-controls="bossie-releases"
            />
          </label>
        </div>
        <div className={styles.genreFilters} role="group" aria-label="Filter releases by genre">
          {["all", ...genres].map((name) => (
            <button
              key={name}
              type="button"
              aria-pressed={genre === name}
              className={genre === name ? styles.selected : undefined}
              onClick={() => chooseGenre(name)}
            >
              {name === "all" ? "All sounds" : name}
            </button>
          ))}
        </div>
        <p className={styles.resultCount} role="status" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? "release" : "releases"} found
        </p>
      </div>

      {visibleReleases.length > 0 ? (
        <div id="bossie-releases" className={styles.grid}>
          {visibleReleases.map((release, index) => (
            <article className={styles.release} key={release.id}>
              <Link className={styles.artwork} href={`/music/${release.slug}`} aria-label={`Discover ${release.title}`}>
                {release.artworkUrl ? (
                  <Image
                    src={release.artworkUrl}
                    fill
                    unoptimized
                    alt={`${release.title} — original cover artwork`}
                    sizes="(max-width: 600px) 90vw, (max-width: 960px) 46vw, 30vw"
                    loading={index < 3 ? "eager" : "lazy"}
                    decoding="async"
                    className={styles.artworkImage}
                  />
                ) : (
                  <div className={styles.artworkFallback}>
                    {/* Official asset, not a generic fabricated cover. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/brand/logo-mark.svg" alt="" width={70} height={70} />
                    <span>ARTWORK NOT AVAILABLE</span>
                  </div>
                )}
                <span className={styles.artworkArrow} aria-hidden="true">↗</span>
              </Link>
              <div className={styles.releaseMeta}>
                <span>{release.type.toUpperCase()}</span>
                <span>{release.year ?? "BOSSIE"}</span>
              </div>
              <h3><Link href={`/music/${release.slug}`}>{release.title}</Link></h3>
              <p className={styles.genres}>{release.genres.slice(0, 2).join(" / ") || "Original music"}</p>
              <div className={styles.releaseActions}>
                {release.canListen && <Link href={`/go/${release.slug}`}>Listen now ↗</Link>}
                <Link href={`/music/${release.slug}`}>Release details ↗</Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div id="bossie-releases" className={styles.empty}>
          <strong>No releases match that search.</strong>
          <p>Try another title or explore all Bossie sounds.</p>
          <button type="button" onClick={() => { updateSearch(""); chooseGenre("all"); }}>
            Show all releases ↗
          </button>
        </div>
      )}

      {visible < filtered.length && (
        <div className={styles.moreWrap}>
          <button
            className={styles.more}
            type="button"
            onClick={() => setVisible((count) => count + PAGE_SIZE)}
          >
            Load more releases <span aria-hidden="true">↓</span>
          </button>
        </div>
      )}
    </div>
  );
}
