-- Separate raw YouTube ingest from public editorial copy.
ALTER TABLE cinema_items ADD COLUMN provider_description_raw TEXT;
ALTER TABLE cinema_items ADD COLUMN editorial_summary TEXT;

UPDATE cinema_items
SET provider_description_raw = description
WHERE description IS NOT NULL AND provider_description_raw IS NULL;
