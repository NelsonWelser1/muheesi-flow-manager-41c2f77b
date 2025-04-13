
-- Create milk_production table for Kashari Farm

-- Drop existing table if it exists to recreate with correct schema
DROP TABLE IF EXISTS public.milk_production;

CREATE TABLE IF NOT EXISTS public.milk_production (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  date DATE NOT NULL,
  session TEXT NOT NULL CHECK (session IN ('morning', 'midday', 'evening')),
  volume NUMERIC NOT NULL CHECK (volume > 0),
  milking_cows INTEGER NOT NULL CHECK (milking_cows > 0),
  fat_content NUMERIC CHECK (fat_content IS NULL OR (fat_content > 0 AND fat_content <= 100)),
  protein_content NUMERIC CHECK (protein_content IS NULL OR (protein_content > 0 AND protein_content <= 100)),
  location TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
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

-- Drop existing policies if they exist
DROP POLICY IF EXISTS milk_production_select_policy ON milk_production;
DROP POLICY IF EXISTS milk_production_insert_policy ON milk_production;
DROP POLICY IF EXISTS milk_production_update_policy ON milk_production;
DROP POLICY IF EXISTS milk_production_delete_policy ON milk_production;

-- Add RLS policies with authentication disabled for now
ALTER TABLE milk_production ENABLE ROW LEVEL SECURITY;

CREATE POLICY milk_production_select_policy ON milk_production
  FOR SELECT
  USING (true);

CREATE POLICY milk_production_insert_policy ON milk_production
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY milk_production_update_policy ON milk_production
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY milk_production_delete_policy ON milk_production
  FOR DELETE
  USING (true);

-- Add comment to table
COMMENT ON TABLE public.milk_production IS 'Stores daily milk production records for Kashari Farm';
