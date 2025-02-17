
-- First check if we need to rename the column
DO $$ 
BEGIN
    -- Check if 'name' exists but 'tank_name' doesn't
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'storage_tanks' 
        AND column_name = 'name'
    ) AND NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'storage_tanks' 
        AND column_name = 'tank_name'
    ) THEN
        -- Rename 'name' to 'tank_name'
        ALTER TABLE storage_tanks 
        RENAME COLUMN name TO tank_name;
    END IF;
END $$;

-- Drop existing constraints and clear invalid data
ALTER TABLE IF EXISTS storage_tanks 
DROP CONSTRAINT IF EXISTS check_tank_name,
DROP CONSTRAINT IF EXISTS valid_tank_names;

-- Delete any rows that don't match our expected tank names
DELETE FROM storage_tanks 
WHERE tank_name NOT IN ('Tank A', 'Tank B') 
OR tank_name IS NULL;

-- Update any existing tanks to have valid names
UPDATE storage_tanks 
SET tank_name = 'Tank A' 
WHERE tank_name = 'Tank 1';

UPDATE storage_tanks 
SET tank_name = 'Tank B' 
WHERE tank_name = 'Tank 2';

-- Now recreate the table with proper constraints if it doesn't exist
CREATE TABLE IF NOT EXISTS storage_tanks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tank_name TEXT NOT NULL,
    capacity DECIMAL(10,2) NOT NULL DEFAULT 5000,
    current_volume DECIMAL(10,2) DEFAULT 0,
    temperature DECIMAL(5,2),
    last_cleaned TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add the constraint after cleaning up data
ALTER TABLE storage_tanks
ADD CONSTRAINT check_tank_name 
CHECK (tank_name IN ('Tank A', 'Tank B'));

-- Ensure proper indexes
DROP INDEX IF EXISTS idx_storage_tanks_name;
CREATE INDEX idx_storage_tanks_name ON storage_tanks(tank_name);

-- Insert default tanks if they don't exist
INSERT INTO storage_tanks (tank_name, capacity, status)
SELECT 'Tank A', 5000, 'active'
WHERE NOT EXISTS (SELECT 1 FROM storage_tanks WHERE tank_name = 'Tank A');

INSERT INTO storage_tanks (tank_name, capacity, status)
SELECT 'Tank B', 5000, 'active'
WHERE NOT EXISTS (SELECT 1 FROM storage_tanks WHERE tank_name = 'Tank B');

-- Make sure permissions are correct
GRANT ALL ON storage_tanks TO authenticated;
GRANT ALL ON storage_tanks TO service_role;

-- Force a schema refresh
SELECT pg_notify('pgrst', 'reload schema');
