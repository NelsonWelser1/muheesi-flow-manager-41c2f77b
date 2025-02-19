
-- Ensure batch_id column exists in milk_tank_offloads
ALTER TABLE public.milk_tank_offloads
ADD COLUMN IF NOT EXISTS batch_id TEXT;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_milk_tank_offloads_batch_id 
ON public.milk_tank_offloads(batch_id);

-- Allow the column to be inserted through RLS policies
DROP POLICY IF EXISTS "Enable all operations for milk_tank_offloads" ON public.milk_tank_offloads;
CREATE POLICY "Enable all operations for milk_tank_offloads"
ON public.milk_tank_offloads
FOR ALL 
TO PUBLIC
USING (true)
WITH CHECK (true);

-- Grant necessary permissions
GRANT ALL ON public.milk_tank_offloads TO anon;
GRANT ALL ON public.milk_tank_offloads TO authenticated;
GRANT ALL ON public.milk_tank_offloads TO service_role;
