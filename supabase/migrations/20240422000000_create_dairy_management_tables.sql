-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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

-- Create dairy_cooler_records table
CREATE TABLE IF NOT EXISTS dairy_cooler_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cooler_id TEXT NOT NULL,
    temperature FLOAT NOT NULL,
    humidity FLOAT,
    status TEXT NOT NULL,
    last_check TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create quality_control table
CREATE TABLE IF NOT EXISTS quality_control (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id UUID NOT NULL,
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

-- Create production_lines table if it doesn't exist
CREATE TABLE IF NOT EXISTS production_lines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    manager TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create or modify cheese_production table
CREATE TABLE IF NOT EXISTS cheese_production (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_number TEXT NOT NULL,
    cheese_type TEXT NOT NULL,
    status TEXT NOT NULL,
    temperature FLOAT NOT NULL,
    duration INTEGER NOT NULL,
    ph_level FLOAT NOT NULL,
    production_line_id UUID REFERENCES production_lines(id),
    start_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create cheese_production_stats table
CREATE TABLE IF NOT EXISTS cheese_production_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    production_amount FLOAT NOT NULL,
    yield_efficiency FLOAT,
    quality_score INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE equipment_maintenance ENABLE ROW LEVEL SECURITY;
ALTER TABLE dairy_cooler_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE quality_control ENABLE ROW LEVEL SECURITY;
ALTER TABLE quality_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE cheese_production ENABLE ROW LEVEL SECURITY;
ALTER TABLE cheese_production_stats ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Enable read access for authenticated users" ON equipment_maintenance
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON dairy_cooler_records
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON quality_control
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON quality_trends
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON production_lines
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON cheese_production
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON cheese_production_stats
    FOR SELECT TO authenticated USING (true);

-- Insert sample data
INSERT INTO production_lines (name, status, manager)
VALUES 
    ('Production Line A', 'active', 'John Doe'),
    ('Production Line B', 'active', 'Jane Smith'),
    ('Production Line C', 'maintenance', 'Bob Wilson')
ON CONFLICT DO NOTHING;

INSERT INTO equipment_maintenance (equipment_name, maintenance_type, status, next_maintenance, health_score)
VALUES 
    ('Pasteurizer 1', 'Routine Check', 'scheduled', CURRENT_TIMESTAMP + INTERVAL '7 days', 95),
    ('Cheese Vat 2', 'Deep Clean', 'pending', CURRENT_TIMESTAMP + INTERVAL '3 days', 88),
    ('Cooling Unit 1', 'Repair', 'urgent', CURRENT_TIMESTAMP + INTERVAL '1 day', 75)
ON CONFLICT DO NOTHING;

INSERT INTO dairy_cooler_records (cooler_id, temperature, humidity, status)
VALUES 
    ('COOL-001', 4.2, 85, 'operational'),
    ('COOL-002', 3.8, 82, 'operational'),
    ('COOL-003', 4.5, 87, 'maintenance')
ON CONFLICT DO NOTHING;

INSERT INTO quality_trends (date, pass_rate, average_score)
VALUES 
    (CURRENT_DATE - INTERVAL '6 days', 92.5, 88),
    (CURRENT_DATE - INTERVAL '5 days', 94.0, 89),
    (CURRENT_DATE - INTERVAL '4 days', 91.5, 87),
    (CURRENT_DATE - INTERVAL '3 days', 95.0, 90),
    (CURRENT_DATE - INTERVAL '2 days', 93.5, 88),
    (CURRENT_DATE - INTERVAL '1 day', 94.5, 89),
    (CURRENT_DATE, 96.0, 91)
ON CONFLICT DO NOTHING;

INSERT INTO cheese_production_stats (date, production_amount, yield_efficiency, quality_score)
VALUES 
    (CURRENT_DATE - INTERVAL '6 days', 1200, 0.85, 92),
    (CURRENT_DATE - INTERVAL '5 days', 1150, 0.83, 89),
    (CURRENT_DATE - INTERVAL '4 days', 1300, 0.87, 94),
    (CURRENT_DATE - INTERVAL '3 days', 1250, 0.86, 91),
    (CURRENT_DATE - INTERVAL '2 days', 1180, 0.84, 90),
    (CURRENT_DATE - INTERVAL '1 day', 1220, 0.85, 93),
    (CURRENT_DATE, 1275, 0.86, 92)
ON CONFLICT DO NOTHING;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_equipment_maintenance_next ON equipment_maintenance(next_maintenance);
CREATE INDEX IF NOT EXISTS idx_dairy_cooler_records_created ON dairy_cooler_records(created_at);
CREATE INDEX IF NOT EXISTS idx_quality_control_created ON quality_control(created_at);
CREATE INDEX IF NOT EXISTS idx_quality_trends_date ON quality_trends(date);
CREATE INDEX IF NOT EXISTS idx_cheese_production_created ON cheese_production(created_at);
CREATE INDEX IF NOT EXISTS idx_cheese_production_stats_date ON cheese_production_stats(date);