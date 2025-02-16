
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

-- If the table doesn't exist or needs to be recreated
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

-- Ensure constraints
ALTER TABLE storage_tanks 
DROP CONSTRAINT IF EXISTS check_tank_name;

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
