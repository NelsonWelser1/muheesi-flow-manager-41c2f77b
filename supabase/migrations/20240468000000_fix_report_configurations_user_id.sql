-- Add user_id column if it doesn't exist
ALTER TABLE report_configurations 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Drop existing policies
DROP POLICY IF EXISTS "Allow authenticated users full access" ON report_configurations;

-- Enable RLS
ALTER TABLE report_configurations ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Users can view their own reports"
ON report_configurations
FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can create reports"
ON report_configurations
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reports"
ON report_configurations
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Insert test data with NULL user_id to be viewable by all
INSERT INTO report_configurations (report_type, start_date, end_date, user_id)
VALUES 
  ('Daily Stock Summary', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '1 day', NULL),
  ('Weekly Inventory Report', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '7 days', NULL)
ON CONFLICT DO NOTHING;