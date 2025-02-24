
-- Drop all existing policies for maintenance_records
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON maintenance_records;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON maintenance_records;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON maintenance_records;
DROP POLICY IF EXISTS "Enable all access for maintenance records" ON maintenance_records;

-- Create a single policy that enables all operations
CREATE POLICY "Enable all operations for authenticated users"
ON maintenance_records
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Temporarily enable access for all users (since authentication is disabled)
ALTER TABLE maintenance_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable public access"
ON maintenance_records
FOR ALL
TO PUBLIC
USING (true)
WITH CHECK (true);
