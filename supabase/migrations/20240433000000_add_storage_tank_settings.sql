-- Add settings columns to storage_tanks table
ALTER TABLE storage_tanks
ADD COLUMN IF NOT EXISTS temperature_threshold FLOAT DEFAULT 4.5,
ADD COLUMN IF NOT EXISTS capacity_warning_threshold INTEGER DEFAULT 90,
ADD COLUMN IF NOT EXISTS auto_cleaning_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS cleaning_interval INTEGER DEFAULT 7,
ADD COLUMN IF NOT EXISTS maintenance_interval INTEGER DEFAULT 30,
ADD COLUMN IF NOT EXISTS last_maintenance TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS next_maintenance TIMESTAMP WITH TIME ZONE;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_storage_tanks_next_maintenance ON storage_tanks(next_maintenance);
CREATE INDEX IF NOT EXISTS idx_storage_tanks_auto_cleaning ON storage_tanks(auto_cleaning_enabled);

-- Update RLS policies to include new columns
DROP POLICY IF EXISTS "Allow authenticated read access" ON storage_tanks;
DROP POLICY IF EXISTS "Allow authenticated update access" ON storage_tanks;

CREATE POLICY "Allow authenticated read access" 
ON storage_tanks FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated update access" 
ON storage_tanks FOR UPDATE 
TO authenticated 
USING (true);