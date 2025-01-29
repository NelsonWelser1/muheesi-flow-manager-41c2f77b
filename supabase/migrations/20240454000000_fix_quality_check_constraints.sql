-- Drop the old constraint if it exists
ALTER TABLE public.milk_tank_offloads
DROP CONSTRAINT IF EXISTS chk_tank_offloads_quality_check;

-- Drop the other constraint if it exists
ALTER TABLE public.milk_tank_offloads
DROP CONSTRAINT IF EXISTS valid_quality_check;

-- Add the new constraint
ALTER TABLE public.milk_tank_offloads
ADD CONSTRAINT milk_tank_offloads_quality_check 
CHECK (quality_check IN ('Grade A', 'Grade B', 'Grade C', 'Rejected'));

-- Update any existing records to use valid values
UPDATE public.milk_tank_offloads
SET quality_check = 'Grade A'
WHERE quality_check NOT IN ('Grade A', 'Grade B', 'Grade C', 'Rejected');

-- Set default value
ALTER TABLE public.milk_tank_offloads
ALTER COLUMN quality_check SET DEFAULT 'Grade A';