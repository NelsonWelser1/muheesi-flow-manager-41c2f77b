
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the association_members table
CREATE TABLE IF NOT EXISTS association_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    association_id UUID,
    full_name TEXT NOT NULL,
    location TEXT,
    phone TEXT,
    farm_size DECIMAL(10,2),
    coffee_type TEXT,
    experience INTEGER,
    photo_url TEXT,
    member_level TEXT DEFAULT 'bronze',
    status TEXT DEFAULT 'active',
    join_date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    last_delivery TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indices
CREATE INDEX IF NOT EXISTS idx_association_members_association_id ON association_members(association_id);
CREATE INDEX IF NOT EXISTS idx_association_members_status ON association_members(status);
CREATE INDEX IF NOT EXISTS idx_association_members_member_level ON association_members(member_level);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_association_members_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER update_association_members_updated_at
    BEFORE UPDATE ON association_members
    FOR EACH ROW
    EXECUTE FUNCTION update_association_members_updated_at();

-- Disable RLS for now since authentication is temporarily disabled
ALTER TABLE association_members DISABLE ROW LEVEL SECURITY;
