-- Add volume related columns to storage_tanks if they don't exist
ALTER TABLE storage_tanks
ADD COLUMN IF NOT EXISTS added_volume FLOAT DEFAULT 0,
ADD COLUMN IF NOT EXISTS initial_volume FLOAT DEFAULT 0;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_storage_tanks_added_volume ON storage_tanks(added_volume);

-- Update the RLS policies to allow access to new columns
ALTER POLICY "Allow authenticated read access" ON storage_tanks
    FOR SELECT TO authenticated USING (true);

ALTER POLICY "Allow authenticated update access" ON storage_tanks
    FOR UPDATE TO authenticated USING (true);