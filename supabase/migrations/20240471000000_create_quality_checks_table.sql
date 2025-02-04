-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create quality_checks table
CREATE TABLE IF NOT EXISTS quality_checks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id TEXT NOT NULL,
    parameter TEXT NOT NULL,
    actual_value TEXT NOT NULL,
    standard_value TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('passed', 'failed')),
    notes TEXT,
    checked_by UUID REFERENCES auth.users(id),
    checked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
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

-- Insert some standard parameters
INSERT INTO quality_checks (batch_id, parameter, actual_value, standard_value, status, notes, checked_by)
VALUES 
    ('BATCH-001', 'Temperature', '72.5°C', '72.0°C - 73.0°C', 'passed', 'Within acceptable range', NULL),
    ('BATCH-001', 'pH Level', '6.2', '6.0 - 6.4', 'passed', 'Optimal pH level', NULL)
ON CONFLICT DO NOTHING;