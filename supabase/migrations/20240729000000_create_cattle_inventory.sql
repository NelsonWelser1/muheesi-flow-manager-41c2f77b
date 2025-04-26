
-- Drop existing table if it exists
DROP TABLE IF EXISTS cattle_inventory;

-- Create cattle_inventory table with schema matching form fields
CREATE TABLE cattle_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tag_number TEXT NOT NULL,
  name TEXT,
  type TEXT NOT NULL,
  breed TEXT NOT NULL,
  date_of_birth DATE,
  weight NUMERIC,
  health_status TEXT DEFAULT 'good',
  purchase_date DATE,
  notes TEXT,
  farm_id TEXT NOT NULL DEFAULT 'kashari',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_cattle_inventory_tag_number ON cattle_inventory(tag_number);
CREATE INDEX idx_cattle_inventory_farm_id ON cattle_inventory(farm_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_cattle_inventory_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_cattle_inventory_updated_at
BEFORE UPDATE ON cattle_inventory
FOR EACH ROW
EXECUTE FUNCTION update_cattle_inventory_updated_at();

-- Enable RLS but allow all operations for now (authentication temporarily disabled)
ALTER TABLE cattle_inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations for now" 
ON cattle_inventory
FOR ALL 
TO public
USING (true)
WITH CHECK (true);
