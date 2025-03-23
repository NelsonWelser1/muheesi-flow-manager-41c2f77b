
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create planting_harvesting_schedule table
CREATE TABLE IF NOT EXISTS planting_harvesting_schedule (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID REFERENCES farm_information(id),
    farm_name TEXT NOT NULL,
    activity_type TEXT NOT NULL CHECK (activity_type IN ('planting', 'harvesting')),
    scheduled_date DATE NOT NULL,
    expected_completion_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on farm_id for better query performance
CREATE INDEX idx_planting_harvesting_schedule_farm_id ON planting_harvesting_schedule(farm_id);

-- Create an index on activity_type for filtering
CREATE INDEX idx_planting_harvesting_schedule_activity_type ON planting_harvesting_schedule(activity_type);

-- Enable Row Level Security but allow public access temporarily (no authentication required)
ALTER TABLE planting_harvesting_schedule ENABLE ROW LEVEL SECURITY;

-- Create policy that allows all operations for everyone (temporarily disable authentication)
CREATE POLICY "Allow all operations for everyone" 
    ON planting_harvesting_schedule 
    FOR ALL 
    USING (true)
    WITH CHECK (true);

-- Add trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_planting_harvesting_schedule_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_planting_harvesting_schedule_timestamp
BEFORE UPDATE ON planting_harvesting_schedule
FOR EACH ROW
EXECUTE FUNCTION update_planting_harvesting_schedule_updated_at();
