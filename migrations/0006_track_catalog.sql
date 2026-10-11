-- Store the parent release for individual tracks so complete album/EP
-- discographies remain understandable and machine-readable.
ALTER TABLE releases ADD COLUMN collection_title TEXT;

CREATE INDEX IF NOT EXISTS idx_releases_collection_title ON releases(collection_title);
