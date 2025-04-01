
-- Check if the table exists first
DO $$ 
BEGIN
    -- Attempt to drop the old indexes if they exist (to avoid duplicate index errors)
    DROP INDEX IF EXISTS idx_cattle_fattening_farm_id;
    DROP INDEX IF EXISTS idx_cattle_fattening_status;
    DROP INDEX IF EXISTS idx_cattle_fattening_tag_number;
    DROP INDEX IF EXISTS idx_cattle_fattening_batch_id;
EXCEPTION
    WHEN UNDEFINED_TABLE THEN
    -- Do nothing, just continue
END $$;

-- Drop existing triggers/functions if they exist
DROP TRIGGER IF EXISTS update_cattle_fattening_updated_at ON cattle_fattening;
DROP FUNCTION IF EXISTS update_cattle_fattening_updated_at();

-- Create or replace the table
CREATE TABLE IF NOT EXISTS cattle_fattening (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tag_number TEXT NOT NULL,
  name TEXT,
  breed TEXT NOT NULL,
  cattle_type TEXT NOT NULL, -- Added field for cattle type (Bull, Cow, etc.)
  date_of_birth DATE,
  entry_date DATE NOT NULL,
  entry_weight NUMERIC NOT NULL, -- Removed CHECK constraint
  current_weight NUMERIC NOT NULL, -- Removed CHECK constraint
  target_weight NUMERIC NOT NULL CHECK (target_weight > 0),
  daily_gain NUMERIC,
  expected_completion_date DATE,
  feeding_regime TEXT NOT NULL DEFAULT 'pasture-silage based',
  status TEXT NOT NULL DEFAULT 'active',
  notes TEXT,
  farm_id TEXT NOT NULL,
  batch_id TEXT, -- Explicitly added field to group batch entries
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure the feeding_regime constraint is properly applied
ALTER TABLE cattle_fattening DROP CONSTRAINT IF EXISTS cattle_fattening_feeding_regime_check;
ALTER TABLE cattle_fattening ADD CONSTRAINT cattle_fattening_feeding_regime_check 
CHECK (feeding_regime IN ('standard', 'intensive', 'premium', 'specialized', 'pasture-silage based'));

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_cattle_fattening_farm_id ON cattle_fattening(farm_id);
CREATE INDEX IF NOT EXISTS idx_cattle_fattening_status ON cattle_fattening(status);
CREATE INDEX IF NOT EXISTS idx_cattle_fattening_tag_number ON cattle_fattening(tag_number);
CREATE INDEX IF NOT EXISTS idx_cattle_fattening_batch_id ON cattle_fattening(batch_id);

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

-- Enable Row Level Security but allow public access for now
ALTER TABLE cattle_fattening ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow full access to everyone" 
ON cattle_fattening
FOR ALL 
TO public
USING (true)
WITH CHECK (true);
