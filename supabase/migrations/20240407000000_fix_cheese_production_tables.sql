-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create production_lines table if it doesn't exist
CREATE TABLE IF NOT EXISTS production_lines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    manager TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create cheese_production table if it doesn't exist
CREATE TABLE IF NOT EXISTS cheese_production (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_number TEXT NOT NULL,
    status TEXT NOT NULL,
    temperature FLOAT NOT NULL,
    duration INTEGER NOT NULL,
    ph_level FLOAT NOT NULL,
    yield_amount FLOAT,
    quality_score INTEGER,
    production_line_id UUID REFERENCES production_lines(id),
    progress INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create cheese_production_stats table if it doesn't exist
CREATE TABLE IF NOT EXISTS cheese_production_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    production_amount FLOAT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE production_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE cheese_production ENABLE ROW LEVEL SECURITY;
ALTER TABLE cheese_production_stats ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated access
CREATE POLICY "Enable read access for authenticated users"
    ON production_lines FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users"
    ON cheese_production FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users"
    ON cheese_production_stats FOR SELECT TO authenticated USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cheese_production_status ON cheese_production(status);
CREATE INDEX IF NOT EXISTS idx_cheese_production_created_at ON cheese_production(created_at);
CREATE INDEX IF NOT EXISTS idx_production_stats_date ON cheese_production_stats(date);

-- Insert some sample data if tables are empty
INSERT INTO production_lines (name, manager, status)
SELECT 'Production Line 1', 'John Doe', 'active'
WHERE NOT EXISTS (SELECT 1 FROM production_lines LIMIT 1);

INSERT INTO cheese_production (
    batch_number, 
    status, 
    temperature, 
    duration, 
    ph_level, 
    yield_amount, 
    quality_score,
    production_line_id,
    progress
)
SELECT 
    'BATCH-001',
    'active',
    21.5,
    48,
    6.5,
    100.5,
    95,
    (SELECT id FROM production_lines LIMIT 1),
    75
WHERE NOT EXISTS (SELECT 1 FROM cheese_production LIMIT 1);

INSERT INTO cheese_production_stats (date, production_amount)
SELECT 
    CURRENT_DATE,
    150.5
WHERE NOT EXISTS (SELECT 1 FROM cheese_production_stats LIMIT 1);