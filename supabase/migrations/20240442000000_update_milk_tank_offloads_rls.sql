-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.milk_tank_offloads;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON public.milk_tank_offloads;

-- Create more permissive policies
CREATE POLICY "Enable full access for authenticated users"
ON public.milk_tank_offloads
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Ensure RLS is enabled
ALTER TABLE public.milk_tank_offloads ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT ALL ON public.milk_tank_offloads TO authenticated;
GRANT USAGE ON SEQUENCE milk_tank_offloads_id_seq TO authenticated;