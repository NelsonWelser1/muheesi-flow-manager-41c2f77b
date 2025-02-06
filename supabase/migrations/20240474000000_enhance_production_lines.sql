-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create table for Production Line 1 (International Standards)
CREATE TABLE IF NOT EXISTS production_line_international (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fromager_name TEXT NOT NULL,
    fromager_id TEXT NOT NULL,
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

-- Create table for Production Line 2 (Local Standards)
CREATE TABLE IF NOT EXISTS production_line_local (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fromager_name TEXT NOT NULL,
    fromager_id TEXT NOT NULL,
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

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_pl_international_batch ON production_line_international(batch_id);
CREATE INDEX IF NOT EXISTS idx_pl_international_created_at ON production_line_international(created_at);
CREATE INDEX IF NOT EXISTS idx_pl_international_status ON production_line_international(status);

CREATE INDEX IF NOT EXISTS idx_pl_local_batch ON production_line_local(batch_id);
CREATE INDEX IF NOT EXISTS idx_pl_local_created_at ON production_line_local(created_at);
CREATE INDEX IF NOT EXISTS idx_pl_local_status ON production_line_local(status);

-- Enable RLS
ALTER TABLE production_line_international ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_line_local ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated access
CREATE POLICY "Enable read access for authenticated users"
    ON production_line_international FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert access for authenticated users"
    ON production_line_international FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable read access for authenticated users"
    ON production_line_local FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert access for authenticated users"
    ON production_line_local FOR INSERT
    TO authenticated
    WITH CHECK (true);