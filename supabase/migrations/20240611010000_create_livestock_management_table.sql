
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create livestock_management table
CREATE TABLE IF NOT EXISTS livestock_management (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    association_id UUID,
    livestock_type TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity >= 0),
    health_status TEXT,
    feeding_schedule TEXT,
    breeding_program TEXT,
    vaccination_date TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    status TEXT CHECK (status IN ('active', 'sold', 'deceased', 'transferred')) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_livestock_association_id ON livestock_management(association_id);
CREATE INDEX idx_livestock_status ON livestock_management(status);

-- Enable Row Level Security but allow public access temporarily (no authentication required)
ALTER TABLE livestock_management ENABLE ROW LEVEL SECURITY;

-- Create policy that allows all operations for everyone (temporarily disable authentication)
CREATE POLICY "Allow all operations for everyone" 
    ON livestock_management 
    FOR ALL 
    USING (true)
    WITH CHECK (true);

-- Add trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_livestock_management_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_livestock_management_timestamp
BEFORE UPDATE ON livestock_management
FOR EACH ROW
EXECUTE FUNCTION update_livestock_management_updated_at();
