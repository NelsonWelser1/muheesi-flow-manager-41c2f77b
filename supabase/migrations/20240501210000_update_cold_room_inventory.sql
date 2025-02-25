
-- Drop existing cold_room_inventory table if it exists
DROP TABLE IF EXISTS cold_room_inventory CASCADE;

-- Create updated cold_room_inventory table
CREATE TABLE IF NOT EXISTS cold_room_inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cold_room_id TEXT NOT NULL,
    product_category TEXT NOT NULL,
    product_type TEXT NOT NULL,
    batch_id TEXT NOT NULL,
    production_batch_id TEXT,
    unit_weight DECIMAL(10,2) NOT NULL,
    unit_quantity INTEGER NOT NULL,
    temperature DECIMAL(5,2) NOT NULL,
    humidity DECIMAL(5,2) NOT NULL,
    movement_action TEXT NOT NULL CHECK (movement_action IN ('In', 'Out')),
    remarks TEXT,
    operator_id TEXT NOT NULL,
    storage_date_time TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indices for common queries
CREATE INDEX idx_cold_room_batch ON cold_room_inventory(batch_id);
CREATE INDEX idx_cold_room_prod_batch ON cold_room_inventory(production_batch_id);
CREATE INDEX idx_cold_room_date ON cold_room_inventory(storage_date_time);

-- Create trigger for updating updated_at
CREATE OR REPLACE FUNCTION update_updated_at_cold_room()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cold_room_inventory_updated_at
    BEFORE UPDATE ON cold_room_inventory
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_cold_room();

-- Enable RLS and create policies
ALTER TABLE cold_room_inventory ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow all access for authenticated users
CREATE POLICY "Enable all access for authenticated users"
ON cold_room_inventory
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create a policy to allow anonymous access for testing purposes (temporary)
CREATE POLICY "Allow anonymous access for testing"
ON cold_room_inventory
FOR ALL
TO anon
USING (true)
WITH CHECK (true);
