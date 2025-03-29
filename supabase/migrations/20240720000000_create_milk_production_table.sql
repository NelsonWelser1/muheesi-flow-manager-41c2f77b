
-- Create milk_production table
CREATE TABLE IF NOT EXISTS milk_production (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  session TEXT NOT NULL CHECK (session IN ('morning', 'midday', 'evening')),
  volume NUMERIC NOT NULL CHECK (volume > 0),
  milking_cows INTEGER NOT NULL CHECK (milking_cows > 0),
  fat_content NUMERIC CHECK (fat_content IS NULL OR (fat_content > 0 AND fat_content <= 100)),
  notes TEXT,
  farm_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_milk_production_farm_id ON milk_production(farm_id);
CREATE INDEX IF NOT EXISTS idx_milk_production_date ON milk_production(date);
CREATE INDEX IF NOT EXISTS idx_milk_production_session ON milk_production(session);

-- Create trigger for updated_at functionality
CREATE OR REPLACE FUNCTION update_milk_production_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_milk_production_updated_at
BEFORE UPDATE ON milk_production
FOR EACH ROW
EXECUTE FUNCTION update_milk_production_updated_at();

-- Add RLS policies to allow access without requiring authentication for now
ALTER TABLE milk_production ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow full access to everyone" 
ON milk_production
FOR ALL 
TO public
USING (true)
WITH CHECK (true);
