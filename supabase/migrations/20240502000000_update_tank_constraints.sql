
-- First, drop the existing constraint if it exists
ALTER TABLE storage_tanks 
DROP CONSTRAINT IF EXISTS check_status;

-- Add the new constraint with the correct status values
ALTER TABLE storage_tanks 
ADD CONSTRAINT check_status 
CHECK (status IN ('active', 'suspended', 'out_of_service'));

-- Set default status to 'active' for new tanks
ALTER TABLE storage_tanks 
ALTER COLUMN status SET DEFAULT 'active';

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_storage_tanks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_storage_tanks_timestamp
    BEFORE UPDATE ON storage_tanks
    FOR EACH ROW
    EXECUTE FUNCTION update_storage_tanks_updated_at();

-- Update any null statuses to 'active'
UPDATE storage_tanks 
SET status = 'active' 
WHERE status IS NULL;

