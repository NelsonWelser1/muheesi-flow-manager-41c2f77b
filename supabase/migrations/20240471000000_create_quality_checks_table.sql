
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing quality_checks table if it exists
DROP TABLE IF EXISTS quality_checks;

-- Create quality_checks table with all parameters in a single row
CREATE TABLE IF NOT EXISTS quality_checks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id TEXT NOT NULL,
    -- Temperature
    temperature_value TEXT NOT NULL,
    temperature_standard TEXT NOT NULL,
    temperature_status TEXT NOT NULL CHECK (temperature_status IN ('passed', 'failed')),
    -- pH Level
    ph_level_value TEXT NOT NULL,
    ph_level_standard TEXT NOT NULL,
    ph_level_status TEXT NOT NULL CHECK (ph_level_status IN ('passed', 'failed')),
    -- Moisture Content
    moisture_content_value TEXT NOT NULL,
    moisture_content_standard TEXT NOT NULL,
    moisture_content_status TEXT NOT NULL CHECK (moisture_content_status IN ('passed', 'failed')),
    -- Fat Content
    fat_content_value TEXT NOT NULL,
    fat_content_standard TEXT NOT NULL,
    fat_content_status TEXT NOT NULL CHECK (fat_content_status IN ('passed', 'failed')),
    -- Protein Content
    protein_content_value TEXT NOT NULL,
    protein_content_standard TEXT NOT NULL,
    protein_content_status TEXT NOT NULL CHECK (protein_content_status IN ('passed', 'failed')),
    -- Salt Content
    salt_content_value TEXT NOT NULL,
    salt_content_standard TEXT NOT NULL,
    salt_content_status TEXT NOT NULL CHECK (salt_content_status IN ('passed', 'failed')),
    -- Additional fields
    notes TEXT,
    checked_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE quality_checks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view quality checks"
    ON quality_checks FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can insert quality checks"
    ON quality_checks FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = checked_by);

CREATE POLICY "Users can update their own quality checks"
    ON quality_checks FOR UPDATE
    TO authenticated
    USING (auth.uid() = checked_by)
    WITH CHECK (auth.uid() = checked_by);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_quality_checks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_quality_checks_timestamp
    BEFORE UPDATE ON quality_checks
    FOR EACH ROW
    EXECUTE FUNCTION update_quality_checks_updated_at();
