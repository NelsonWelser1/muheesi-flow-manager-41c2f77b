-- Drop existing indexes if they exist to avoid conflicts
DROP INDEX IF EXISTS idx_storage_tanks_added_volume;
DROP INDEX IF EXISTS idx_storage_tanks_last_cleaned;
DROP INDEX IF EXISTS idx_storage_tanks_cleaner_id;

-- Add all required columns if they don't exist
ALTER TABLE storage_tanks
ADD COLUMN IF NOT EXISTS added_volume FLOAT DEFAULT 0,
ADD COLUMN IF NOT EXISTS initial_volume FLOAT DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_cleaned TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS cleaner_id TEXT;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_storage_tanks_added_volume ON storage_tanks(added_volume);
CREATE INDEX IF NOT EXISTS idx_storage_tanks_last_cleaned ON storage_tanks(last_cleaned);
CREATE INDEX IF NOT EXISTS idx_storage_tanks_cleaner_id ON storage_tanks(cleaner_id);

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow authenticated read access" ON storage_tanks;
DROP POLICY IF EXISTS "Allow authenticated update access" ON storage_tanks;
DROP POLICY IF EXISTS "Allow authenticated insert access" ON storage_tanks;

-- Create comprehensive policies
CREATE POLICY "Allow authenticated read access" 
ON storage_tanks FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated update access" 
ON storage_tanks FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated insert access" 
ON storage_tanks FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Enable RLS if not already enabled
ALTER TABLE storage_tanks ENABLE ROW LEVEL SECURITY;