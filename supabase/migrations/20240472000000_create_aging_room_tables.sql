-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create aging room records table
CREATE TABLE aging_room_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id TEXT NOT NULL,
    temperature FLOAT NOT NULL,
    humidity INTEGER NOT NULL,
    occupancy INTEGER NOT NULL,
    cheese_type TEXT NOT NULL,
    aging_duration INTEGER NOT NULL,
    notes TEXT,
    recorded_by TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE aging_room_records ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for authenticated users" ON aging_room_records
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert access for authenticated users" ON aging_room_records
    FOR INSERT TO authenticated WITH CHECK (true);

-- Create indexes
CREATE INDEX idx_aging_room_records_room ON aging_room_records(room_id);
CREATE INDEX idx_aging_room_records_date ON aging_room_records(created_at);