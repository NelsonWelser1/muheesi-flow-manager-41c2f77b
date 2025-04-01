
-- Drop existing table and related objects if they exist
DROP TRIGGER IF EXISTS update_silage_inventory_updated_at ON silage_inventory;
DROP FUNCTION IF EXISTS update_silage_inventory_updated_at();
DROP INDEX IF EXISTS idx_silage_inventory_farm_id;
DROP INDEX IF EXISTS idx_silage_inventory_type;
DROP INDEX IF EXISTS idx_silage_inventory_storage_location;
DROP INDEX IF EXISTS idx_silage_inventory_expiry_date;
DROP POLICY IF EXISTS "Allow full access to everyone" ON silage_inventory;
DROP TABLE IF EXISTS silage_inventory;

-- Create the silage inventory table from scratch
CREATE TABLE silage_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('maize', 'grass', 'alfalfa', 'mixed')),
  amount NUMERIC NOT NULL CHECK (amount > 0),
  unit TEXT NOT NULL CHECK (unit IN ('tons', 'kg', 'bales')),
  production_date DATE NOT NULL,
  expiry_date DATE,
  storage_location TEXT,
  quality TEXT NOT NULL CHECK (quality IN ('excellent', 'good', 'average', 'poor')),
  notes TEXT,
  farm_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_silage_inventory_farm_id ON silage_inventory(farm_id);
CREATE INDEX idx_silage_inventory_type ON silage_inventory(type);
CREATE INDEX idx_silage_inventory_storage_location ON silage_inventory(storage_location);
CREATE INDEX idx_silage_inventory_expiry_date ON silage_inventory(expiry_date);

-- Create trigger for updated_at functionality
CREATE FUNCTION update_silage_inventory_updated_at()
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

-- Enable Row Level Security but allow public access for now
ALTER TABLE silage_inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow full access to everyone" 
ON silage_inventory
FOR ALL 
TO public
USING (true)
WITH CHECK (true);
