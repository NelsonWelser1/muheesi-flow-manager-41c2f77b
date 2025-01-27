-- Drop existing policies
DROP POLICY IF EXISTS "Allow public access" ON milk_reception;
DROP POLICY IF EXISTS "Enable read access for all users" ON milk_reception;
DROP POLICY IF EXISTS "Enable insert for all users" ON milk_reception;
DROP POLICY IF EXISTS "Enable update for all users" ON milk_reception;

-- Temporarily disable RLS
ALTER TABLE milk_reception DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE milk_reception ENABLE ROW LEVEL SECURITY;

-- Create new policies with proper access control
CREATE POLICY "Enable read for all"
ON milk_reception FOR SELECT
USING (true);

CREATE POLICY "Enable insert for all"
ON milk_reception FOR INSERT
WITH CHECK (true);

CREATE POLICY "Enable update for all"
ON milk_reception FOR UPDATE
USING (true)
WITH CHECK (true);

-- Grant necessary permissions
GRANT ALL ON milk_reception TO anon;
GRANT ALL ON milk_reception TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;