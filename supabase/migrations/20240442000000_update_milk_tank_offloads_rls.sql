-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.milk_tank_offloads;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON public.milk_tank_offloads;
DROP POLICY IF EXISTS "Enable full access for authenticated users" ON public.milk_tank_offloads;

-- Create more permissive policy for all operations
CREATE POLICY "Enable full access for all users"
ON public.milk_tank_offloads
FOR ALL 
USING (true)
WITH CHECK (true);

-- Ensure RLS is enabled but with permissive policy
ALTER TABLE public.milk_tank_offloads ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions to public role for testing
GRANT ALL ON public.milk_tank_offloads TO anon;
GRANT ALL ON public.milk_tank_offloads TO authenticated;
GRANT ALL ON public.milk_tank_offloads TO service_role;

-- No need to grant sequence since we use UUID