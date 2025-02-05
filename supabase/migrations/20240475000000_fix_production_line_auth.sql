-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON production_line_international;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON production_line_international;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON production_line_local;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON production_line_local;

-- Enable RLS
ALTER TABLE production_line_international ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_line_local ENABLE ROW LEVEL SECURITY;

-- Create policies for production_line_international
CREATE POLICY "authenticated_select_production_line_international"
ON production_line_international FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "authenticated_insert_production_line_international"
ON production_line_international FOR INSERT
TO authenticated
WITH CHECK (auth.role() = 'authenticated');

-- Create policies for production_line_local
CREATE POLICY "authenticated_select_production_line_local"
ON production_line_local FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "authenticated_insert_production_line_local"
ON production_line_local FOR INSERT
TO authenticated
WITH CHECK (auth.role() = 'authenticated');

-- Grant necessary permissions
GRANT ALL ON production_line_international TO authenticated;
GRANT ALL ON production_line_local TO authenticated;