
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create association_operations table
CREATE TABLE IF NOT EXISTS association_operations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    association_id UUID NOT NULL,
    next_meeting_date TIMESTAMP WITH TIME ZONE,
    training_schedule TIMESTAMP WITH TIME ZONE,
    collective_resources TEXT,
    shared_equipment TEXT,
    status TEXT NOT NULL DEFAULT 'scheduled',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_association_operations_association_id ON association_operations(association_id);
CREATE INDEX IF NOT EXISTS idx_association_operations_status ON association_operations(status);
CREATE INDEX IF NOT EXISTS idx_association_operations_created_at ON association_operations(created_at);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_operations_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER IF NOT EXISTS update_association_operations_updated_at
    BEFORE UPDATE ON association_operations
    FOR EACH ROW
    EXECUTE FUNCTION update_operations_updated_at_column();

-- Disable RLS for now since authentication is temporarily disabled
ALTER TABLE association_operations DISABLE ROW LEVEL SECURITY;
