-- Cinema sync review + official YouTube identity fields
ALTER TABLE cinema_items ADD COLUMN youtube_video_id TEXT;
ALTER TABLE cinema_items ADD COLUMN review_status TEXT NOT NULL DEFAULT 'published';
ALTER TABLE cinema_items ADD COLUMN manual_override INTEGER NOT NULL DEFAULT 0;

CREATE UNIQUE INDEX IF NOT EXISTS idx_cinema_youtube_video ON cinema_items(youtube_video_id);
CREATE INDEX IF NOT EXISTS idx_cinema_review_status ON cinema_items(review_status);
