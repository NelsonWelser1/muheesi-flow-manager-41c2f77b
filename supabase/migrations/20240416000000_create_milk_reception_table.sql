-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create milk_reception table
CREATE TABLE IF NOT EXISTS milk_reception (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dateTime TIMESTAMP WITH TIME ZONE NOT NULL,
    supplierName TEXT NOT NULL,
    milkVolume DECIMAL(10,2) NOT NULL,
    temperature DECIMAL(5,2) NOT NULL,
    milkType TEXT NOT NULL,
    batchId TEXT NOT NULL,
    fatPercentage DECIMAL(5,2) NOT NULL,
    proteinPercentage DECIMAL(5,2) NOT NULL,
    totalPlateCount INTEGER NOT NULL,
    acidity DECIMAL(5,2) NOT NULL,
    quality_score INTEGER NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_milk_reception_batch_id ON milk_reception(batchId);
CREATE INDEX idx_milk_reception_datetime ON milk_reception(dateTime);
CREATE INDEX idx_milk_reception_supplier ON milk_reception(supplierName);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_milk_reception_updated_at
    BEFORE UPDATE ON milk_reception
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies
ALTER TABLE milk_reception ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for authenticated users"
ON milk_reception FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable insert access for authenticated users"
ON milk_reception FOR INSERT
TO authenticated
WITH CHECK (true);