
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create association_operations table
CREATE TABLE IF NOT EXISTS association_operations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    association_id UUID REFERENCES associations(id) ON DELETE CASCADE,
    next_meeting_date TIMESTAMP WITH TIME ZONE,
    training_schedule TIMESTAMP WITH TIME ZONE,
    collective_resources TEXT,
    shared_equipment TEXT,
    status TEXT CHECK (status IN ('scheduled', 'completed', 'cancelled', 'postponed')) DEFAULT 'scheduled',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_association_operations_association_id ON association_operations(association_id);
CREATE INDEX idx_association_operations_status ON association_operations(status);

-- Enable Row Level Security but allow public access temporarily (no authentication required)
ALTER TABLE association_operations ENABLE ROW LEVEL SECURITY;

-- Create policy that allows all operations for everyone (temporarily disable authentication)
CREATE POLICY "Allow all operations for everyone" 
    ON association_operations 
    FOR ALL 
    USING (true)
    WITH CHECK (true);

-- Add trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_association_operations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_association_operations_timestamp
BEFORE UPDATE ON association_operations
FOR EACH ROW
EXECUTE FUNCTION update_association_operations_updated_at();

