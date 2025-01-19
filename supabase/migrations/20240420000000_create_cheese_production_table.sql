-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the cheese_production table if it doesn't exist
CREATE TABLE IF NOT EXISTS cheese_production (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_number TEXT NOT NULL,
    cheese_type TEXT NOT NULL,
    status TEXT NOT NULL,
    temperature FLOAT NOT NULL,
    duration INTEGER NOT NULL,
    ph_level FLOAT NOT NULL,
    yield_amount FLOAT,
    quality_score INTEGER,
    production_line_id UUID,
    progress INTEGER DEFAULT 0,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE cheese_production ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
CREATE POLICY "Enable read access for authenticated users"
    ON cheese_production FOR SELECT
    USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cheese_production_status ON cheese_production(status);
CREATE INDEX IF NOT EXISTS idx_cheese_production_created_at ON cheese_production(created_at);

-- Insert sample data for testing
INSERT INTO cheese_production (
    batch_number,
    cheese_type,
    status,
    temperature,
    duration,
    ph_level,
    yield_amount,
    quality_score,
    progress
) VALUES (
    'BATCH-001',
    'Cheddar',
    'in_progress',
    21.5,
    48,
    6.5,
    100.5,
    95,
    75
);