-- Create table for Production Line 2 (Local Standards)
CREATE TABLE IF NOT EXISTS production_line_local (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fromager_identifier TEXT NOT NULL, -- Can store either name, ID, or both
    cheese_type TEXT NOT NULL,
    batch_id TEXT NOT NULL UNIQUE,
    milk_volume DECIMAL NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    estimated_duration INTEGER NOT NULL,
    starter_culture TEXT NOT NULL,
    starter_quantity DECIMAL NOT NULL,
    coagulant_type TEXT NOT NULL,
    coagulant_quantity DECIMAL NOT NULL,
    processing_temperature DECIMAL NOT NULL,
    processing_time INTEGER NOT NULL,
    expected_yield DECIMAL NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES auth.users(id),
    status TEXT DEFAULT 'in_progress'
);

-- Create indexes for Production Line 2
CREATE INDEX idx_pl_local_batch ON production_line_local(batch_id);
CREATE INDEX idx_pl_local_created_at ON production_line_local(created_at);

-- Enable RLS for Production Line 2
ALTER TABLE production_line_local ENABLE ROW LEVEL SECURITY;

-- Create policies for Production Line 2
CREATE POLICY "Enable read access for authenticated users"
    ON production_line_local FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert access for authenticated users"
    ON production_line_local FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Create function to generate batch IDs
CREATE OR REPLACE FUNCTION generate_batch_id()
RETURNS TEXT AS $$
DECLARE
    next_id INTEGER;
BEGIN
    next_id := nextval('cheese_batch_id_seq');
    RETURN 'CHE-' || LPAD(next_id::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;