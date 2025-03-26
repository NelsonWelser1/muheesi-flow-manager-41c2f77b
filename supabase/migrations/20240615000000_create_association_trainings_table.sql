
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create association_trainings table
CREATE TABLE IF NOT EXISTS association_trainings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    association_id UUID REFERENCES associations(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    location TEXT NOT NULL,
    trainer TEXT NOT NULL,
    max_members INTEGER NOT NULL,
    enrolled_members INTEGER DEFAULT 0,
    notes TEXT,
    status TEXT DEFAULT 'upcoming',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_association_trainings_association_id ON association_trainings(association_id);
CREATE INDEX idx_association_trainings_date ON association_trainings(date);
CREATE INDEX idx_association_trainings_category ON association_trainings(category);
CREATE INDEX idx_association_trainings_status ON association_trainings(status);

-- Enable Row Level Security but allow public access temporarily (no authentication required)
ALTER TABLE association_trainings ENABLE ROW LEVEL SECURITY;

-- Create policy that allows all operations for everyone (temporarily disable authentication)
CREATE POLICY "Allow all operations for everyone" 
    ON association_trainings 
    FOR ALL 
    USING (true)
    WITH CHECK (true);

-- Add trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_association_trainings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_association_trainings_timestamp
BEFORE UPDATE ON association_trainings
FOR EACH ROW
EXECUTE FUNCTION update_association_trainings_updated_at();
