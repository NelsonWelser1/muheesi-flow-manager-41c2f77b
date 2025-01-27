-- Drop existing policies
DROP POLICY IF EXISTS "Allow public access" ON milk_reception;
DROP POLICY IF EXISTS "Enable read for all" ON milk_reception;
DROP POLICY IF EXISTS "Enable insert for all" ON milk_reception;
DROP POLICY IF EXISTS "Enable update for all" ON milk_reception;

-- Disable RLS temporarily
ALTER TABLE milk_reception DISABLE ROW LEVEL SECURITY;

-- Create the table if it doesn't exist (to ensure idempotency)
CREATE TABLE IF NOT EXISTS milk_reception (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_name TEXT NOT NULL,
    milk_volume DECIMAL NOT NULL,
    temperature DECIMAL NOT NULL,
    fat_percentage DECIMAL NOT NULL,
    protein_percentage DECIMAL NOT NULL,
    total_plate_count INTEGER NOT NULL,
    acidity DECIMAL NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Re-enable RLS
ALTER TABLE milk_reception ENABLE ROW LEVEL SECURITY;

-- Create new simplified policies that allow all operations
CREATE POLICY "Allow all operations"
ON milk_reception
FOR ALL
TO PUBLIC
USING (true)
WITH CHECK (true);

-- Grant necessary permissions
GRANT ALL ON milk_reception TO anon;
GRANT ALL ON milk_reception TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;