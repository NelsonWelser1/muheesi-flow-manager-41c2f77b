
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
  ingredients TEXT[] CHECK (ingredients <@ ARRAY['molasses', 'urea', 'salt', 'formic acid']),
  expenses_incurred NUMERIC,
  person_in_charge TEXT,
  farm_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for farm_id if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_silage_inventory_farm_id') THEN
    CREATE INDEX idx_silage_inventory_farm_id ON silage_inventory(farm_id);
  END IF;
END $$;

-- Create index for type if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_silage_inventory_type') THEN
    CREATE INDEX idx_silage_inventory_type ON silage_inventory(type);
  END IF;
END $$;

-- Create index for storage_location if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_silage_inventory_storage_location') THEN
    CREATE INDEX idx_silage_inventory_storage_location ON silage_inventory(storage_location);
  END IF;
END $$;

-- Create index for expiry_date if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_silage_inventory_expiry_date') THEN
    CREATE INDEX idx_silage_inventory_expiry_date ON silage_inventory(expiry_date);
  END IF;
END $$;

-- Create the updated_at trigger function and trigger if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_silage_inventory_updated_at') THEN
    CREATE OR REPLACE FUNCTION update_silage_inventory_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER update_silage_inventory_updated_at
    BEFORE UPDATE ON silage_inventory
    FOR EACH ROW
    EXECUTE FUNCTION update_silage_inventory_updated_at();
  END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE silage_inventory ENABLE ROW LEVEL SECURITY;

-- Create policy if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'silage_inventory' AND policyname = 'Allow full access to everyone') THEN
    CREATE POLICY "Allow full access to everyone" 
    ON silage_inventory
    FOR ALL 
    TO public
    USING (true)
    WITH CHECK (true);
  END IF;
END $$;
