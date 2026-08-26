-- Public display title vs immutable provider (YouTube) title.
ALTER TABLE cinema_items ADD COLUMN provider_title TEXT;
ALTER TABLE cinema_items ADD COLUMN display_title TEXT;

UPDATE cinema_items
SET provider_title = title
WHERE provider_title IS NULL;
