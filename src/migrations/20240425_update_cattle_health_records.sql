
-- Update cattle_health_records table
CREATE TABLE IF NOT EXISTS cattle_health_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cattle_id UUID REFERENCES cattle_inventory(id) ON DELETE CASCADE,
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

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_health_records_cattle_id ON cattle_health_records(cattle_id);
CREATE INDEX IF NOT EXISTS idx_health_records_record_date ON cattle_health_records(record_date);

-- Enable RLS but keep it open for now (no authentication required)
ALTER TABLE cattle_health_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable full access to health records" ON cattle_health_records
    FOR ALL
    USING (true)
    WITH CHECK (true);

