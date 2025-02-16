
-- First drop any existing constraints to avoid conflicts
ALTER TABLE IF EXISTS storage_tanks 
DROP CONSTRAINT IF EXISTS check_status;

-- Add or update the status column with proper constraints
ALTER TABLE storage_tanks 
DROP COLUMN IF EXISTS status;

ALTER TABLE storage_tanks 
ADD COLUMN status TEXT DEFAULT 'active';

-- Update constraints with all possible status values
ALTER TABLE storage_tanks 
ADD CONSTRAINT check_status 
CHECK (status IN ('active', 'suspended', 'out_of_service', 'maintenance'));

-- Ensure proper indexes exist
DROP INDEX IF EXISTS idx_storage_tanks_status;
CREATE INDEX idx_storage_tanks_status ON storage_tanks(status);

-- Update any existing rows to have a valid status
UPDATE storage_tanks 
SET status = 'active' 
WHERE status IS NULL;

-- Make sure permissions are correct
GRANT ALL ON storage_tanks TO authenticated;
GRANT ALL ON storage_tanks TO service_role;

-- Force a schema refresh
SELECT pg_notify('pgrst', 'reload schema');

-- Verify the column exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'storage_tanks' 
        AND column_name = 'status'
    ) THEN
        RAISE EXCEPTION 'Status column is missing!';
    END IF;
END $$;
