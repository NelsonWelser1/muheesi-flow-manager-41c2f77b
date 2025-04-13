
-- Create cattle-related tables for Kashari Farm

-- Create extension for UUID generation if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create cattle_inventory table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.cattle_inventory (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  tag_number TEXT NOT NULL,
  name TEXT,
  cattle_type TEXT NOT NULL,
  breed TEXT NOT NULL,
  date_of_birth DATE,
  weight NUMERIC,
  health_status TEXT NOT NULL DEFAULT 'good',
  purchase_date DATE,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  farm_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cattle_health_records table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.cattle_health_records (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  cattle_id uuid REFERENCES cattle_inventory(id) ON DELETE CASCADE,
  record_date DATE NOT NULL,
  record_type TEXT NOT NULL CHECK (record_type IN ('vaccination', 'treatment', 'examination', 'deworming')),
  description TEXT NOT NULL,
  treatment TEXT,
  administered_by TEXT,
  next_due_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cattle_growth_metrics table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.cattle_growth_metrics (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  cattle_id uuid REFERENCES cattle_inventory(id) ON DELETE CASCADE,
  measurement_date DATE NOT NULL,
  weight NUMERIC NOT NULL CHECK (weight > 0),
  height NUMERIC,
  girth NUMERIC,
  body_condition_score NUMERIC CHECK (body_condition_score IS NULL OR (body_condition_score BETWEEN 1 AND 9)),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_cattle_inventory_farm_id ON cattle_inventory(farm_id);
CREATE INDEX IF NOT EXISTS idx_cattle_inventory_tag_number ON cattle_inventory(tag_number);
CREATE INDEX IF NOT EXISTS idx_health_records_cattle_id ON cattle_health_records(cattle_id);
CREATE INDEX IF NOT EXISTS idx_health_records_record_date ON cattle_health_records(record_date);
CREATE INDEX IF NOT EXISTS idx_growth_metrics_cattle_id ON cattle_growth_metrics(cattle_id);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
DROP TRIGGER IF EXISTS update_cattle_inventory_updated_at ON public.cattle_inventory;
CREATE TRIGGER update_cattle_inventory_updated_at
BEFORE UPDATE ON public.cattle_inventory
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

DROP TRIGGER IF EXISTS update_cattle_health_records_updated_at ON public.cattle_health_records;
CREATE TRIGGER update_cattle_health_records_updated_at
BEFORE UPDATE ON public.cattle_health_records
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

DROP TRIGGER IF EXISTS update_cattle_growth_metrics_updated_at ON public.cattle_growth_metrics;
CREATE TRIGGER update_cattle_growth_metrics_updated_at
BEFORE UPDATE ON public.cattle_growth_metrics
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Enable Row Level Security
ALTER TABLE public.cattle_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cattle_health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cattle_growth_metrics ENABLE ROW LEVEL SECURITY;

-- Create open policies (to be restricted later when authentication is implemented)
CREATE POLICY cattle_inventory_all_policy ON public.cattle_inventory FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY cattle_health_records_all_policy ON public.cattle_health_records FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY cattle_growth_metrics_all_policy ON public.cattle_growth_metrics FOR ALL USING (true) WITH CHECK (true);

-- Add comments for documentation
COMMENT ON TABLE public.cattle_inventory IS 'Stores cattle inventory information for farms';
COMMENT ON TABLE public.cattle_health_records IS 'Stores health records for cattle';
COMMENT ON TABLE public.cattle_growth_metrics IS 'Stores growth and development metrics for cattle';
