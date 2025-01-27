-- Add new columns to storage_tanks table
ALTER TABLE storage_tanks
ADD COLUMN IF NOT EXISTS last_cleaned TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS cleaner_id TEXT,
ADD COLUMN IF NOT EXISTS initial_volume FLOAT DEFAULT 0;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_storage_tanks_last_cleaned ON storage_tanks(last_cleaned);
CREATE INDEX IF NOT EXISTS idx_storage_tanks_cleaner_id ON storage_tanks(cleaner_id);