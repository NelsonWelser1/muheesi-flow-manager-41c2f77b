-- Drop dependent objects first
DROP VIEW IF EXISTS milk_reception_quality_metrics;
DROP TABLE IF EXISTS milk_reception_audit_log;
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
    user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE milk_reception ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON milk_reception;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON milk_reception;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON milk_reception;

-- Create updated policies
CREATE POLICY "Enable read access for authenticated users"
ON milk_reception FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable insert access for authenticated users"
ON milk_reception FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Enable update access for own rows"
ON milk_reception FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_milk_reception_datetime ON milk_reception(datetime);
CREATE INDEX idx_milk_reception_supplier ON milk_reception(supplier_name);
CREATE INDEX idx_milk_reception_user_id ON milk_reception(user_id);

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

-- Recreate the quality metrics view
CREATE OR REPLACE VIEW milk_reception_quality_metrics AS
SELECT 
    date_trunc('day', datetime) as reception_date,
    COUNT(*) as total_receptions,
    AVG(quality_score) as avg_quality_score,
    AVG(fat_percentage) as avg_fat_percentage,
    AVG(protein_percentage) as avg_protein_percentage,
    SUM(milk_volume) as total_volume
FROM milk_reception
GROUP BY date_trunc('day', datetime)
ORDER BY reception_date DESC;

-- Recreate the audit log table with user tracking
CREATE TABLE IF NOT EXISTS milk_reception_audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    milk_reception_id UUID REFERENCES milk_reception(id),
    user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid(),
    action TEXT NOT NULL,
    old_data JSONB,
    new_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);