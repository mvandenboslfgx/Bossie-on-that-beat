"use client";

import { useEffect, useMemo, useState } from "react";

type Release = {
  title: string;
  status?: "pre-save" | "live";
  spotify?: string;
  hyperfollow?: string;
  appleMusic?: string;
  amazonMusic?: string;
  youtube?: string;
  artwork?: string;
  releaseDate?: string;
};

type CatalogResponse = {
  releases?: Release[];
};

const fallback: Release[] = [
  {
    title: "CROWN OF THE ABYSS",
    status: "live",
    spotify: "https://open.spotify.com/album/2ZWAT8pIDAZwrTkcbmlBMx",
    youtube: "https://www.youtube.com/results?search_query=Bossie+on+that+beat+CROWN+OF+THE+ABYSS",
  },
  {
    title: "One World One Dream",
    status: "live",
    amazonMusic: "https://music.amazon.com/tracks/B0H6SMW3Q2",
    youtube: "https://www.youtube.com/results?search_query=Bossie+on+that+beat+One+World+One+Dream",
  },
  {
    title: "Symphony Of The Storm",
    status: "live",
    amazonMusic: "https://music.amazon.in/albums/B0H7NX3MVF",
    youtube: "https://www.youtube.com/results?search_query=Bossie+on+that+beat+Symphony+Of+The+Storm",
  },
  {
    title: "Nul Een Acht Zes",
    status: "live",
    amazonMusic: "https://music.amazon.co.uk/albums/B0H7P9852Q",
    youtube: "https://www.youtube.com/results?search_query=Bossie+on+that+beat+Nul+Een+Acht+Zes",
  },
];

const storeLabels: Array<[keyof Release, string]> = [
  ["hyperfollow", "Pre-save"],
  ["spotify", "Spotify"],
  ["appleMusic", "Apple Music"],
  ["amazonMusic", "Amazon"],
  ["youtube", "YouTube"],
];

function formatDate(value?: string) {
  if (!value) return "BOSSIE RELEASE";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "BOSSIE RELEASE";
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);
}

export default function LiveCatalog() {
  const [releases, setReleases] = useState<Release[]>(fallback);
  const [syncing, setSyncing] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/catalog", { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data: CatalogResponse) => {
        if (Array.isArray(data.releases) && data.releases.length) {
          setReleases(data.releases);
        }
      })
      .catch(() => undefined)
      .finally(() => setSyncing(false));

    return () => controller.abort();
  }, []);

  const visible = useMemo(() => releases.slice(0, 24), [releases]);

  return (
    <div className="live-catalog" aria-live="polite">
      <div className="live-catalog-head">
        <div>
          <span className={`sync-dot ${syncing ? "syncing" : ""}`} />
          <strong>{syncing ? "SYNCING CATALOG" : "LIVE CATALOG SYNC"}</strong>
        </div>
        <span>AUTO-REFRESH · NO REDEPLOY</span>
      </div>

      <div className="live-release-grid">
        {visible.map((release, index) => {
          const links = storeLabels.filter(([key]) => Boolean(release[key]));
          return (
            <article className="live-release" key={`${release.title}-${index}`}>
              <div
                className="live-cover"
                style={release.artwork ? { backgroundImage: `url(${release.artwork})` } : undefined}
              >
                {!release.artwork && <span>B</span>}
                <i>{String(index + 1).padStart(2, "0")}</i>
              </div>

              <div className="live-release-copy">
                <p>{release.status === "pre-save" ? "PRE-SAVE OPEN" : formatDate(release.releaseDate)}</p>
                <h3>{release.title}</h3>
                <div className="live-store-links">
                  {links.length ? (
                    links.map(([key, label]) => (
                      <a
                        href={String(release[key])}
                        target="_blank"
                        rel="noreferrer"
                        key={`${release.title}-${String(key)}`}
                      >
                        {label} ↗
                      </a>
                    ))
                  ) : (
                    <span>Streaming links syncing…</span>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
