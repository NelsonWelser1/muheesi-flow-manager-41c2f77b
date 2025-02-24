
-- Add company and project columns to maintenance_records table
CREATE TABLE IF NOT EXISTS maintenance_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    equipment_name TEXT NOT NULL,
    maintenance_type TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('due', 'upcoming', 'overdue', 'completed')),
    last_maintenance TIMESTAMP WITH TIME ZONE,
    next_maintenance TIMESTAMP WITH TIME ZONE NOT NULL,
    health_score INTEGER NOT NULL CHECK (health_score >= 0 AND health_score <= 100),
    notes TEXT,
    company TEXT NOT NULL DEFAULT 'Grand Berna Dairies',
    project TEXT NOT NULL DEFAULT 'Cheese Factory',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create maintenance_stats table if it doesn't exist
CREATE TABLE IF NOT EXISTS maintenance_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    completed_today INTEGER NOT NULL DEFAULT 0,
    equipment_health INTEGER NOT NULL DEFAULT 0,
    pending_maintenance INTEGER NOT NULL DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Drop any existing indexes to avoid conflicts
DROP INDEX IF EXISTS idx_equipment_maintenance_next;
DROP INDEX IF EXISTS idx_maintenance_records_next;

-- Create new index with correct name
CREATE INDEX idx_maintenance_records_next ON maintenance_records(next_maintenance);

-- Enable RLS
ALTER TABLE maintenance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_stats ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow authenticated read access on maintenance_records" ON maintenance_records;
DROP POLICY IF EXISTS "Allow authenticated insert access on maintenance_records" ON maintenance_records;
DROP POLICY IF EXISTS "Allow authenticated update access on maintenance_records" ON maintenance_records;

-- Create new policies with correct table name
CREATE POLICY "Enable all access for maintenance records"
ON maintenance_records
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Insert initial maintenance stats if none exist
INSERT INTO maintenance_stats (completed_today, equipment_health, pending_maintenance)
SELECT 0, 100, 0
WHERE NOT EXISTS (SELECT 1 FROM maintenance_stats);
