-- Drop existing policies
DROP POLICY IF EXISTS "Public read access" ON milk_reception;
DROP POLICY IF EXISTS "Public insert access" ON milk_reception;
DROP POLICY IF EXISTS "Public update access" ON milk_reception;

-- Enable RLS
ALTER TABLE milk_reception ENABLE ROW LEVEL SECURITY;

-- Create new policies with no user check
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

-- Remove any auth-related constraints
ALTER TABLE milk_reception 
  DROP CONSTRAINT IF EXISTS milk_reception_user_id_fkey,
  ALTER COLUMN user_id DROP NOT NULL;