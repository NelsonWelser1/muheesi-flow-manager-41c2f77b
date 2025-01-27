-- Drop existing policies
DROP POLICY IF EXISTS "Allow anonymous access" ON milk_reception;

-- Ensure RLS is enabled
ALTER TABLE milk_reception ENABLE ROW LEVEL SECURITY;

-- Create new policies that match the inventory items approach
CREATE POLICY "Enable read access for all users" ON milk_reception
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON milk_reception
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON milk_reception
    FOR UPDATE USING (true);

-- Grant necessary permissions
GRANT ALL ON milk_reception TO anon;
GRANT ALL ON milk_reception TO authenticated;