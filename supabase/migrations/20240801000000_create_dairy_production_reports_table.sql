
-- Create dairy_production_reports table
CREATE TABLE IF NOT EXISTS dairy_production_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_type TEXT NOT NULL,
  batch_id TEXT NOT NULL,
  raw_material NUMERIC(10, 2) NOT NULL,
  finished_product NUMERIC(10, 2) NOT NULL,
  production_date DATE NOT NULL,
  efficiency INTEGER CHECK (efficiency >= 0 AND efficiency <= 100),
  quality_score INTEGER CHECK (quality_score >= 0 AND quality_score <= 100),
  notes TEXT,
  operator_id UUID REFERENCES auth.users(id) NULL, -- Nullable for now
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add RLS policies but disable them initially
ALTER TABLE dairy_production_reports ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations temporarily (no auth required)
CREATE POLICY "Allow all operations for dairy_production_reports" 
  ON dairy_production_reports
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Add a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_dairy_production_reports_updated_at
BEFORE UPDATE ON dairy_production_reports
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Create index for common query patterns
CREATE INDEX IF NOT EXISTS idx_dairy_production_reports_product_type ON dairy_production_reports (product_type);
CREATE INDEX IF NOT EXISTS idx_dairy_production_reports_production_date ON dairy_production_reports (production_date);
CREATE INDEX IF NOT EXISTS idx_dairy_production_reports_batch_id ON dairy_production_reports (batch_id);
