
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create packaging_records table
CREATE TABLE IF NOT EXISTS packaging_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id TEXT NOT NULL,
    cheese_type TEXT NOT NULL,
    package_size TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    package_material TEXT,
    package_weight DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    created_by UUID REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE packaging_records ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Enable read access for authenticated users"
    ON packaging_records FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert access for authenticated users"
    ON packaging_records FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX idx_packaging_records_batch_id ON packaging_records(batch_id);
CREATE INDEX idx_packaging_records_created_at ON packaging_records(created_at);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_packaging_records_updated_at
    BEFORE UPDATE ON packaging_records
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
