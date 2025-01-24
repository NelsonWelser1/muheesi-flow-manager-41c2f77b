-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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
    batch_id TEXT NOT NULL,
    parameter TEXT NOT NULL,
    value TEXT NOT NULL,
    standard_value TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('passed', 'failed')),
    checked_by TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create quality_trends table
CREATE TABLE IF NOT EXISTS quality_trends (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    pass_rate FLOAT NOT NULL CHECK (pass_rate >= 0 AND pass_rate <= 100),
    average_score FLOAT CHECK (average_score >= 0 AND average_score <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

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

-- Add indexes for better query performance
CREATE INDEX idx_quality_control_batch_id ON quality_control(batch_id);
CREATE INDEX idx_quality_control_created_at ON quality_control(created_at);
CREATE INDEX idx_quality_trends_date ON quality_trends(date);
CREATE INDEX idx_equipment_maintenance_next ON equipment_maintenance(next_maintenance);

-- Enable Row Level Security (RLS)
ALTER TABLE maintenance_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE quality_control ENABLE ROW LEVEL SECURITY;
ALTER TABLE quality_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment_maintenance ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated access
CREATE POLICY "Allow authenticated read access on maintenance_stats"
    ON maintenance_stats FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated read access on quality_control"
    ON quality_control FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated read access on quality_trends"
    ON quality_trends FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated read access on equipment_maintenance"
    ON equipment_maintenance FOR SELECT
    TO authenticated
    USING (true);

-- Insert initial data for testing
INSERT INTO maintenance_stats (completed_today, equipment_health, pending_maintenance)
VALUES (5, 85, 3)
ON CONFLICT DO NOTHING;

INSERT INTO quality_trends (date, pass_rate, average_score)
VALUES 
    (CURRENT_DATE, 85.5, 92.3),
    (CURRENT_DATE - INTERVAL '1 day', 87.2, 91.8),
    (CURRENT_DATE - INTERVAL '2 days', 86.8, 90.5)
ON CONFLICT DO NOTHING;

INSERT INTO quality_control (batch_id, parameter, value, standard_value, status, checked_by)
VALUES 
    ('BATCH-001', 'Temperature', '72.5°C', '72.0°C - 73.0°C', 'passed', 'John Smith'),
    ('BATCH-001', 'pH Level', '6.2', '6.0 - 6.4', 'passed', 'John Smith'),
    ('BATCH-002', 'Moisture Content', '45%', '43% - 46%', 'passed', 'Jane Doe')
ON CONFLICT DO NOTHING;

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