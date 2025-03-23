
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create associations table
CREATE TABLE IF NOT EXISTS associations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    association_name TEXT NOT NULL,
    registration_number TEXT,
    association_type TEXT CHECK (association_type IN ('farmers', 'cooperative', 'union')),
    member_count INTEGER,
    total_farm_area NUMERIC,
    coffee_types TEXT CHECK (coffee_types IN ('arabica', 'robusta', 'both')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on association_name for better query performance
CREATE INDEX idx_associations_name ON associations(association_name);

-- Enable Row Level Security but allow public access temporarily (no authentication required)
ALTER TABLE associations ENABLE ROW LEVEL SECURITY;

-- Create policy that allows all operations for everyone (temporarily disable authentication)
CREATE POLICY "Allow all operations for everyone" 
    ON associations 
    FOR ALL 
    USING (true)
    WITH CHECK (true);

-- Add trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_associations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_associations_timestamp
BEFORE UPDATE ON associations
FOR EACH ROW
EXECUTE FUNCTION update_associations_updated_at();
