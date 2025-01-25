-- Drop existing policies if any
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON milk_reception;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON milk_reception;
DROP POLICY IF EXISTS "Enable update access for own rows" ON milk_reception;

-- Enable RLS
ALTER TABLE milk_reception ENABLE ROW LEVEL SECURITY;

-- Create new policies for public access
CREATE POLICY "Anyone can view milk reception data"
ON milk_reception FOR SELECT
TO public
USING (true);

CREATE POLICY "Anyone can insert milk reception data"
ON milk_reception FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Anyone can update milk reception data"
ON milk_reception FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Remove user_id requirement
DROP TRIGGER IF EXISTS set_milk_reception_user_id ON milk_reception;