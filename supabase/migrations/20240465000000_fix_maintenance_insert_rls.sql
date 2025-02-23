
-- Drop existing policies
DROP POLICY IF EXISTS "Allow authenticated read access on equipment_maintenance" ON equipment_maintenance;
DROP POLICY IF EXISTS "Allow authenticated insert access on equipment_maintenance" ON equipment_maintenance;
DROP POLICY IF EXISTS "Allow authenticated update access on equipment_maintenance" ON equipment_maintenance;

-- Create new comprehensive policies
CREATE POLICY "Enable read access for authenticated users"
ON equipment_maintenance FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable insert access for authenticated users"
ON equipment_maintenance FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users"
ON equipment_maintenance FOR UPDATE
TO authenticated
USING (true);
