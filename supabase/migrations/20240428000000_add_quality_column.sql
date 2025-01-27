-- Add quality column to milk_reception table
ALTER TABLE milk_reception 
ADD COLUMN IF NOT EXISTS quality TEXT;

-- Update RLS policies to include the new column
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON milk_reception;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON milk_reception;

CREATE POLICY "Enable read access for authenticated users"
ON milk_reception FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable insert access for authenticated users"
ON milk_reception FOR INSERT
TO authenticated
WITH CHECK (true);