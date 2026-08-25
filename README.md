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

Flow (never during public pageviews):

```text
Cloudflare Cron (0 */6 * * *)
  → bossie-on-that-beat-sync
  → Apple / Spotify / YouTube providers
  → D1 (bossie-platform)
  → website reads D1 only
```

### Providers

1. **Apple Music** — iTunes Search API (no credentials). Graceful cooldown on 429/403.
2. **Spotify** — official artist `4mNxC22iSgkO0uLp1dL4Fp` (`Bossie on that beat`).
   Requires Worker secrets:
   - `SPOTIFY_CLIENT_ID`
   - `SPOTIFY_CLIENT_SECRET`
   - `SPOTIFY_ARTIST_ID` (optional; defaults to canonical ID above)
3. **YouTube / Cinema** — official channel only.
   Requires:
   - `YOUTUBE_API_KEY`
   - `YOUTUBE_CHANNEL_ID`
   Low-confidence release matches → `pending_review` (hidden from public Cinema).
   No verified video URL → no Watch button.

### Matching + overrides

- Match order: ISRC → UPC → Spotify/Apple IDs → title+date → title
- Manual overrides win on conflict
- Empty gaps (artwork / Spotify URL / IDs) may still be filled on overridden releases
- Per-platform link overrides are respected
- Sync is idempotent (`slug` unique, `release_id+platform` unique, in-run dedupe)

### Activate Spotify (production)

```bash
npx wrangler whoami   # must be Bossie account 4f59aa5b14f5882688437af50ee8c2ac
npx wrangler secret put SPOTIFY_CLIENT_ID
npx wrangler secret put SPOTIFY_CLIENT_SECRET
npx wrangler secret put SPOTIFY_ARTIST_ID   # 4mNxC22iSgkO0uLp1dL4Fp
npx wrangler secret put SPOTIFY_CLIENT_ID --config workers/sync/wrangler.jsonc
npx wrangler secret put SPOTIFY_CLIENT_SECRET --config workers/sync/wrangler.jsonc
npx wrangler secret put SPOTIFY_ARTIST_ID --config workers/sync/wrangler.jsonc
npm run sync:worker:deploy
# then POST /sync twice with CRON_SECRET → expect 0 duplicate slugs
```

Official profiles live in `lib/site-settings.ts` (`streaming` / `social`). Unknown = omitted from UI.

Trigger sync manually:
```bash
curl -X POST https://bossie-on-that-beat-sync.bossie-on-that-beat.workers.dev/sync \
  -H "x-cron-secret: $CRON_SECRET"
```

### Admin review queue

Admin uses a **separate** secret from sync (`ADMIN_SECRET` on the **main** Worker only):

```bash
npx wrangler secret put ADMIN_SECRET   # main Worker — never on sync worker
```

```bash
# GET pending releases, cinema, and live quality scores
curl -sS https://bossieonthatbeat.com/api/admin/review \
  -H "x-admin-secret: $ADMIN_SECRET"

# Browser UI: /admin (unlock with admin secret in the form)
```

`CRON_SECRET` does **not** grant admin access. Missing or wrong `x-admin-secret` → `401`.

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
- **Spotify sync empty**: add Spotify client id/secret as Wrangler secrets (artist ID is already canonical).
- **YouTube cinema empty**: add `YOUTUBE_API_KEY` + official `YOUTUBE_CHANNEL_ID` secrets.
- **/api/catalog**: reads D1/seed only — never live Spotify/Apple on request.
Built by [VDB Digital](https://vdbdigital.nl).
