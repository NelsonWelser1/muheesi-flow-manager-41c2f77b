
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create association_certifications table
CREATE TABLE IF NOT EXISTS association_certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    issuer VARCHAR(255) NOT NULL,
    status VARCHAR(50) CHECK (status IN ('valid', 'expired', 'expiring-soon', 'in-process')) NOT NULL,
    issue_date DATE,
    expiry_date DATE,
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    notes TEXT,
    requirements JSONB DEFAULT '[]'::jsonb NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_association_certifications_status ON association_certifications(status);
CREATE INDEX idx_association_certifications_created_at ON association_certifications(created_at);

-- Enable Row Level Security but allow public access temporarily (no authentication required)
ALTER TABLE association_certifications ENABLE ROW LEVEL SECURITY;

-- Create policy that allows all operations for everyone (temporarily disable authentication)
CREATE POLICY "Allow all operations for everyone" 
    ON association_certifications 
    FOR ALL 
    USING (true)
    WITH CHECK (true);

-- Add trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_certifications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_certifications_timestamp
BEFORE UPDATE ON association_certifications
FOR EACH ROW
EXECUTE FUNCTION update_certifications_updated_at();
