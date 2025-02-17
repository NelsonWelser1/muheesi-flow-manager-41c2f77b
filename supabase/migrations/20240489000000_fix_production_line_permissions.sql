
-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON production_line_international;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON production_line_international;
DROP POLICY IF EXISTS "Enable all operations for milk_tank_offloads" ON production_line_international;

DROP POLICY IF EXISTS "Enable read access for authenticated users" ON production_line_local;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON production_line_local;
DROP POLICY IF EXISTS "Enable all operations for milk_tank_offloads" ON production_line_local;

-- Create new permissive policies for production_line_international
CREATE POLICY "Enable all operations for production_line_international"
ON production_line_international
FOR ALL 
TO PUBLIC
USING (true)
WITH CHECK (true);

-- Create new permissive policies for production_line_local
CREATE POLICY "Enable all operations for production_line_local"
ON production_line_local
FOR ALL 
TO PUBLIC
USING (true)
WITH CHECK (true);

-- Grant necessary permissions
GRANT ALL ON production_line_international TO anon;
GRANT ALL ON production_line_international TO authenticated;
GRANT ALL ON production_line_international TO service_role;

GRANT ALL ON production_line_local TO anon;
GRANT ALL ON production_line_local TO authenticated;
GRANT ALL ON production_line_local TO service_role;
