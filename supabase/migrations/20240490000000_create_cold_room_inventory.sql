
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create cold room inventory table
CREATE TABLE cold_room_inventory (
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
    user_id UUID REFERENCES auth.users(id),
    username TEXT,
    login_time TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for common queries
CREATE INDEX idx_cold_room_batch ON cold_room_inventory(cold_room_id, batch_id);
CREATE INDEX idx_storage_date ON cold_room_inventory(storage_date_time);
CREATE INDEX idx_operator ON cold_room_inventory(operator_id);

-- Create RLS policies
ALTER TABLE cold_room_inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view cold room inventory"
    ON cold_room_inventory FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert cold room inventory"
    ON cold_room_inventory FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Add trigger for updating updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cold_room_inventory_updated_at
    BEFORE UPDATE ON cold_room_inventory
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
