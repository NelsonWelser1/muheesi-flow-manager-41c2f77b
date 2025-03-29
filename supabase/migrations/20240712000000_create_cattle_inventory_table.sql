
-- Create cattle_inventory table
CREATE TABLE IF NOT EXISTS cattle_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tag_number TEXT NOT NULL,
  name TEXT,
  cattle_type TEXT NOT NULL,
  breed TEXT NOT NULL,
  date_of_birth DATE,
  weight NUMERIC,
  health_status TEXT NOT NULL DEFAULT 'good',
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  farm_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_cattle_inventory_farm_id ON cattle_inventory(farm_id);
CREATE INDEX IF NOT EXISTS idx_cattle_inventory_cattle_type ON cattle_inventory(cattle_type);
CREATE INDEX IF NOT EXISTS idx_cattle_inventory_tag_number ON cattle_inventory(tag_number);
CREATE INDEX IF NOT EXISTS idx_cattle_inventory_status ON cattle_inventory(status);

-- Create trigger for updated_at functionality
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

-- Add RLS policies to allow access without requiring authentication for now
ALTER TABLE cattle_inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow full access to everyone" 
ON cattle_inventory
FOR ALL 
TO public
USING (true)
WITH CHECK (true);
