
-- First drop the existing quality_checks table if it exists
DROP TABLE IF EXISTS quality_checks CASCADE;

-- Create a new quality_checks table with the exact structure needed
CREATE TABLE quality_checks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id TEXT NOT NULL,
    
    -- Temperature measurements
    temperature_actual NUMERIC NOT NULL,
    temperature_standard NUMERIC NOT NULL,
    temperature_status TEXT NOT NULL CHECK (temperature_status IN ('Passed', 'Failed')),
    
    -- pH Level measurements
    ph_level_actual NUMERIC NOT NULL,
    ph_level_standard NUMERIC NOT NULL,
    ph_level_status TEXT NOT NULL CHECK (ph_level_status IN ('Passed', 'Failed')),
    
    -- Moisture Content measurements
    moisture_actual NUMERIC NOT NULL,
    moisture_standard NUMERIC NOT NULL,
    moisture_status TEXT NOT NULL CHECK (moisture_status IN ('Passed', 'Failed')),
    
    -- Fat Content measurements
    fat_actual NUMERIC NOT NULL,
    fat_standard NUMERIC NOT NULL,
    fat_status TEXT NOT NULL CHECK (fat_status IN ('Passed', 'Failed')),
    
    -- Protein Content measurements
    protein_actual NUMERIC NOT NULL,
    protein_standard NUMERIC NOT NULL,
    protein_status TEXT NOT NULL CHECK (protein_status IN ('Passed', 'Failed')),
    
    -- Salt Content measurements
    salt_actual NUMERIC NOT NULL,
    salt_standard NUMERIC NOT NULL,
    salt_status TEXT NOT NULL CHECK (salt_status IN ('Passed', 'Failed')),
    
    -- Additional Information
    notes TEXT,
    checked_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_quality_checks_batch_id ON quality_checks(batch_id);
CREATE INDEX idx_quality_checks_created_at ON quality_checks(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE quality_checks ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (temporarily)
CREATE POLICY "Allow public access to quality checks"
    ON quality_checks
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Create trigger for updating updated_at timestamp
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

-- Add comment to table
COMMENT ON TABLE quality_checks IS 'Stores quality control measurements for cheese production batches';

-- Make checked_by column optional for now
ALTER TABLE quality_checks ALTER COLUMN checked_by DROP NOT NULL;
