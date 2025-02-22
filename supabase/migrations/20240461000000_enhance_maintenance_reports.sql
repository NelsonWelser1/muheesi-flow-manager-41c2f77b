
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create maintenance_reports table
CREATE TABLE IF NOT EXISTS maintenance_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    content TEXT NOT NULL,
    recipient_name TEXT NOT NULL,
    recipient_email TEXT NOT NULL,
    recipient_phone TEXT NOT NULL,
    send_via TEXT[] NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add RLS policies for maintenance_reports
ALTER TABLE maintenance_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read access on maintenance_reports"
    ON maintenance_reports FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated insert on maintenance_reports"
    ON maintenance_reports FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Add indexes
CREATE INDEX idx_maintenance_reports_date_range 
ON maintenance_reports(start_date, end_date);

-- Insert sample data
INSERT INTO maintenance_reports (
    title,
    type,
    content,
    recipient_name,
    recipient_email,
    recipient_phone,
    send_via,
    start_date,
    end_date
) VALUES 
    ('Monthly Maintenance Summary', 'Monthly Analysis', 'Sample monthly maintenance report content', 'John Doe', 'john@example.com', '+1234567890', ARRAY['email', 'system'], NOW() - INTERVAL '1 month', NOW()),
    ('Annual Equipment Review', 'Quality Control Report', 'Sample annual equipment review content', 'Jane Smith', 'jane@example.com', '+0987654321', ARRAY['email', 'sms'], NOW() - INTERVAL '1 year', NOW())
ON CONFLICT DO NOTHING;
