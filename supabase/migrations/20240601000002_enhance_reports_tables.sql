
-- Add additional columns to maintenance_reports for better organization
ALTER TABLE maintenance_reports
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS tags TEXT[],
ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'medium',
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS related_section TEXT;

-- Create an index for the new columns
CREATE INDEX IF NOT EXISTS idx_maintenance_reports_category ON maintenance_reports(category);
CREATE INDEX IF NOT EXISTS idx_maintenance_reports_status ON maintenance_reports(status);
CREATE INDEX IF NOT EXISTS idx_maintenance_reports_priority ON maintenance_reports(priority);
CREATE INDEX IF NOT EXISTS idx_maintenance_reports_related_section ON maintenance_reports(related_section);

-- Create views for easy filtering
CREATE OR REPLACE VIEW high_priority_reports AS
SELECT * FROM maintenance_reports
WHERE priority = 'high'
ORDER BY created_at DESC;

CREATE OR REPLACE VIEW dairy_section_reports AS
SELECT * FROM maintenance_reports
WHERE related_section = 'dairy'
ORDER BY created_at DESC;

-- Add report read status tracking
CREATE TABLE IF NOT EXISTS report_read_status (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID REFERENCES maintenance_reports(id),
    user_id UUID REFERENCES auth.users(id),
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for report_read_status
CREATE INDEX IF NOT EXISTS idx_report_read_status_report_id ON report_read_status(report_id);
CREATE INDEX IF NOT EXISTS idx_report_read_status_user_id ON report_read_status(user_id);
CREATE INDEX IF NOT EXISTS idx_report_read_status_is_read ON report_read_status(is_read);

-- Enable RLS
ALTER TABLE report_read_status ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON report_read_status
    FOR SELECT
    USING (true);

CREATE POLICY "Enable insert for authenticated users" ON report_read_status
    FOR INSERT
    WITH CHECK (true);
    
CREATE POLICY "Enable update for authenticated users" ON report_read_status
    FOR UPDATE
    USING (true)
    WITH CHECK (true);
