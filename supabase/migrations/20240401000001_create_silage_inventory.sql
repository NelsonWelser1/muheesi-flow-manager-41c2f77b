
-- Create the silage_inventory table if it doesn't exist
CREATE TABLE IF NOT EXISTS silage_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('maize', 'grass', 'alfalfa', 'mixed')),
  amount NUMERIC NOT NULL CHECK (amount > 0),
  unit TEXT NOT NULL CHECK (unit IN ('tons', 'kg', 'bales')),
  production_date DATE NOT NULL,
  expiry_date DATE,
  storage_location TEXT,
  quality TEXT NOT NULL CHECK (quality IN ('excellent', 'good', 'average', 'poor')),
  notes TEXT,
  ingredients TEXT[],
  expenses_incurred NUMERIC,
  person_in_charge TEXT,
  farm_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for farm_id
CREATE INDEX IF NOT EXISTS idx_silage_inventory_farm_id 
ON silage_inventory(farm_id);

-- Create index for type
CREATE INDEX IF NOT EXISTS idx_silage_inventory_type 
ON silage_inventory(type);

-- Create index for storage_location
CREATE INDEX IF NOT EXISTS idx_silage_inventory_storage_location 
ON silage_inventory(storage_location);

-- Create index for expiry_date
CREATE INDEX IF NOT EXISTS idx_silage_inventory_expiry_date 
ON silage_inventory(expiry_date);

-- Create the updated_at trigger function
CREATE OR REPLACE FUNCTION update_silage_inventory_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger if it doesn't exist
DROP TRIGGER IF EXISTS update_silage_inventory_updated_at ON silage_inventory;
CREATE TRIGGER update_silage_inventory_updated_at
BEFORE UPDATE ON silage_inventory
FOR EACH ROW
EXECUTE FUNCTION update_silage_inventory_updated_at();

-- Enable Row Level Security
ALTER TABLE silage_inventory ENABLE ROW LEVEL SECURITY;

-- Create policy for public access
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'silage_inventory' 
    AND policyname = 'Allow full access to everyone'
  ) THEN
    EXECUTE format('
      CREATE POLICY "Allow full access to everyone" 
      ON silage_inventory
      FOR ALL 
      TO public
      USING (true)
      WITH CHECK (true)
    ');
  END IF;
END
$$;

-- Add a validation trigger to ensure ingredients are from valid options
CREATE OR REPLACE FUNCTION validate_silage_ingredients()
RETURNS TRIGGER AS $$
DECLARE
  valid_ingredients TEXT[] := ARRAY['molasses', 'urea', 'salt', 'formic acid'];
  ingredient TEXT;
BEGIN
  IF NEW.ingredients IS NOT NULL THEN
    FOREACH ingredient IN ARRAY NEW.ingredients LOOP
      IF NOT ingredient = ANY(valid_ingredients) THEN
        RAISE EXCEPTION 'Invalid ingredient: %. Valid options are: molasses, urea, salt, formic acid', ingredient;
      END IF;
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the ingredients validation trigger
DROP TRIGGER IF EXISTS validate_silage_ingredients_trigger ON silage_inventory;
CREATE TRIGGER validate_silage_ingredients_trigger
BEFORE INSERT OR UPDATE ON silage_inventory
FOR EACH ROW
EXECUTE FUNCTION validate_silage_ingredients();
