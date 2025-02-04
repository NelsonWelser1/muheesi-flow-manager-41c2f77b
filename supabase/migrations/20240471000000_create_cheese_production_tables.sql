-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create table for Production Line 1
CREATE TABLE IF NOT EXISTS cheese_production_line_1 (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    production_line_id INTEGER NOT NULL,
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create table for Production Line 2
CREATE TABLE IF NOT EXISTS cheese_production_line_2 (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    production_line_id INTEGER NOT NULL,
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE cheese_production_line_1 ENABLE ROW LEVEL SECURITY;
ALTER TABLE cheese_production_line_2 ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated access
CREATE POLICY "Enable read access for authenticated users"
    ON cheese_production_line_1
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert access for authenticated users"
    ON cheese_production_line_1
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable read access for authenticated users"
    ON cheese_production_line_2
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert access for authenticated users"
    ON cheese_production_line_2
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_cheese_production_line_1_batch ON cheese_production_line_1(batch_id);
CREATE INDEX idx_cheese_production_line_2_batch ON cheese_production_line_2(batch_id);