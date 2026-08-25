"use client";

import { useCallback, useEffect, useState } from "react";
import type { CinemaItem } from "@/lib/types/cinema";
import type { ReleaseQualityScore } from "@/lib/release-sync/quality";
import type { ReleaseWithLinks } from "@/lib/types/release";

export function AdminReviewQueue() {
  const [secret, setSecret] = useState("");
  const [authed, setAuthed] = useState(false);
  const [releases, setReleases] = useState<ReleaseWithLinks[]>([]);
  const [cinema, setCinema] = useState<CinemaItem[]>([]);
  const [quality, setQuality] = useState<ReleaseQualityScore[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async (token: string) => {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/review", {
        headers: { "x-admin-secret": token },
      });
      if (!response.ok) throw new Error("Unauthorized");
      const data = (await response.json()) as {
        releases: ReleaseWithLinks[];
        cinema: CinemaItem[];
        quality: ReleaseQualityScore[];
      };
      setReleases(data.releases);
      setCinema(data.cinema);
      setQuality(data.quality ?? []);
      setAuthed(true);
      sessionStorage.setItem("bossie_admin_secret", token);
    } catch {
      setError("Invalid admin secret or API unavailable.");
      setAuthed(false);
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    const saved = sessionStorage.getItem("bossie_admin_secret");
    if (saved) {
      setSecret(saved);
      void load(saved);
    }
  }, [load]);

  async function act(action: "approve" | "reject", kind: "release" | "cinema", id: string) {
    if (!secret) return;
    setBusy(true);
    try {
      const response = await fetch("/api/admin/review", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-secret": secret },
        body: JSON.stringify({ action, kind, id }),
      });
      if (!response.ok) throw new Error("failed");
      await load(secret);
    } catch {
      setError("Action failed.");
    } finally {
      setBusy(false);
    }
  }

  if (!authed) {
    return (
      <form
        className="admin-auth"
        onSubmit={(event) => {
          event.preventDefault();
          void load(secret);
        }}
      >
        <p className="eyebrow">ADMIN ACCESS</p>
        <h2>Review queue</h2>
        <p>Enter the Bossie admin secret (separate from the sync cron secret).</p>
        <label>
          Admin secret
          <input type="password" value={secret} onChange={(e) => setSecret(e.target.value)} autoComplete="off" />
        </label>
        <button type="submit" disabled={busy || !secret}>
          Unlock
        </button>
        {error && <p className="form-error">{error}</p>}
      </form>
    );
  }

  const lowQuality = quality.filter((q) => q.overall < 75).slice(0, 12);

  return (
    <div className="admin-queue">
      <header className="admin-queue-header">
        <div>
          <p className="eyebrow">BOSSIE ADMIN</p>
          <h1>Review queue</h1>
        </div>
        <button type="button" onClick={() => void load(secret)} disabled={busy}>
          Refresh
        </button>
      </header>

      {error && <p className="form-error">{error}</p>}

      <section>
        <h2>Live catalogue quality ({quality.length})</h2>
        <p className="admin-empty">Lowest scores first — tune classification and metadata from here.</p>
        <div className="admin-quality-wrap">
          <table className="admin-quality-table">
            <thead>
              <tr>
                <th>Release</th>
                <th>Overall</th>
                <th>Meta</th>
                <th>Art</th>
                <th>Spotify</th>
                <th>Apple</th>
                <th>YT</th>
                <th>Class</th>
                <th>World</th>
                <th>Flags</th>
              </tr>
            </thead>
            <tbody>
              {lowQuality.map((row) => (
                <tr key={row.slug}>
                  <td>
                    <a href={`/music/${row.slug}`} target="_blank" rel="noreferrer">
                      {row.title}
                    </a>
                  </td>
                  <td>{row.overall}%</td>
                  <td>{row.metadata}%</td>
                  <td>{row.artwork}%</td>
                  <td>{row.spotify}%</td>
                  <td>{row.apple}%</td>
                  <td>{row.youtube}%</td>
                  <td>{row.classification}%</td>
                  <td>{row.world}%</td>
                  <td>{row.flags.join(", ") || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>Releases needing review ({releases.length})</h2>
        {releases.length === 0 ? (
          <p className="admin-empty">No pending releases.</p>
        ) : (
          <ul className="admin-list">
            {releases.map((release) => (
              <li key={release.id} className="admin-card">
                <div className="admin-card-main">
                  {release.artworkUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={release.artworkUrl} alt="" width={72} height={72} />
                  ) : null}
                  <div>
                    <strong>{release.title}</strong>
                    <p>
                      {release.status} · confidence {release.classificationConfidence?.toFixed(2) ?? "—"}
                    </p>
                    <p>{release.genres.join(", ") || "No genres"}</p>
                  </div>
                </div>
                <div className="admin-card-actions">
                  <button type="button" onClick={() => void act("approve", "release", release.id)} disabled={busy}>
                    Approve
                  </button>
                  <button type="button" onClick={() => void act("reject", "release", release.id)} disabled={busy}>
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Cinema needing review ({cinema.length})</h2>
        {cinema.length === 0 ? (
          <p className="admin-empty">No pending cinema items.</p>
        ) : (
          <ul className="admin-list">
            {cinema.map((item) => (
              <li key={item.id} className="admin-card">
                <div className="admin-card-main">
                  {item.thumbnailUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.thumbnailUrl} alt="" width={120} height={68} />
                  ) : null}
                  <div>
                    <strong>{item.title}</strong>
                    <p>
                      {item.type} · release: {item.releaseSlug ?? "unlinked"}
                    </p>
                    {item.youtubeUrl ? (
                      <a href={item.youtubeUrl} target="_blank" rel="noreferrer">
                        Watch
                      </a>
                    ) : null}
                  </div>
                </div>
                <div className="admin-card-actions">
                  <button type="button" onClick={() => void act("approve", "cinema", item.id)} disabled={busy}>
                    Approve
                  </button>
                  <button type="button" onClick={() => void act("reject", "cinema", item.id)} disabled={busy}>
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
