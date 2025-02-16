
-- Drop the existing constraint
ALTER TABLE public.milk_reception 
DROP CONSTRAINT IF EXISTS check_tank_number;
DROP CONSTRAINT IF EXISTS chk_milk_reception_tank;

-- Add the updated constraint that includes Direct-Processing
ALTER TABLE public.milk_reception
ADD CONSTRAINT chk_milk_reception_tank 
CHECK (tank_number IN ('Tank A', 'Tank B', 'Direct-Processing'));

-- Update the storage tanks constraint if it exists
ALTER TABLE public.storage_tanks 
DROP CONSTRAINT IF EXISTS valid_tank_names;

ALTER TABLE public.storage_tanks
ADD CONSTRAINT valid_tank_names 
CHECK (tank_name IN ('Tank A', 'Tank B', 'Direct-Processing'));

-- Grant necessary permissions
GRANT ALL ON public.milk_reception TO authenticated;
GRANT ALL ON public.milk_reception TO anon;
GRANT ALL ON public.milk_reception TO service_role;
