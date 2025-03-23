
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create farm_information table with all required form fields
CREATE TABLE IF NOT EXISTS farm_information (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    manager_name TEXT NOT NULL,
    supervisor_name TEXT NOT NULL,
    farm_name TEXT NOT NULL,
    coffee_type TEXT NOT NULL,
    farm_size DECIMAL(10,2) NOT NULL CHECK (farm_size > 0),
    daily_production DECIMAL(10,2),
    weekly_production DECIMAL(10,2),
    monthly_production DECIMAL(10,2),
    quarterly_production DECIMAL(10,2),
    annual_production DECIMAL(10,2),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on farm_name for better query performance
CREATE INDEX idx_farm_information_farm_name ON farm_information(farm_name);

-- Enable Row Level Security but allow public access temporarily (no authentication required)
ALTER TABLE farm_information ENABLE ROW LEVEL SECURITY;

-- Create policy that allows all operations for everyone (temporarily disable authentication)
CREATE POLICY "Allow all operations for everyone" 
    ON farm_information 
    FOR ALL 
    USING (true)
    WITH CHECK (true);

-- Add trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_farm_information_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_farm_information_timestamp
BEFORE UPDATE ON farm_information
FOR EACH ROW
EXECUTE FUNCTION update_farm_information_updated_at();
