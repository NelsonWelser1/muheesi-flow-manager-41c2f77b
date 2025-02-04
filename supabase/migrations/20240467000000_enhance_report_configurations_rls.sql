-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON report_configurations;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON report_configurations;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON report_configurations;

-- Enable RLS
ALTER TABLE report_configurations ENABLE ROW LEVEL SECURITY;

-- Create comprehensive policies for authenticated users
CREATE POLICY "Allow authenticated users full access"
ON report_configurations
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Insert some initial data to test
INSERT INTO report_configurations (report_type, start_date, end_date)
VALUES 
  ('Daily Stock Summary', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '1 day'),
  ('Weekly Inventory Report', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '7 days')
ON CONFLICT DO NOTHING;