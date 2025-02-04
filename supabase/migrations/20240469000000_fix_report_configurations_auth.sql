-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view their own reports" ON report_configurations;
DROP POLICY IF EXISTS "Users can create reports" ON report_configurations;
DROP POLICY IF EXISTS "Users can update their own reports" ON report_configurations;
DROP POLICY IF EXISTS "Allow authenticated users full access" ON report_configurations;

-- Enable RLS
ALTER TABLE report_configurations ENABLE ROW LEVEL SECURITY;

-- Create a single policy for authenticated users
CREATE POLICY "Enable full access for authenticated users"
ON report_configurations
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);