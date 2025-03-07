
-- Disable authentication requirements for all logistics tables
-- This allows operations without requiring authenticated users

-- First, handle the logistics_deliveries table (already done in previous migration)

-- Now handle the logistics_order_entries table
DROP POLICY IF EXISTS "Allow authenticated users" ON public.logistics_order_entries;
DROP POLICY IF EXISTS "Users can view their orders" ON public.logistics_order_entries;
DROP POLICY IF EXISTS "Users can insert orders" ON public.logistics_order_entries;
DROP POLICY IF EXISTS "Users can update their orders" ON public.logistics_order_entries;

-- Create a permissive policy for the logistics_order_entries table
CREATE POLICY "Temporary unrestricted access to logistics_order_entries" 
ON public.logistics_order_entries
FOR ALL 
TO PUBLIC
USING (true)
WITH CHECK (true);

-- Ensure RLS is still enabled
ALTER TABLE public.logistics_order_entries ENABLE ROW LEVEL SECURITY;

-- Grant table permissions to anon role for unauthenticated access
GRANT ALL ON public.logistics_order_entries TO anon;
GRANT ALL ON public.logistics_order_entries TO authenticated;
GRANT ALL ON public.logistics_order_entries TO service_role;

-- Make operator_id optional
ALTER TABLE public.logistics_order_entries ALTER COLUMN operator_id DROP NOT NULL;

-- Now handle the logistics_delivery_performance table
DROP POLICY IF EXISTS "Allow authenticated users" ON public.logistics_delivery_performance;
DROP POLICY IF EXISTS "Users can view performance" ON public.logistics_delivery_performance;
DROP POLICY IF EXISTS "Users can insert performance" ON public.logistics_delivery_performance;
DROP POLICY IF EXISTS "Users can update performance" ON public.logistics_delivery_performance;

-- Create a permissive policy for the logistics_delivery_performance table
CREATE POLICY "Temporary unrestricted access to logistics_delivery_performance" 
ON public.logistics_delivery_performance
FOR ALL 
TO PUBLIC
USING (true)
WITH CHECK (true);

-- Ensure RLS is still enabled
ALTER TABLE public.logistics_delivery_performance ENABLE ROW LEVEL SECURITY;

-- Grant table permissions to anon role for unauthenticated access
GRANT ALL ON public.logistics_delivery_performance TO anon;
GRANT ALL ON public.logistics_delivery_performance TO authenticated;
GRANT ALL ON public.logistics_delivery_performance TO service_role;

-- Make operator_id optional
ALTER TABLE public.logistics_delivery_performance ALTER COLUMN operator_id DROP NOT NULL;

-- Add comments to remind about re-enabling authentication later
COMMENT ON TABLE public.logistics_order_entries IS 'Order entries table with temporarily disabled authentication. Remember to enable proper authentication policies before production use.';
COMMENT ON TABLE public.logistics_delivery_performance IS 'Delivery performance table with temporarily disabled authentication. Remember to enable proper authentication policies before production use.';
