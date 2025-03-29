
-- Create cattle_health_records table
CREATE TABLE IF NOT EXISTS cattle_health_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cattle_id UUID REFERENCES cattle_inventory(id),
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

-- Create cattle_growth_metrics table
CREATE TABLE IF NOT EXISTS cattle_growth_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cattle_id UUID REFERENCES cattle_inventory(id),
    measurement_date DATE NOT NULL,
    weight NUMERIC NOT NULL CHECK (weight > 0),
    height NUMERIC,
    girth NUMERIC,
    body_condition_score NUMERIC CHECK (body_condition_score BETWEEN 1 AND 9),
    feed_intake NUMERIC,
    feed_conversion_ratio NUMERIC,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better query performance
CREATE INDEX idx_health_records_cattle_id ON cattle_health_records(cattle_id);
CREATE INDEX idx_health_records_record_date ON cattle_health_records(record_date);
CREATE INDEX idx_growth_metrics_cattle_id ON cattle_growth_metrics(cattle_id);
CREATE INDEX idx_growth_metrics_measurement_date ON cattle_growth_metrics(measurement_date);

-- Enable RLS
ALTER TABLE cattle_health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE cattle_growth_metrics ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable full access to everyone" ON cattle_health_records FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Enable full access to everyone" ON cattle_growth_metrics FOR ALL TO public USING (true) WITH CHECK (true);
