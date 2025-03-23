
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create operations_form table
CREATE TABLE IF NOT EXISTS operations_form (
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
CREATE INDEX idx_operations_form_association_id ON operations_form(association_id);
CREATE INDEX idx_operations_form_status ON operations_form(status);

-- Enable Row Level Security but allow public access temporarily (no authentication required)
ALTER TABLE operations_form ENABLE ROW LEVEL SECURITY;

-- Create policy that allows all operations for everyone (temporarily disable authentication)
CREATE POLICY "Allow all operations for everyone" 
    ON operations_form 
    FOR ALL 
    USING (true)
    WITH CHECK (true);

-- Add trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_operations_form_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_operations_form_timestamp
BEFORE UPDATE ON operations_form
FOR EACH ROW
EXECUTE FUNCTION update_operations_form_updated_at();
