-- Drop existing policies if any
DROP POLICY IF EXISTS "Anyone can view milk reception data" ON milk_reception;
DROP POLICY IF EXISTS "Anyone can insert milk reception data" ON milk_reception;
DROP POLICY IF EXISTS "Anyone can update milk reception data" ON milk_reception;

-- Enable RLS
ALTER TABLE milk_reception ENABLE ROW LEVEL SECURITY;

-- Create new public access policies
CREATE POLICY "Public read access"
ON milk_reception FOR SELECT
TO PUBLIC
USING (true);

CREATE POLICY "Public insert access"
ON milk_reception FOR INSERT
TO PUBLIC
WITH CHECK (true);

CREATE POLICY "Public update access"
ON milk_reception FOR UPDATE
TO PUBLIC
USING (true)
WITH CHECK (true);

-- Remove any user_id constraints since we're allowing public access
ALTER TABLE milk_reception 
  DROP CONSTRAINT IF EXISTS milk_reception_user_id_fkey,
  DROP COLUMN IF EXISTS user_id;