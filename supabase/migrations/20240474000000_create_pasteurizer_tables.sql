-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create pasteurizer records table
CREATE TABLE pasteurizer_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_id TEXT NOT NULL,
    status TEXT NOT NULL,
    current_temperature FLOAT NOT NULL,
    target_temperature FLOAT NOT NULL,
    batch_volume FLOAT NOT NULL,
    flow_rate FLOAT,
    holding_time INTEGER,
    operator_id TEXT NOT NULL,
    cleaning_status TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE pasteurizer_records ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for authenticated users" ON pasteurizer_records
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert access for authenticated users" ON pasteurizer_records
    FOR INSERT TO authenticated WITH CHECK (true);

-- Create indexes
CREATE INDEX idx_pasteurizer_records_unit ON pasteurizer_records(unit_id);
CREATE INDEX idx_pasteurizer_records_date ON pasteurizer_records(created_at);