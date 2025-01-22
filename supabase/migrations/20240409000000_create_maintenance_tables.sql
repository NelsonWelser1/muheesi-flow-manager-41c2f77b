-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create equipment maintenance table
CREATE TABLE IF NOT EXISTS equipment_maintenance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    equipment_name TEXT NOT NULL,
    maintenance_type TEXT NOT NULL,
    status TEXT NOT NULL,
    last_maintenance TIMESTAMP WITH TIME ZONE,
    next_maintenance TIMESTAMP WITH TIME ZONE NOT NULL,
    health_score INTEGER NOT NULL DEFAULT 100,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create maintenance statistics table
CREATE TABLE IF NOT EXISTS maintenance_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    completed_today INTEGER NOT NULL DEFAULT 0,
    equipment_health INTEGER NOT NULL DEFAULT 0,
    pending_maintenance INTEGER NOT NULL DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add RLS policies
ALTER TABLE equipment_maintenance ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_stats ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Allow authenticated read access" ON equipment_maintenance
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated insert access" ON equipment_maintenance
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated update access" ON equipment_maintenance
    FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated read access" ON maintenance_stats
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated update access" ON maintenance_stats
    FOR UPDATE TO authenticated USING (true);

-- Create indexes for better query performance
CREATE INDEX idx_equipment_maintenance_next ON equipment_maintenance(next_maintenance);
CREATE INDEX idx_equipment_maintenance_status ON equipment_maintenance(status);

-- Insert initial maintenance stats record
INSERT INTO maintenance_stats (completed_today, equipment_health, pending_maintenance)
VALUES (0, 100, 0);