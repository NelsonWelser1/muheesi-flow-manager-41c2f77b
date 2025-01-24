-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create quality control table
CREATE TABLE IF NOT EXISTS quality_control (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id TEXT NOT NULL,
    parameter TEXT NOT NULL,
    value TEXT NOT NULL,
    standard_value TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('passed', 'failed')),
    checked_by TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create quality trends table
CREATE TABLE IF NOT EXISTS quality_trends (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    pass_rate FLOAT NOT NULL CHECK (pass_rate >= 0 AND pass_rate <= 100),
    average_score FLOAT CHECK (average_score >= 0 AND average_score <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for better query performance
CREATE INDEX idx_quality_control_batch_id ON quality_control(batch_id);
CREATE INDEX idx_quality_control_created_at ON quality_control(created_at);
CREATE INDEX idx_quality_trends_date ON quality_trends(date);

-- Enable Row Level Security (RLS)
ALTER TABLE quality_control ENABLE ROW LEVEL SECURITY;
ALTER TABLE quality_trends ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated access
CREATE POLICY "Allow authenticated read access on quality_control"
    ON quality_control FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated read access on quality_trends"
    ON quality_trends FOR SELECT
    TO authenticated
    USING (true);

-- Insert some initial data for testing
INSERT INTO quality_trends (date, pass_rate, average_score)
VALUES 
    (CURRENT_DATE, 85.5, 92.3),
    (CURRENT_DATE - INTERVAL '1 day', 87.2, 91.8),
    (CURRENT_DATE - INTERVAL '2 days', 86.8, 90.5);

INSERT INTO quality_control (batch_id, parameter, value, standard_value, status, checked_by)
VALUES 
    ('BATCH-001', 'Temperature', '72.5°C', '72.0°C - 73.0°C', 'passed', 'John Smith'),
    ('BATCH-001', 'pH Level', '6.2', '6.0 - 6.4', 'passed', 'John Smith'),
    ('BATCH-002', 'Moisture Content', '45%', '43% - 46%', 'passed', 'Jane Doe');