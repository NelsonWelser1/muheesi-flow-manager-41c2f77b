
-- First, ensure we're working with the correct schema
SET search_path TO public;

-- Drop the column if it exists to ensure clean state
ALTER TABLE storage_tanks 
DROP COLUMN IF EXISTS service_end_date;

-- Add the column fresh
ALTER TABLE storage_tanks 
ADD COLUMN service_end_date TIMESTAMP WITH TIME ZONE;

-- Recreate the index
DROP INDEX IF EXISTS idx_storage_tanks_service_end_date;
CREATE INDEX idx_storage_tanks_service_end_date 
ON storage_tanks(service_end_date);

-- Update permissions
GRANT ALL ON storage_tanks TO authenticated;
GRANT ALL ON storage_tanks TO service_role;

-- Force a schema refresh
SELECT pg_notify('pgrst', 'reload schema');
