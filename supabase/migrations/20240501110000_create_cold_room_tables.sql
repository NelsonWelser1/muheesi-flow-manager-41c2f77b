
-- Create cold room inventory table
CREATE TABLE IF NOT EXISTS cold_room_inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cold_room_id TEXT NOT NULL,
    batch_id TEXT NOT NULL,
    temperature DECIMAL(5,2) NOT NULL,
    humidity DECIMAL(5,2) NOT NULL,
    quantity_stored INTEGER NOT NULL CHECK (quantity_stored >= 0),
    movement_action TEXT NOT NULL CHECK (movement_action IN ('In', 'Out')),
    remarks TEXT,
    operator_id TEXT NOT NULL,
    storage_date_time TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create environment logs table for IoT sensor data
CREATE TABLE IF NOT EXISTS cold_room_environment_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cold_room_id TEXT NOT NULL,
    temperature DECIMAL(5,2) NOT NULL,
    humidity DECIMAL(5,2) NOT NULL,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indices for common queries
CREATE INDEX idx_cold_room_batch ON cold_room_inventory(batch_id);
CREATE INDEX idx_cold_room_date ON cold_room_inventory(storage_date_time);
CREATE INDEX idx_environment_logs_date ON cold_room_environment_logs(recorded_at);

-- Create trigger for updating updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cold_room_inventory_updated_at
    BEFORE UPDATE ON cold_room_inventory
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies
ALTER TABLE cold_room_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE cold_room_environment_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for authenticated users" ON cold_room_inventory
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert for authenticated users" ON cold_room_inventory
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON cold_room_inventory
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Similar policies for environment logs
CREATE POLICY "Enable read access for authenticated users" ON cold_room_environment_logs
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert for authenticated users" ON cold_room_environment_logs
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

