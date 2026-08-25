"use client";

import { useEffect, useMemo, useState } from "react";
import { isVerifiedListenUrl } from "@/lib/links/url";

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
    appleMusic: "https://music.apple.com/nl/album/crown-of-the-abyss-single/6785206018",
    artwork:
      "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/24/9e/40/249e402f-305e-2b06-2d76-5ace0447c80b/artwork.jpg/1200x1200bb.jpg",
  },
  {
    title: "One World One Dream",
    status: "live",
    appleMusic: "https://music.apple.com/nl/album/one-world-one-dream-world-cup-song-2026-single/6785294600",
    amazonMusic: "https://music.amazon.com/tracks/B0H6SMW3Q2",
    artwork:
      "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/6f/95/50/6f9550f4-4ee7-7441-beab-8714a2eeb234/artwork.jpg/1200x1200bb.jpg",
  },
  {
    title: "Symphony Of The Storm",
    status: "live",
    appleMusic: "https://music.apple.com/nl/album/symphony-of-the-storm-single/6787258907",
    amazonMusic: "https://music.amazon.in/albums/B0H7NX3MVF",
    artwork:
      "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/a4/e3/56/a4e3566a-6c03-9af9-44af-cd2a28d0403a/artwork.jpg/1200x1200bb.jpg",
  },
  {
    title: "Nul Een Acht Zes",
    status: "live",
    appleMusic: "https://music.apple.com/nl/album/nul-een-acht-zes-single/6795139930",
    amazonMusic: "https://music.amazon.co.uk/albums/B0H7P9852Q",
    artwork:
      "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/d3/e5/ee/d3e5eeff-e69f-f97c-67f1-07cf76e027e6/artwork.jpg/1200x1200bb.jpg",
  },
];

const storeLabels: Array<[keyof Release, string]> = [
  ["hyperfollow", "Pre-save"],
  ["spotify", "Spotify"],
  ["appleMusic", "Apple Music"],
  ["amazonMusic", "Amazon Music"],
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

function sanitizeRelease(release: Release): Release {
  const next = { ...release };
  for (const [key] of storeLabels) {
    const url = next[key];
    if (typeof url === "string" && !isVerifiedListenUrl(url)) {
      delete next[key];
    }
  }
  return next;
}

export default function LiveCatalog() {
  const [releases, setReleases] = useState<Release[]>(fallback.map(sanitizeRelease));
  const [syncing, setSyncing] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/catalog", { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data: CatalogResponse) => {
        if (Array.isArray(data.releases) && data.releases.length) {
          setReleases(data.releases.map(sanitizeRelease));
        }
      })
      .catch(() => undefined)
      .finally(() => setSyncing(false));

    return () => controller.abort();
  }, []);

  const items = useMemo(() => releases, [releases]);

  return (
    <section className="live-catalog" aria-busy={syncing}>
      <div className="catalog-grid">
        {items.map((release) => (
          <article key={release.title} className="catalog-card">
            {release.artwork ? (
              <div
                className="catalog-art"
                style={{ backgroundImage: `url(${release.artwork})` }}
                role="img"
                aria-label={`${release.title} artwork`}
              />
            ) : (
              <div className="catalog-art catalog-art-empty" aria-hidden="true" />
            )}
            <p className="catalog-date">{formatDate(release.releaseDate)}</p>
            <h3>{release.title}</h3>
            <div className="catalog-links">
              {storeLabels.map(([key, label]) => {
                const href = release[key];
                if (typeof href !== "string" || !isVerifiedListenUrl(href)) return null;
                return (
                  <a key={key} href={href} target="_blank" rel="noreferrer">
                    {label} ↗
                  </a>
                );
              })}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
