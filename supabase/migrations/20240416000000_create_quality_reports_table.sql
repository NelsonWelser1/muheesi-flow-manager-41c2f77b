-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create quality reports table
CREATE TABLE IF NOT EXISTS quality_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_number TEXT NOT NULL,
    cheese_type TEXT NOT NULL,
    ph_level FLOAT NOT NULL,
    moisture_content FLOAT NOT NULL,
    salt_content FLOAT NOT NULL,
    texture_score INTEGER NOT NULL,
    flavor_score INTEGER NOT NULL,
    report_type TEXT NOT NULL,
    recipient_level TEXT NOT NULL,
    notes TEXT,
    test_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_quality_reports_batch ON quality_reports(batch_number);
CREATE INDEX IF NOT EXISTS idx_quality_reports_date ON quality_reports(test_date);

-- Enable RLS
ALTER TABLE quality_reports ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Allow authenticated read access" ON quality_reports
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated insert" ON quality_reports
    FOR INSERT TO authenticated WITH CHECK (true);