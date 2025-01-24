-- Enable RLS on milk_reception_data table
ALTER TABLE milk_reception_data ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view milk reception data" ON milk_reception_data;
DROP POLICY IF EXISTS "Users can insert milk reception data" ON milk_reception_data;
DROP POLICY IF EXISTS "Users can update their own milk reception data" ON milk_reception_data;

-- Create policies for milk_reception_data
CREATE POLICY "Users can view milk reception data"
ON milk_reception_data
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can insert milk reception data"
ON milk_reception_data
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own milk reception data"
ON milk_reception_data
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Add an index on user_id for better query performance
CREATE INDEX IF NOT EXISTS milk_reception_data_user_id_idx ON milk_reception_data(user_id);