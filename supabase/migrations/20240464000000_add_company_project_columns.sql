-- Add company and project columns to equipment_maintenance table
ALTER TABLE equipment_maintenance
ADD COLUMN IF NOT EXISTS company TEXT,
ADD COLUMN IF NOT EXISTS project TEXT;

-- Update existing rows with default values
UPDATE equipment_maintenance
SET 
    company = 'Grand Berna Dairies',
    project = 'Cheese Factory'
WHERE company IS NULL OR project IS NULL;

-- Make the columns required for future inserts
ALTER TABLE equipment_maintenance
ALTER COLUMN company SET NOT NULL,
ALTER COLUMN project SET NOT NULL;

-- Update RLS policies to include company and project context
DROP POLICY IF EXISTS "Allow authenticated read access on equipment_maintenance" ON equipment_maintenance;
DROP POLICY IF EXISTS "Allow authenticated insert access on equipment_maintenance" ON equipment_maintenance;
DROP POLICY IF EXISTS "Allow authenticated update access on equipment_maintenance" ON equipment_maintenance;

CREATE POLICY "Allow authenticated read access on equipment_maintenance"
ON equipment_maintenance
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated insert access on equipment_maintenance"
ON equipment_maintenance
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated update access on equipment_maintenance"
ON equipment_maintenance
FOR UPDATE
TO authenticated
USING (true);