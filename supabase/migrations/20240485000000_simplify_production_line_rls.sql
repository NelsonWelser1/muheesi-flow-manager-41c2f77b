-- Drop all existing policies
DROP POLICY IF EXISTS "authenticated_insert_international" ON production_line_international;
DROP POLICY IF EXISTS "authenticated_select_international" ON production_line_international;
DROP POLICY IF EXISTS "authenticated_update_international" ON production_line_international;
DROP POLICY IF EXISTS "authenticated_delete_international" ON production_line_international;
DROP POLICY IF EXISTS "authenticated_insert_local" ON production_line_local;
DROP POLICY IF EXISTS "authenticated_select_local" ON production_line_local;
DROP POLICY IF EXISTS "authenticated_update_local" ON production_line_local;
DROP POLICY IF EXISTS "authenticated_delete_local" ON production_line_local;

-- Enable RLS
ALTER TABLE production_line_international ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_line_local ENABLE ROW LEVEL SECURITY;

-- Create simplified policies for production_line_international
CREATE POLICY "enable_all_for_authenticated_international"
ON production_line_international
FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);

-- Create simplified policies for production_line_local
CREATE POLICY "enable_all_for_authenticated_local"
ON production_line_local
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Grant necessary permissions
GRANT ALL ON production_line_international TO authenticated;
GRANT ALL ON production_line_local TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;