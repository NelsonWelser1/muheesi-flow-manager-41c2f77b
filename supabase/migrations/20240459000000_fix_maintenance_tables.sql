-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop tables if they exist to ensure clean state
DROP TABLE IF EXISTS equipment_maintenance;
DROP TABLE IF EXISTS maintenance_stats;

-- Create equipment_maintenance table
CREATE TABLE IF NOT EXISTS equipment_maintenance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    equipment_name TEXT NOT NULL,
    maintenance_type TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('due', 'upcoming', 'overdue', 'completed')),
    last_maintenance TIMESTAMP WITH TIME ZONE,
    next_maintenance TIMESTAMP WITH TIME ZONE NOT NULL,
    health_score INTEGER NOT NULL CHECK (health_score >= 0 AND health_score <= 100),
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

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_equipment_maintenance_next ON equipment_maintenance(next_maintenance);
CREATE INDEX IF NOT EXISTS idx_equipment_maintenance_status ON equipment_maintenance(status);

-- Enable Row Level Security (RLS)
ALTER TABLE equipment_maintenance ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_stats ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated access
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Allow authenticated read access on equipment_maintenance" ON equipment_maintenance;
    DROP POLICY IF EXISTS "Allow authenticated read access on maintenance_stats" ON maintenance_stats;
END $$;

CREATE POLICY "Allow authenticated read access on equipment_maintenance"
    ON equipment_maintenance FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated read access on maintenance_stats"
    ON maintenance_stats FOR SELECT
    TO authenticated
    USING (true);

-- Insert initial maintenance stats record if not exists
INSERT INTO maintenance_stats (completed_today, equipment_health, pending_maintenance)
VALUES (5, 85, 3)
ON CONFLICT DO NOTHING;

-- Insert sample equipment maintenance records
INSERT INTO equipment_maintenance (
    equipment_name,
    maintenance_type,
    status,
    last_maintenance,
    next_maintenance,
    health_score,
    notes
)
VALUES 
    ('Milk Pasteurizer', 'Routine Check', 'due', NOW() - INTERVAL '30 days', NOW() + INTERVAL '7 days', 85, 'Monthly inspection required'),
    ('Cheese Vat', 'Deep Clean', 'upcoming', NOW() - INTERVAL '15 days', NOW() + INTERVAL '15 days', 90, 'Quarterly deep cleaning'),
    ('Cooling System', 'Maintenance', 'overdue', NOW() - INTERVAL '45 days', NOW() - INTERVAL '5 days', 75, 'Urgent maintenance needed')
ON CONFLICT DO NOTHING;