-- Create equipment_maintenance table
CREATE TABLE IF NOT EXISTS equipment_maintenance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    equipment_name TEXT NOT NULL,
    last_maintenance TIMESTAMP WITH TIME ZONE,
    next_maintenance TIMESTAMP WITH TIME ZONE,
    maintenance_notes TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create maintenance_stats table
CREATE TABLE IF NOT EXISTS maintenance_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    total_equipment INT DEFAULT 0,
    pending_maintenance INT DEFAULT 0,
    completed_maintenance INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add RLS policies
ALTER TABLE equipment_maintenance ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_stats ENABLE ROW LEVEL SECURITY;

-- Add policies for equipment_maintenance
CREATE POLICY "Enable read access for all users" ON equipment_maintenance
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON equipment_maintenance
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON equipment_maintenance
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Add policies for maintenance_stats
CREATE POLICY "Enable read access for all users" ON maintenance_stats
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON maintenance_stats
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON maintenance_stats
    FOR UPDATE USING (auth.role() = 'authenticated');