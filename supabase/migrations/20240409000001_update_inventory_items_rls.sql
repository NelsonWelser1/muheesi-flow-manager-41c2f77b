-- Drop existing policies if any
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON inventory_items;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON inventory_items;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON inventory_items;

-- Create new policies with proper authentication checks
CREATE POLICY "Enable read access for all users"
ON inventory_items FOR SELECT
USING (true);

CREATE POLICY "Enable insert for authenticated users"
ON inventory_items FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users"
ON inventory_items FOR UPDATE
USING (auth.role() = 'authenticated');

-- Enable RLS
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;