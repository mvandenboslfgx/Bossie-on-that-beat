# Bossie on the beat — V2 Platform

Official platform for [bossieonthatbeat.com](https://bossieonthatbeat.com).

Netflix × Spotify Artist Platform × Cinematic Universe × Custom Music Production Platform.

## Stack

- **Next.js 16** + React 19 + TypeScript
- **Cloudflare Workers** via `@opennextjs/cloudflare`
- **D1** (`bossie-platform`) — release catalogue, links, sync logs, requests
- **Separate sync worker** (`bossie-on-that-beat-sync`) — cron every 6 hours
- **Resend** — project request emails

## Project isolation

This repository is **Bossie only**. Worker names:

- `bossie-on-that-beat` — main site
- `bossie-on-that-beat-sync` — release sync cron

Never deploy to or modify other client Workers (e.g. Vermeulen Bouwservice).

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Without D1 locally, the app uses **seed data** from `data/seed/` (9 migrated releases).

## Cloudflare setup

1. Create D1 database:
   ```bash
   npx wrangler d1 create bossie-platform
   ```
   Update `database_id` in `wrangler.jsonc` and `workers/sync/wrangler.jsonc`.

2. Apply migrations:
   ```bash
   npm run db:migrate:local   # local
   npm run db:migrate:remote  # production
   ```

3. Copy `.env.example` → `.env.local` and fill secrets.

4. Preview on Workers runtime:
   ```bash
   npm run cf:preview
   ```

5. Deploy:
   ```bash
   npm run cf:deploy
   npm run sync:worker:deploy
   ```

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Next.js dev server |
| `npm run build` | Next.js production build |
| `npm run typecheck` | TypeScript check |
| `npm run cf:build` | OpenNext Cloudflare build |
| `npm run cf:preview` | Build + preview on Workers |
| `npm run cf:deploy` | Deploy main Bossie Worker |
| `npm run sync:worker:deploy` | Deploy sync cron worker |

## Architecture

```
data/seed/          → Initial catalogue (migrated V1 releases)
lib/repository/     → ReleaseRepository abstraction (D1 or seed fallback)
lib/release-sync/   → Discover, match, classify, persist
workers/sync/       → Cloudflare Cron Trigger (every 6h UTC)
app/                → Universe Home, Music 2.0, Worlds, Cinema, Smartlinks
```

## Release sync

Providers (priority):

1. **Apple Music** — iTunes Search API (no credentials)
2. **Spotify** — requires `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_ARTIST_ID`

Manual overrides always win over provider/AI data.

Trigger sync manually:
```bash
curl -X POST https://<sync-worker>/sync -H "x-cron-secret: $CRON_SECRET"
```

## Routes (P0)

| Route | Description |
|-------|-------------|
| `/` | Universe Home |
| `/music` | Music hub + filters |
| `/music/[slug]` | Release detail |
| `/music/latest` | Redirect to newest live release |
| `/music/upcoming` | Coming next |
| `/music/genre/[slug]` | Genre pages |
| `/worlds`, `/worlds/[slug]` | Bossie Worlds |
| `/cinema`, `/cinema/[slug]` | Bossie Cinema |
| `/links` | Bossie Link hub |
| `/go/[slug]`, `/go/latest` | Smartlinks |
| `/request` | Create Your Song wizard |

## DNS / domain

Production runs on Cloudflare Workers + D1.

- Apex: `https://bossieonthatbeat.com`
- Worker: `bossie-on-that-beat`
- D1: `bossie-platform`
- Sync: `bossie-on-that-beat-sync` (`0 */6 * * *`)

`www.bossieonthatbeat.com` redirects to the apex.

## Troubleshooting

- **Build fails on OpenNext**: run `npm run cf:build` and check Node 18+.
- **Empty catalogue**: seed data loads automatically; run D1 migrations for persistent storage.
- **Spotify sync empty**: add Spotify API credentials to env.

Built by [VDB Digital](https://vdbdigital.nl).
