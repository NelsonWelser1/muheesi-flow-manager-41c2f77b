-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enhance cheese production table
CREATE TABLE IF NOT EXISTS cheese_production (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_number TEXT NOT NULL,
    status TEXT NOT NULL,
    temperature FLOAT NOT NULL,
    duration INTEGER NOT NULL,
    ph_level FLOAT NOT NULL,
    yield_amount FLOAT,
    quality_score INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add production statistics table
CREATE TABLE IF NOT EXISTS cheese_production_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    production_amount FLOAT NOT NULL,
    yield_efficiency FLOAT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enhance quality control table
CREATE TABLE IF NOT EXISTS quality_control (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id TEXT NOT NULL,
    parameter TEXT NOT NULL,
    value TEXT NOT NULL,
    standard_value TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add quality trends table
CREATE TABLE IF NOT EXISTS quality_trends (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    pass_rate FLOAT NOT NULL,
    average_score FLOAT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enhance equipment maintenance table
CREATE TABLE IF NOT EXISTS equipment_maintenance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    equipment_name TEXT NOT NULL,
    status TEXT NOT NULL,
    maintenance_type TEXT NOT NULL,
    last_maintenance TIMESTAMP WITH TIME ZONE NOT NULL,
    next_maintenance TIMESTAMP WITH TIME ZONE NOT NULL,
    health_score INTEGER NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add maintenance statistics table
CREATE TABLE IF NOT EXISTS maintenance_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    completed_today INTEGER NOT NULL DEFAULT 0,
    equipment_health INTEGER NOT NULL DEFAULT 0,
    pending_maintenance INTEGER NOT NULL DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_cheese_production_batch_number ON cheese_production(batch_number);
CREATE INDEX IF NOT EXISTS idx_quality_control_batch_id ON quality_control(batch_id);
CREATE INDEX IF NOT EXISTS idx_equipment_maintenance_status ON equipment_maintenance(status);

-- Add RLS policies
ALTER TABLE cheese_production ENABLE ROW LEVEL SECURITY;
ALTER TABLE cheese_production_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE quality_control ENABLE ROW LEVEL SECURITY;
ALTER TABLE quality_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment_maintenance ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_stats ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Allow authenticated read access" ON cheese_production FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access" ON cheese_production_stats FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access" ON quality_control FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access" ON quality_trends FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access" ON equipment_maintenance FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access" ON maintenance_stats FOR SELECT TO authenticated USING (true);