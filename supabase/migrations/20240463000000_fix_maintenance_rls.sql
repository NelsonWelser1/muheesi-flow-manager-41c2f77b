-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow authenticated read access on equipment_maintenance" ON equipment_maintenance;
DROP POLICY IF EXISTS "Allow authenticated insert access on equipment_maintenance" ON equipment_maintenance;

-- Create new policies
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