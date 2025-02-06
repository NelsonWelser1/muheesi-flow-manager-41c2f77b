-- Drop existing policies
DROP POLICY IF EXISTS "enable_all_for_authenticated_international" ON production_line_international;
DROP POLICY IF EXISTS "enable_all_for_authenticated_local" ON production_line_local;

-- Enable RLS
ALTER TABLE production_line_international ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_line_local ENABLE ROW LEVEL SECURITY;

-- Create policies for production_line_international
CREATE POLICY "authenticated_insert_international"
ON production_line_international
FOR INSERT
TO authenticated
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "authenticated_select_international"
ON production_line_international
FOR SELECT
TO authenticated
USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_update_international"
ON production_line_international
FOR UPDATE
TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "authenticated_delete_international"
ON production_line_international
FOR DELETE
TO authenticated
USING (auth.role() = 'authenticated');

-- Create policies for production_line_local
CREATE POLICY "authenticated_insert_local"
ON production_line_local
FOR INSERT
TO authenticated
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "authenticated_select_local"
ON production_line_local
FOR SELECT
TO authenticated
USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_update_local"
ON production_line_local
FOR UPDATE
TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "authenticated_delete_local"
ON production_line_local
FOR DELETE
TO authenticated
USING (auth.role() = 'authenticated');

-- Grant necessary permissions
GRANT ALL ON production_line_international TO authenticated;
GRANT ALL ON production_line_local TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;