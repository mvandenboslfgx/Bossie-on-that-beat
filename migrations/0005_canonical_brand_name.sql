-- Canonical public artist name. Provider aliases remain confined to sync matching.
UPDATE releases
SET artist = 'Bossie on that beat', updated_at = datetime('now')
WHERE lower(artist) IN ('bossie on the beat', 'bossie on that beat');
