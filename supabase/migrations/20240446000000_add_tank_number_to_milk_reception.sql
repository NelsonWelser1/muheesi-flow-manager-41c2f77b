-- Add tank_number column to milk_reception table
ALTER TABLE IF EXISTS public.milk_reception
ADD COLUMN IF NOT EXISTS tank_number TEXT;

-- Update existing rows to have a default value if needed
UPDATE public.milk_reception 
SET tank_number = 'Tank A' 
WHERE tank_number IS NULL;

-- Add constraint to ensure tank_number is one of the allowed values
ALTER TABLE public.milk_reception
ADD CONSTRAINT check_tank_number 
CHECK (tank_number IN ('Tank A', 'Tank B'));

-- Create an index for better query performance
CREATE INDEX IF NOT EXISTS idx_milk_reception_tank_number 
ON public.milk_reception(tank_number);

-- Grant necessary permissions
GRANT ALL ON public.milk_reception TO anon;
GRANT ALL ON public.milk_reception TO authenticated;
GRANT ALL ON public.milk_reception TO service_role;