-- First, drop existing constraints
ALTER TABLE public.milk_tank_offloads
DROP CONSTRAINT IF EXISTS chk_tank_offloads_quality_check;

ALTER TABLE public.milk_tank_offloads
DROP CONSTRAINT IF EXISTS valid_quality_check;

ALTER TABLE public.milk_tank_offloads
DROP CONSTRAINT IF EXISTS milk_tank_offloads_quality_check;

-- Update existing records to use valid values
UPDATE public.milk_tank_offloads
SET quality_check = 
  CASE 
    WHEN quality_check = 'Pass' THEN 'Grade A'
    WHEN quality_check = 'Fail' THEN 'Rejected'
    WHEN quality_check = 'Pending' THEN 'Grade B'
    ELSE 'Grade A'
  END;

-- Now add the new constraint
ALTER TABLE public.milk_tank_offloads
ADD CONSTRAINT milk_tank_offloads_quality_check 
CHECK (quality_check IN ('Grade A', 'Grade B', 'Grade C', 'Rejected'));

-- Set default value
ALTER TABLE public.milk_tank_offloads
ALTER COLUMN quality_check SET DEFAULT 'Grade A';