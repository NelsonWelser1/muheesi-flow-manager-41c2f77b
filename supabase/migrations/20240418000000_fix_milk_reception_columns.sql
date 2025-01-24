-- Drop the existing milk_reception table
DROP TABLE IF EXISTS milk_reception;

-- Create milk_reception table with correct columns
CREATE TABLE IF NOT EXISTS milk_reception (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_name TEXT NOT NULL,
    milk_volume DECIMAL(10,2) NOT NULL,
    temperature DECIMAL(5,2) NOT NULL,
    fat_percentage DECIMAL(5,2) NOT NULL,
    protein_percentage DECIMAL(5,2) NOT NULL,
    total_plate_count INTEGER NOT NULL,
    acidity DECIMAL(5,2) NOT NULL,
    notes TEXT,
    datetime TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    quality_score INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE milk_reception ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for authenticated users"
ON milk_reception FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable insert access for authenticated users"
ON milk_reception FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create indexes
CREATE INDEX idx_milk_reception_datetime ON milk_reception(datetime);
CREATE INDEX idx_milk_reception_supplier ON milk_reception(supplier_name);

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