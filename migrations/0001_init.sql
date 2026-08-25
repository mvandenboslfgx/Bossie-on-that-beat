-- Bossie Platform D1 Schema (bossie-platform)

CREATE TABLE IF NOT EXISTS releases (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  artist TEXT NOT NULL DEFAULT 'Bossie on the beat',
  type TEXT NOT NULL DEFAULT 'single',
  status TEXT NOT NULL DEFAULT 'project',
  release_date TEXT,
  announcement_date TEXT,
  isrc TEXT,
  upc TEXT,
  spotify_id TEXT,
  apple_music_id TEXT,
  artwork_url TEXT NOT NULL DEFAULT '',
  hero_image_url TEXT,
  genres TEXT NOT NULL DEFAULT '[]',
  subgenres TEXT DEFAULT '[]',
  moods TEXT DEFAULT '[]',
  languages TEXT DEFAULT '[]',
  vocal_types TEXT DEFAULT '[]',
  explicit INTEGER DEFAULT 0,
  energy TEXT,
  tagline TEXT,
  description TEXT,
  story TEXT,
  world_slug TEXT,
  cinema_ids TEXT DEFAULT '[]',
  lyrics TEXT,
  credits TEXT DEFAULT '[]',
  featured INTEGER DEFAULT 0,
  priority INTEGER DEFAULT 0,
  seo TEXT DEFAULT '{}',
  classification_confidence REAL,
  manual_override INTEGER DEFAULT 0,
  first_seen_at TEXT,
  last_synced_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_releases_slug ON releases(slug);
CREATE INDEX IF NOT EXISTS idx_releases_status ON releases(status);
CREATE INDEX IF NOT EXISTS idx_releases_world ON releases(world_slug);
CREATE INDEX IF NOT EXISTS idx_releases_featured ON releases(featured);

CREATE TABLE IF NOT EXISTS release_links (
  id TEXT PRIMARY KEY,
  release_id TEXT NOT NULL REFERENCES releases(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  verified INTEGER DEFAULT 0,
  manual_override INTEGER DEFAULT 0,
  first_seen_at TEXT NOT NULL,
  last_verified_at TEXT,
  UNIQUE(release_id, platform)
);

CREATE INDEX IF NOT EXISTS idx_release_links_release ON release_links(release_id);

CREATE TABLE IF NOT EXISTS worlds (
  slug TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT NOT NULL,
  hero_image TEXT,
  video TEXT,
  themes TEXT DEFAULT '[]',
  aesthetic TEXT DEFAULT '[]',
  featured INTEGER DEFAULT 0,
  manual_override INTEGER DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS cinema_items (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  release_slug TEXT,
  world_slug TEXT,
  youtube_url TEXT,
  video_url TEXT,
  thumbnail_url TEXT,
  poster_url TEXT,
  description TEXT,
  duration_seconds INTEGER,
  published_at TEXT,
  featured INTEGER DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_cinema_release ON cinema_items(release_slug);
CREATE INDEX IF NOT EXISTS idx_cinema_world ON cinema_items(world_slug);

CREATE TABLE IF NOT EXISTS smartlink_events (
  id TEXT PRIMARY KEY,
  release_id TEXT,
  platform TEXT,
  source TEXT,
  medium TEXT,
  campaign TEXT,
  country_code TEXT,
  device_type TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_smartlink_release ON smartlink_events(release_id);
CREATE INDEX IF NOT EXISTS idx_smartlink_created ON smartlink_events(created_at);

CREATE TABLE IF NOT EXISTS fan_subscriptions (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  release_id TEXT,
  source TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_fan_email ON fan_subscriptions(email);

CREATE TABLE IF NOT EXISTS project_requests (
  id TEXT PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'REQUESTED',
  payload TEXT NOT NULL,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sync_logs (
  id TEXT PRIMARY KEY,
  started_at TEXT NOT NULL,
  finished_at TEXT,
  status TEXT NOT NULL,
  releases_found INTEGER DEFAULT 0,
  releases_created INTEGER DEFAULT 0,
  releases_updated INTEGER DEFAULT 0,
  errors TEXT DEFAULT '[]',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS classification_overrides (
  id TEXT PRIMARY KEY,
  release_id TEXT NOT NULL REFERENCES releases(id) ON DELETE CASCADE,
  field TEXT NOT NULL,
  value TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(release_id, field)
);
