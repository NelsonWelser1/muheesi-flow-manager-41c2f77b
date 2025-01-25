-- Drop existing policies if any
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON milk_reception;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON milk_reception;
DROP POLICY IF EXISTS "Enable update access for own rows" ON milk_reception;

-- Enable RLS
ALTER TABLE milk_reception ENABLE ROW LEVEL SECURITY;

-- Create new policies
CREATE POLICY "Users can view milk reception data"
ON milk_reception FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can insert milk reception data"
ON milk_reception FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update milk reception data"
ON milk_reception FOR UPDATE
TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Ensure user_id is set on insert
CREATE OR REPLACE FUNCTION set_user_id_on_milk_reception()
RETURNS TRIGGER AS $$
BEGIN
  NEW.user_id = auth.uid();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS set_milk_reception_user_id ON milk_reception;
CREATE TRIGGER set_milk_reception_user_id
  BEFORE INSERT ON milk_reception
  FOR EACH ROW
  EXECUTE FUNCTION set_user_id_on_milk_reception();