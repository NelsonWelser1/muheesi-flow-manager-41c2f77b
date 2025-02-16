
-- Add destination column to milk_reception if it doesn't exist
ALTER TABLE public.milk_reception
ADD COLUMN IF NOT EXISTS destination TEXT;

-- Add destination column to milk_tank_offloads if it doesn't exist
ALTER TABLE public.milk_tank_offloads
ADD COLUMN IF NOT EXISTS destination TEXT;

-- Update RLS policies to include the new column
DROP POLICY IF EXISTS "Enable all operations for milk_reception" ON public.milk_reception;
CREATE POLICY "Enable all operations for milk_reception"
ON public.milk_reception FOR ALL 
TO PUBLIC
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all operations for milk_tank_offloads" ON public.milk_tank_offloads;
CREATE POLICY "Enable all operations for milk_tank_offloads"
ON public.milk_tank_offloads FOR ALL 
TO PUBLIC
USING (true)
WITH CHECK (true);

-- Grant necessary permissions
GRANT ALL ON public.milk_reception TO authenticated;
GRANT ALL ON public.milk_reception TO anon;
GRANT ALL ON public.milk_reception TO service_role;

GRANT ALL ON public.milk_tank_offloads TO authenticated;
GRANT ALL ON public.milk_tank_offloads TO anon;
GRANT ALL ON public.milk_tank_offloads TO service_role;
