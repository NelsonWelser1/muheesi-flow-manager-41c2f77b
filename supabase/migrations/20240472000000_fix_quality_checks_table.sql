
-- Drop the existing quality_checks table if it exists
DROP TABLE IF EXISTS quality_checks;

-- Create the quality_checks table with the correct structure
CREATE TABLE IF NOT EXISTS quality_checks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id TEXT NOT NULL,
    temperature_value TEXT NOT NULL,
    temperature_standard TEXT NOT NULL,
    temperature_status TEXT NOT NULL CHECK (temperature_status IN ('passed', 'failed')),
    ph_level_value TEXT NOT NULL,
    ph_level_standard TEXT NOT NULL,
    ph_level_status TEXT NOT NULL CHECK (ph_level_status IN ('passed', 'failed')),
    moisture_content_value TEXT NOT NULL,
    moisture_content_standard TEXT NOT NULL,
    moisture_content_status TEXT NOT NULL CHECK (moisture_content_status IN ('passed', 'failed')),
    fat_content_value TEXT NOT NULL,
    fat_content_standard TEXT NOT NULL,
    fat_content_status TEXT NOT NULL CHECK (fat_content_status IN ('passed', 'failed')),
    protein_content_value TEXT NOT NULL,
    protein_content_standard TEXT NOT NULL,
    protein_content_status TEXT NOT NULL CHECK (protein_content_status IN ('passed', 'failed')),
    salt_content_value TEXT NOT NULL,
    salt_content_standard TEXT NOT NULL,
    salt_content_status TEXT NOT NULL CHECK (salt_content_status IN ('passed', 'failed')),
    notes TEXT,
    checked_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE quality_checks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all authenticated users"
    ON quality_checks FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert access for authenticated users"
    ON quality_checks FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_quality_checks_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_quality_checks_modified_column
    BEFORE UPDATE ON quality_checks
    FOR EACH ROW
    EXECUTE FUNCTION update_quality_checks_modified_column();
