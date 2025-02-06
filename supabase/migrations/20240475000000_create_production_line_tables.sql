-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create sequence for batch IDs
CREATE SEQUENCE IF NOT EXISTS cheese_batch_id_seq START 1;

-- Create table for Production Line 1 (International Standards)
CREATE TABLE IF NOT EXISTS production_line_international (
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

-- Create indexes for Production Line 1
CREATE INDEX idx_pl_international_batch ON production_line_international(batch_id);
CREATE INDEX idx_pl_international_created_at ON production_line_international(created_at);

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