-- Drop all existing policies
DROP POLICY IF EXISTS "Enable read for all" ON milk_reception;
DROP POLICY IF EXISTS "Enable insert for all" ON milk_reception;
DROP POLICY IF EXISTS "Enable update for all" ON milk_reception;

-- Disable RLS temporarily to reset
ALTER TABLE milk_reception DISABLE ROW LEVEL SECURITY;

-- Enable RLS again
ALTER TABLE milk_reception ENABLE ROW LEVEL SECURITY;

-- Create new anonymous access policy
CREATE POLICY "Allow anonymous access"
ON milk_reception
FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Make sure the table is accessible to the public role
GRANT ALL ON milk_reception TO anon;
GRANT ALL ON milk_reception TO authenticated;