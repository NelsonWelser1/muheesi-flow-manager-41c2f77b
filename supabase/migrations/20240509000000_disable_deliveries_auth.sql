
-- Temporarily disable authentication requirements for the logistics_deliveries table
-- This allows operations without requiring authenticated users

-- First, drop existing RLS policies for the table
DROP POLICY IF EXISTS "Allow all access to logistics_deliveries" ON public.logistics_deliveries;
DROP POLICY IF EXISTS "Users can view their organization's deliveries" ON public.logistics_deliveries;
DROP POLICY IF EXISTS "Users can insert deliveries" ON public.logistics_deliveries;
DROP POLICY IF EXISTS "Users can update their deliveries" ON public.logistics_deliveries;
DROP POLICY IF EXISTS "Users can delete their deliveries" ON public.logistics_deliveries;

-- Create a new policy that allows full access without authentication
CREATE POLICY "Temporary unrestricted access to logistics_deliveries" 
ON public.logistics_deliveries
FOR ALL 
TO PUBLIC
USING (true)
WITH CHECK (true);

-- Make sure RLS is still enabled (but with our new permissive policy)
ALTER TABLE public.logistics_deliveries ENABLE ROW LEVEL SECURITY;

-- Grant table permissions to anon role for unauthenticated access
GRANT ALL ON public.logistics_deliveries TO anon;
GRANT ALL ON public.logistics_deliveries TO authenticated;
GRANT ALL ON public.logistics_deliveries TO service_role;

-- Also modify the table to make operator_id optional since we won't have authenticated users
ALTER TABLE public.logistics_deliveries ALTER COLUMN operator_id DROP NOT NULL;

-- Add comment to remind about re-enabling authentication later
COMMENT ON TABLE public.logistics_deliveries IS 'Deliveries table with temporarily disabled authentication. Remember to enable proper authentication policies before production use.';
