-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create production_lines table if it doesn't exist
CREATE TABLE IF NOT EXISTS production_lines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    manager TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Modify cheese_production table to properly handle production line relationship
ALTER TABLE cheese_production 
    DROP COLUMN IF EXISTS production_line_id;

ALTER TABLE cheese_production 
    ADD COLUMN production_line_id UUID REFERENCES production_lines(id);

-- Create cheese_production_stats table if it doesn't exist
CREATE TABLE IF NOT EXISTS cheese_production_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    production_amount FLOAT NOT NULL,
    yield_efficiency FLOAT,
    quality_score INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE production_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE cheese_production_stats ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated access
CREATE POLICY "Enable read access for authenticated users"
    ON production_lines FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users"
    ON cheese_production_stats FOR SELECT TO authenticated USING (true);

-- Insert sample data
INSERT INTO production_lines (name, status, manager)
VALUES 
    ('Production Line A', 'active', 'John Doe'),
    ('Production Line B', 'active', 'Jane Smith')
ON CONFLICT DO NOTHING;

INSERT INTO cheese_production_stats (date, production_amount, yield_efficiency, quality_score)
VALUES 
    (CURRENT_DATE - INTERVAL '7 days', 1200.5, 0.85, 92),
    (CURRENT_DATE - INTERVAL '6 days', 1150.0, 0.82, 88),
    (CURRENT_DATE - INTERVAL '5 days', 1300.0, 0.87, 95),
    (CURRENT_DATE - INTERVAL '4 days', 1250.5, 0.84, 90),
    (CURRENT_DATE - INTERVAL '3 days', 1180.0, 0.83, 87),
    (CURRENT_DATE - INTERVAL '2 days', 1220.0, 0.86, 91),
    (CURRENT_DATE - INTERVAL '1 day', 1275.5, 0.85, 93)
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_production_lines_status ON production_lines(status);
CREATE INDEX IF NOT EXISTS idx_cheese_production_stats_date ON cheese_production_stats(date);