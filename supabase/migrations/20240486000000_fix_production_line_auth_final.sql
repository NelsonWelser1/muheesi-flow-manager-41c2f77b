-- Drop existing policies
DROP POLICY IF EXISTS "enable_all_for_authenticated_international" ON production_line_international;
DROP POLICY IF EXISTS "enable_all_for_authenticated_local" ON production_line_local;

-- Enable RLS
ALTER TABLE production_line_international ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_line_local ENABLE ROW LEVEL SECURITY;

-- Create simplified policies that check auth.uid() is not null
CREATE POLICY "authenticated_access_international"
ON production_line_international
FOR ALL
TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "authenticated_access_local"
ON production_line_local
FOR ALL
TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Grant necessary permissions
GRANT ALL ON production_line_international TO authenticated;
GRANT ALL ON production_line_local TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Ensure the tables have the created_by column and it's properly set
ALTER TABLE production_line_international 
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);

ALTER TABLE production_line_local
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);