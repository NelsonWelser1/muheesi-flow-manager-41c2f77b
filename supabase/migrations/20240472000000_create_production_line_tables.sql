-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create table for Production Line 1 (International Standards)
CREATE TABLE IF NOT EXISTS production_line_international (
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

-- Create indexes for Production Line 1
CREATE INDEX idx_pl_international_batch ON production_line_international(batch_id);
CREATE INDEX idx_pl_international_date ON production_line_international(date_time);

-- Enable RLS for Production Line 1
ALTER TABLE production_line_international ENABLE ROW LEVEL SECURITY;

-- Create policies for Production Line 1
CREATE POLICY "Enable read access for authenticated users"
    ON production_line_international FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert access for authenticated users"
    ON production_line_international FOR INSERT
    TO authenticated
    WITH CHECK (true);