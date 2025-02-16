
-- Drop all existing constraints first
ALTER TABLE public.milk_reception 
DROP CONSTRAINT IF EXISTS check_tank_number,
DROP CONSTRAINT IF EXISTS chk_milk_reception_tank,
DROP CONSTRAINT IF EXISTS chk_milk_reception_tank_number;

-- Add the updated constraint
ALTER TABLE public.milk_reception
ADD CONSTRAINT chk_milk_reception_tank 
CHECK (tank_number IN ('Tank A', 'Tank B', 'Direct-Processing'));

-- Drop all existing storage tank constraints
ALTER TABLE public.storage_tanks 
DROP CONSTRAINT IF EXISTS valid_tank_names,
DROP CONSTRAINT IF EXISTS check_tank_name,
DROP CONSTRAINT IF EXISTS valid_tank_names_check;

-- Add updated storage tank constraint
ALTER TABLE public.storage_tanks
ADD CONSTRAINT valid_tank_names 
CHECK (tank_name IN ('Tank A', 'Tank B', 'Direct-Processing'));

-- Grant necessary permissions
GRANT ALL ON public.milk_reception TO authenticated;
GRANT ALL ON public.milk_reception TO anon;
GRANT ALL ON public.milk_reception TO service_role;
