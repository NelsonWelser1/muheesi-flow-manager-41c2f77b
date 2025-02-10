
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create cold_room_inventory table
CREATE TABLE IF NOT EXISTS cold_room_inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cold_room_id TEXT NOT NULL,
    batch_id TEXT NOT NULL,
    storage_date_time TIMESTAMP WITH TIME ZONE NOT NULL,
    temperature DECIMAL(5,2) NOT NULL,
    humidity DECIMAL(5,2) NOT NULL,
    quantity_stored INTEGER NOT NULL,
    movement_action TEXT NOT NULL CHECK (movement_action IN ('In', 'Out')),
    remarks TEXT,
    operator_id TEXT NOT NULL,
    user_id UUID NOT NULL,
    username TEXT NOT NULL,
    login_time TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for common queries
CREATE INDEX idx_cold_room_batch ON cold_room_inventory(batch_id);
CREATE INDEX idx_cold_room_date ON cold_room_inventory(storage_date_time);
CREATE INDEX idx_cold_room_operator ON cold_room_inventory(operator_id);

-- Add RLS policies
ALTER TABLE cold_room_inventory ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for authenticated users" ON cold_room_inventory
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert for authenticated users" ON cold_room_inventory
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON cold_room_inventory
    FOR UPDATE TO authenticated USING (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_cold_room_inventory_updated_at
    BEFORE UPDATE ON cold_room_inventory
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
