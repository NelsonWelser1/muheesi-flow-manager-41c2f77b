-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the cheese_production table if it doesn't exist
CREATE TABLE IF NOT EXISTS cheese_production (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_number TEXT NOT NULL,
    status TEXT NOT NULL,
    temperature FLOAT NOT NULL,
    duration INTEGER NOT NULL,
    ph_level FLOAT NOT NULL,
    yield_amount FLOAT,
    quality_score INTEGER,
    production_line_id UUID,
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