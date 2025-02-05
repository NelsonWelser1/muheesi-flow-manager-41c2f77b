-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create cheese vat records table
CREATE TABLE cheese_vat_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vat_id TEXT NOT NULL,
    status TEXT NOT NULL,
    product_type TEXT NOT NULL,
    current_phase TEXT NOT NULL,
    temperature FLOAT NOT NULL,
    ph_level FLOAT,
    stirring_speed INTEGER,
    curd_size FLOAT,
    operator_id TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE cheese_vat_records ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for authenticated users" ON cheese_vat_records
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert access for authenticated users" ON cheese_vat_records
    FOR INSERT TO authenticated WITH CHECK (true);

-- Create indexes
CREATE INDEX idx_cheese_vat_records_vat ON cheese_vat_records(vat_id);
CREATE INDEX idx_cheese_vat_records_date ON cheese_vat_records(created_at);