
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create maintenance_reports table if it doesn't exist
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
    user_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create dairy_notifications table if it doesn't exist
CREATE TABLE IF NOT EXISTS dairy_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_id TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    priority TEXT DEFAULT 'normal',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create dairy_sections table if it doesn't exist
CREATE TABLE IF NOT EXISTS dairy_sections (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    color TEXT,
    priority INTEGER DEFAULT 0,
    metrics JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create report_downloads table if it doesn't exist
CREATE TABLE IF NOT EXISTS report_downloads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_type TEXT NOT NULL,
    user_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create a function to calculate production growth
CREATE OR REPLACE FUNCTION calculate_production_growth()
RETURNS NUMERIC AS $$
DECLARE
    current_month_total NUMERIC;
    previous_month_total NUMERIC;
    growth_percentage NUMERIC;
BEGIN
    -- Get current month's production total
    SELECT COALESCE(SUM(raw_material_used), 0)
    INTO current_month_total
    FROM production_data
    WHERE created_at >= date_trunc('month', CURRENT_DATE)
    AND created_at < date_trunc('month', CURRENT_DATE) + interval '1 month';

    -- Get previous month's production total
    SELECT COALESCE(SUM(raw_material_used), 0)
    INTO previous_month_total
    FROM production_data
    WHERE created_at >= date_trunc('month', CURRENT_DATE) - interval '1 month'
    AND created_at < date_trunc('month', CURRENT_DATE);

    -- Calculate growth percentage
    IF previous_month_total = 0 THEN
        growth_percentage := 0; -- Avoid division by zero
    ELSE
        growth_percentage := ((current_month_total - previous_month_total) / previous_month_total) * 100;
    END IF;

    RETURN growth_percentage;
END;
$$ LANGUAGE plpgsql;

-- Add RLS policies
ALTER TABLE maintenance_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE dairy_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE dairy_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_downloads ENABLE ROW LEVEL SECURITY;

-- Check if policy exists before creating
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'maintenance_reports' AND policyname = 'Allow public access on maintenance_reports'
    ) THEN
        CREATE POLICY "Allow public access on maintenance_reports"
            ON maintenance_reports FOR ALL
            USING (true)
            WITH CHECK (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'dairy_notifications' AND policyname = 'Allow public access on dairy_notifications'
    ) THEN
        CREATE POLICY "Allow public access on dairy_notifications"
            ON dairy_notifications FOR ALL
            USING (true)
            WITH CHECK (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'dairy_sections' AND policyname = 'Allow public access on dairy_sections'
    ) THEN
        CREATE POLICY "Allow public access on dairy_sections"
            ON dairy_sections FOR ALL
            USING (true)
            WITH CHECK (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'report_downloads' AND policyname = 'Allow public access on report_downloads'
    ) THEN
        CREATE POLICY "Allow public access on report_downloads"
            ON report_downloads FOR ALL
            USING (true)
            WITH CHECK (true);
    END IF;
END $$;

-- Insert sample data for dairy sections if table is empty
INSERT INTO dairy_sections (id, title, description, icon, color, priority)
SELECT * FROM (
    VALUES 
    ('production', 'Production', 'Manage dairy production lines and schedules', 'Factory', 'bg-blue-500', 1),
    ('inventory', 'Inventory', 'Track raw materials and finished products', 'Package', 'bg-green-500', 2),
    ('quality', 'Quality Control', 'Monitor product quality and testing', 'CheckCircle', 'bg-amber-500', 3),
    ('cold-room', 'Cold Room', 'Manage cold storage and refrigeration', 'Snowflake', 'bg-cyan-500', 4),
    ('maintenance', 'Maintenance', 'Schedule and track equipment maintenance', 'Wrench', 'bg-orange-500', 5),
    ('logistics', 'Logistics', 'Manage transportation and distribution', 'Truck', 'bg-purple-500', 6),
    ('personnel', 'Personnel', 'Manage staff and scheduling', 'Users', 'bg-indigo-500', 7),
    ('reports', 'Reports', 'Generate and view analytics reports', 'BarChart', 'bg-rose-500', 8),
    ('sales', 'Sales & Marketing', 'Track sales performance and campaigns', 'DollarSign', 'bg-emerald-500', 9)
) AS t(id, title, description, icon, color, priority)
WHERE NOT EXISTS (SELECT 1 FROM dairy_sections LIMIT 1);

-- Insert sample notifications if table is empty
INSERT INTO dairy_notifications (section_id, title, message, priority)
SELECT * FROM (
    VALUES 
    ('production', 'Production Schedule Updated', 'The production schedule for this week has been updated', 'normal'),
    ('inventory', 'Low Raw Material Alert', 'Milk powder inventory is below minimum threshold', 'high'),
    ('quality', 'Quality Test Results', 'New batch quality test results are available', 'normal'),
    ('maintenance', 'Equipment Maintenance Due', 'Pasteurizer #2 is due for scheduled maintenance', 'high')
) AS t(section_id, title, message, priority)
WHERE NOT EXISTS (SELECT 1 FROM dairy_notifications LIMIT 1);
