
-- Create cattle_fattening table
CREATE TABLE IF NOT EXISTS cattle_fattening (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tag_number TEXT NOT NULL,
  name TEXT,
  breed TEXT NOT NULL CHECK (breed IN ('Boran', 'Ankole Longhorn', 'Hereford', 'Aberdeen', 'Angus', 'Charolais', 'Mixed')),
  date_of_birth DATE,
  entry_weight NUMERIC NOT NULL CHECK (entry_weight > 0),
  current_weight NUMERIC NOT NULL CHECK (current_weight > 0),
  target_weight NUMERIC NOT NULL CHECK (target_weight > 0),
  daily_gain NUMERIC,
  entry_date DATE NOT NULL,
  expected_completion_date DATE,
  feeding_regime TEXT NOT NULL DEFAULT 'standard' CHECK (feeding_regime IN ('standard', 'intensive', 'premium', 'specialized')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'sold', 'deceased', 'transferred')),
  notes TEXT,
  farm_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_cattle_fattening_farm_id ON cattle_fattening(farm_id);
CREATE INDEX IF NOT EXISTS idx_cattle_fattening_status ON cattle_fattening(status);
CREATE INDEX IF NOT EXISTS idx_cattle_fattening_tag_number ON cattle_fattening(tag_number);
CREATE INDEX IF NOT EXISTS idx_cattle_fattening_breed ON cattle_fattening(breed);

-- Create trigger for updated_at functionality
CREATE OR REPLACE FUNCTION update_cattle_fattening_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_cattle_fattening_updated_at
BEFORE UPDATE ON cattle_fattening
FOR EACH ROW
EXECUTE FUNCTION update_cattle_fattening_updated_at();

-- Add RLS policies to allow access without requiring authentication for now
ALTER TABLE cattle_fattening ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow full access to everyone" 
ON cattle_fattening
FOR ALL 
TO public
USING (true)
WITH CHECK (true);

-- Create view for fattening analytics
CREATE OR REPLACE VIEW cattle_fattening_analytics AS
SELECT 
  farm_id,
  breed,
  status,
  COUNT(*) as count,
  AVG(current_weight - entry_weight) as avg_weight_gain,
  AVG(EXTRACT(DAY FROM (NOW() - entry_date))) as avg_days_in_program,
  AVG((current_weight - entry_weight) / NULLIF(EXTRACT(DAY FROM (NOW() - entry_date)), 0)) as avg_daily_gain
FROM 
  cattle_fattening
GROUP BY 
  farm_id, breed, status;
