import { writeFileSync } from "fs";
import { seedReleases } from "../data/seed/releases.ts";
import { seedWorlds } from "../data/seed/worlds.ts";
import { seedCinema } from "../data/seed/cinema.ts";

function esc(value: unknown): string {
  if (value == null) return "NULL";
  return `'${String(value).replace(/'/g, "''")}'`;
}

const lines: string[] = [];

for (const r of seedReleases) {
  lines.push(
    `INSERT OR REPLACE INTO releases (id, slug, title, artist, type, status, release_date, announcement_date, artwork_url, genres, subgenres, moods, languages, tagline, description, story, world_slug, featured, priority, manual_override, first_seen_at, last_synced_at) VALUES (${esc(r.id)}, ${esc(r.slug)}, ${esc(r.title)}, ${esc(r.artist)}, ${esc(r.type)}, ${esc(r.status)}, ${esc(r.releaseDate)}, ${esc(r.announcementDate)}, ${esc(r.artworkUrl)}, ${esc(JSON.stringify(r.genres))}, ${esc(JSON.stringify(r.subgenres || []))}, ${esc(JSON.stringify(r.moods || []))}, ${esc(JSON.stringify(r.languages || []))}, ${esc(r.tagline)}, ${esc(r.description)}, ${esc(r.story)}, ${esc(r.worldSlug)}, ${r.featured ? 1 : 0}, ${r.priority || 0}, 1, ${esc(r.firstSeenAt)}, ${esc(r.lastSyncedAt)});`,
  );
  for (const l of r.links) {
    lines.push(
      `INSERT OR REPLACE INTO release_links (id, release_id, platform, url, verified, manual_override, first_seen_at, last_verified_at) VALUES (${esc(l.id)}, ${esc(l.releaseId)}, ${esc(l.platform)}, ${esc(l.url)}, 1, 1, ${esc(l.firstSeenAt)}, ${esc(l.lastVerifiedAt)});`,
    );
  }
}

for (const w of seedWorlds) {
  lines.push(
    `INSERT OR REPLACE INTO worlds (slug, title, subtitle, description, themes, aesthetic, featured, manual_override) VALUES (${esc(w.slug)}, ${esc(w.title)}, ${esc(w.subtitle)}, ${esc(w.description)}, ${esc(JSON.stringify(w.themes || []))}, ${esc(JSON.stringify(w.aesthetic || []))}, ${w.featured ? 1 : 0}, 0);`,
  );
}

for (const c of seedCinema) {
  lines.push(
    `INSERT OR REPLACE INTO cinema_items (id, slug, title, type, release_slug, world_slug, youtube_url, description, duration_seconds, featured) VALUES (${esc(c.id)}, ${esc(c.slug)}, ${esc(c.title)}, ${esc(c.type)}, ${esc(c.releaseSlug)}, ${esc(c.worldSlug)}, ${esc(c.youtubeUrl)}, ${esc(c.description)}, ${c.durationSeconds ?? "NULL"}, ${c.featured ? 1 : 0});`,
  );
}

writeFileSync("migrations/seed-bootstrap.sql", lines.join("\n"));
console.log("seed sql statements:", lines.length);
console.log(
  "statuses:",
  Object.fromEntries(
    (["live", "project", "upcoming"] as const).map((s) => [
      s,
      seedReleases.filter((r) => r.status === s).map((r) => r.slug),
    ]),
  ),
);
