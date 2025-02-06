-- Drop all existing policies
DROP POLICY IF EXISTS "authenticated_select_production_line_international" ON production_line_international;
DROP POLICY IF EXISTS "authenticated_insert_production_line_international" ON production_line_international;
DROP POLICY IF EXISTS "authenticated_select_production_line_local" ON production_line_local;
DROP POLICY IF EXISTS "authenticated_insert_production_line_local" ON production_line_local;

-- Enable RLS
ALTER TABLE production_line_international ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_line_local ENABLE ROW LEVEL SECURITY;

-- Create comprehensive policies for production_line_international
CREATE POLICY "enable_all_for_authenticated_international"
ON production_line_international
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create comprehensive policies for production_line_local
CREATE POLICY "enable_all_for_authenticated_local"
ON production_line_local
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Grant all permissions to authenticated users
GRANT ALL ON production_line_international TO authenticated;
GRANT ALL ON production_line_local TO authenticated;

-- Grant sequence permissions if they exist
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;