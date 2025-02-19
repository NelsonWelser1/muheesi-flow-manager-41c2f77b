
-- Add batch_id column to milk_reception table if it doesn't exist
ALTER TABLE public.milk_reception 
ADD COLUMN IF NOT EXISTS batch_id TEXT;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_milk_reception_batch_id 
ON public.milk_reception(batch_id);

-- Allow the column to be inserted through RLS policies
DROP POLICY IF EXISTS "Enable all operations for milk_reception" ON public.milk_reception;
CREATE POLICY "Enable all operations for milk_reception"
ON public.milk_reception
FOR ALL 
TO PUBLIC
USING (true)
WITH CHECK (true);

-- Grant necessary permissions
GRANT ALL ON public.milk_reception TO anon;
GRANT ALL ON public.milk_reception TO authenticated;
GRANT ALL ON public.milk_reception TO service_role;

-- Optional: Backfill existing records with generated batch IDs
UPDATE public.milk_reception
SET batch_id = 'LEGACY-' || id::text
WHERE batch_id IS NULL;
