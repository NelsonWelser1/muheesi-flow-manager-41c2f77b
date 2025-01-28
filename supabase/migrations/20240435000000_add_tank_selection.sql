-- Add tank selection column to storage_tanks table
ALTER TABLE storage_tanks
ADD COLUMN IF NOT EXISTS tank_selection TEXT CHECK (tank_selection IN ('Tank 1', 'Tank 2', 'Both Tanks'));

-- Update existing records to default to 'Tank 1'
UPDATE storage_tanks
SET tank_selection = 'Tank 1'
WHERE tank_selection IS NULL;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_storage_tanks_selection ON storage_tanks(tank_selection);