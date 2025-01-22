-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create cheese quality tests table
CREATE TABLE IF NOT EXISTS cheese_quality_tests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_number TEXT NOT NULL,
    cheese_type TEXT NOT NULL,
    ph_level FLOAT NOT NULL,
    moisture_content FLOAT NOT NULL,
    salt_content FLOAT NOT NULL,
    texture_score INTEGER NOT NULL,
    flavor_score INTEGER NOT NULL,
    notes TEXT,
    test_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create quality checklists table
CREATE TABLE IF NOT EXISTS quality_checklists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    checklist_items JSONB NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE NOT NULL,
    completed_by TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE cheese_quality_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE quality_checklists ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for authenticated users"
ON cheese_quality_tests FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable insert access for authenticated users"
ON cheese_quality_tests FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable read access for authenticated users"
ON quality_checklists FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable insert access for authenticated users"
ON quality_checklists FOR INSERT
TO authenticated
WITH CHECK (true);