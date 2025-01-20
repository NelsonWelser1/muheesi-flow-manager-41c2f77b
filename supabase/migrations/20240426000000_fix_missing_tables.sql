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

-- Drop and recreate cheese_production table to fix foreign key
DROP TABLE IF EXISTS cheese_production CASCADE;
CREATE TABLE cheese_production (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_number TEXT NOT NULL,
    status TEXT NOT NULL,
    temperature FLOAT NOT NULL,
    duration INTEGER NOT NULL,
    ph_level FLOAT NOT NULL,
    production_line_id UUID REFERENCES production_lines(id),
    progress INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create cheese_production_stats table
CREATE TABLE IF NOT EXISTS cheese_production_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    production_amount FLOAT NOT NULL,
    quality_score INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create equipment_maintenance table
CREATE TABLE IF NOT EXISTS equipment_maintenance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    equipment_name TEXT NOT NULL,
    maintenance_type TEXT NOT NULL,
    status TEXT NOT NULL,
    last_maintenance TIMESTAMP WITH TIME ZONE,
    next_maintenance TIMESTAMP WITH TIME ZONE NOT NULL,
    health_score INTEGER NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create maintenance_stats table
CREATE TABLE IF NOT EXISTS maintenance_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    completed_today INTEGER NOT NULL DEFAULT 0,
    equipment_health INTEGER NOT NULL DEFAULT 0,
    pending_maintenance INTEGER NOT NULL DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create quality_control table
CREATE TABLE IF NOT EXISTS quality_control (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id UUID REFERENCES cheese_production(id),
    parameter TEXT NOT NULL,
    value FLOAT NOT NULL,
    standard_value FLOAT NOT NULL,
    status TEXT NOT NULL,
    checked_by TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create quality_trends table
CREATE TABLE IF NOT EXISTS quality_trends (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    pass_rate FLOAT NOT NULL,
    average_score FLOAT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE production_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE cheese_production ENABLE ROW LEVEL SECURITY;
ALTER TABLE cheese_production_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment_maintenance ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE quality_control ENABLE ROW LEVEL SECURITY;
ALTER TABLE quality_trends ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated access
CREATE POLICY "Enable read access for authenticated users" ON production_lines
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON cheese_production
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON cheese_production_stats
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON equipment_maintenance
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON maintenance_stats
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON quality_control
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON quality_trends
    FOR SELECT TO authenticated USING (true);

-- Insert sample data
INSERT INTO production_lines (name, status, manager)
VALUES 
    ('Production Line A', 'active', 'John Doe'),
    ('Production Line B', 'active', 'Jane Smith')
ON CONFLICT DO NOTHING;

INSERT INTO equipment_maintenance (
    equipment_name,
    maintenance_type,
    status,
    next_maintenance,
    health_score,
    notes
)
VALUES 
    ('Pasteurizer 1', 'Routine Check', 'scheduled', CURRENT_TIMESTAMP + INTERVAL '7 days', 95, 'Regular maintenance'),
    ('Cheese Vat 2', 'Deep Clean', 'pending', CURRENT_TIMESTAMP + INTERVAL '3 days', 88, 'Needs thorough cleaning'),
    ('Cooling Unit 1', 'Repair', 'urgent', CURRENT_TIMESTAMP + INTERVAL '1 day', 75, 'Temperature fluctuations detected')
ON CONFLICT DO NOTHING;

INSERT INTO maintenance_stats (completed_today, equipment_health, pending_maintenance)
VALUES (3, 92, 2)
ON CONFLICT DO NOTHING;

INSERT INTO quality_trends (date, pass_rate, average_score)
SELECT 
    CURRENT_DATE - (generate_series || ' days')::INTERVAL,
    85 + (random() * 10)::INTEGER,
    88 + (random() * 7)::INTEGER
FROM generate_series(0, 6);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cheese_production_created_at 
    ON cheese_production(created_at);
CREATE INDEX IF NOT EXISTS idx_cheese_production_stats_date 
    ON cheese_production_stats(date);
CREATE INDEX IF NOT EXISTS idx_equipment_maintenance_next 
    ON equipment_maintenance(next_maintenance);
CREATE INDEX IF NOT EXISTS idx_quality_control_created 
    ON quality_control(created_at);
CREATE INDEX IF NOT EXISTS idx_quality_trends_date 
    ON quality_trends(date);