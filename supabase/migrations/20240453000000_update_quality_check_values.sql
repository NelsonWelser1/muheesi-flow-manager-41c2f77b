-- Update quality_check column to use new grade values
ALTER TABLE public.milk_tank_offloads
ALTER COLUMN quality_check TYPE TEXT;

-- Add check constraint for valid quality grades
ALTER TABLE public.milk_tank_offloads
DROP CONSTRAINT IF EXISTS valid_quality_check;

ALTER TABLE public.milk_tank_offloads
ADD CONSTRAINT valid_quality_check 
CHECK (quality_check IN ('Grade A', 'Grade B', 'Grade C', 'Rejected'));

-- Update existing records to use new grade values
UPDATE public.milk_tank_offloads
SET quality_check = 
  CASE 
    WHEN quality_check = 'Pass' THEN 'Grade A'
    WHEN quality_check = 'Fail' THEN 'Rejected'
    WHEN quality_check = 'Pending' THEN 'Grade B'
    ELSE 'Grade A'
  END;

-- Set default value
ALTER TABLE public.milk_tank_offloads
ALTER COLUMN quality_check SET DEFAULT 'Grade A';