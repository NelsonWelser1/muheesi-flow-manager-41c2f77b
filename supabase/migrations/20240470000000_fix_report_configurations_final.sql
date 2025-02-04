-- First drop any existing policies
DROP POLICY IF EXISTS "Enable full access for authenticated users" ON report_configurations;
DROP POLICY IF EXISTS "Users can view their own reports" ON report_configurations;
DROP POLICY IF EXISTS "Users can create reports" ON report_configurations;
DROP POLICY IF EXISTS "Users can update their own reports" ON report_configurations;

-- Make sure RLS is enabled
ALTER TABLE report_configurations ENABLE ROW LEVEL SECURITY;

-- Add user_id column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'report_configurations' 
        AND column_name = 'user_id'
    ) THEN
        ALTER TABLE report_configurations ADD COLUMN user_id UUID REFERENCES auth.users(id);
    END IF;
END $$;

-- Create select policy
CREATE POLICY "Users can view their own reports"
ON report_configurations
FOR SELECT
TO authenticated
USING (
    auth.uid() = user_id
    OR 
    user_id IS NULL
);

-- Create insert policy
CREATE POLICY "Users can create reports"
ON report_configurations
FOR INSERT
TO authenticated
WITH CHECK (
    auth.uid() = user_id
);

-- Create update policy
CREATE POLICY "Users can update their own reports"
ON report_configurations
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create delete policy
CREATE POLICY "Users can delete their own reports"
ON report_configurations
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Insert some test data that all users can view
INSERT INTO report_configurations (report_type, start_date, end_date, user_id)
VALUES 
    ('Daily Stock Summary', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '1 day', NULL),
    ('Weekly Inventory Report', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '7 days', NULL)
ON CONFLICT DO NOTHING;