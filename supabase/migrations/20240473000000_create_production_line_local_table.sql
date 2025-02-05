-- Create table for Production Line 2 (Local Standards)
CREATE TABLE IF NOT EXISTS production_line_local (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id TEXT NOT NULL,
    date_time TIMESTAMP WITH TIME ZONE NOT NULL,
    milk_volume DECIMAL NOT NULL,
    cheese_type TEXT NOT NULL,
    starter_culture TEXT NOT NULL,
    starter_quantity DECIMAL NOT NULL,
    coagulant TEXT NOT NULL,
    coagulant_quantity DECIMAL NOT NULL,
    temperature DECIMAL NOT NULL,
    processing_time INTEGER NOT NULL,
    yield DECIMAL NOT NULL,
    operator_id TEXT NOT NULL,
    quality_check_status TEXT DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for Production Line 2
CREATE INDEX idx_pl_local_batch ON production_line_local(batch_id);
CREATE INDEX idx_pl_local_date ON production_line_local(date_time);

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