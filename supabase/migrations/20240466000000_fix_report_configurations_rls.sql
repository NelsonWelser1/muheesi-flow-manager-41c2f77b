-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated read access on report_configurations" ON report_configurations;
DROP POLICY IF EXISTS "Allow authenticated insert on report_configurations" ON report_configurations;

-- Create new comprehensive policies
CREATE POLICY "Enable read access for authenticated users"
ON report_configurations FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable insert access for authenticated users"
ON report_configurations FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users"
ON report_configurations FOR UPDATE
TO authenticated
USING (true);