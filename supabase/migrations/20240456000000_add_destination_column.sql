-- Add destination column to milk_reception table
ALTER TABLE public.milk_reception 
ADD COLUMN IF NOT EXISTS destination TEXT;

-- Update existing policies to include the new column
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