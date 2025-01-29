-- First, drop ALL possible constraints
DO $$ 
BEGIN
    -- Drop constraints if they exist
    BEGIN
        ALTER TABLE public.milk_tank_offloads DROP CONSTRAINT IF EXISTS chk_tank_offloads_quality_check;
    EXCEPTION WHEN OTHERS THEN 
        NULL;
    END;
    
    BEGIN
        ALTER TABLE public.milk_tank_offloads DROP CONSTRAINT IF EXISTS valid_quality_check;
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;
    
    BEGIN
        ALTER TABLE public.milk_tank_offloads DROP CONSTRAINT IF EXISTS milk_tank_offloads_quality_check;
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;
END $$;

-- Handle NULL values first
UPDATE public.milk_tank_offloads 
SET quality_check = 'Grade A'
WHERE quality_check IS NULL;

-- Update existing values to match new format
UPDATE public.milk_tank_offloads
SET quality_check = 
    CASE 
        WHEN quality_check = 'Pass' THEN 'Grade A'
        WHEN quality_check = 'Fail' THEN 'Rejected'
        WHEN quality_check = 'Pending' THEN 'Grade B'
        WHEN quality_check NOT IN ('Grade A', 'Grade B', 'Grade C', 'Rejected') THEN 'Grade A'
        ELSE quality_check
    END;

-- Set the column to NOT NULL before adding constraint
ALTER TABLE public.milk_tank_offloads 
ALTER COLUMN quality_check SET NOT NULL;

-- Add new constraint
ALTER TABLE public.milk_tank_offloads
ADD CONSTRAINT milk_tank_offloads_quality_check 
CHECK (quality_check IN ('Grade A', 'Grade B', 'Grade C', 'Rejected'));

-- Set default value
ALTER TABLE public.milk_tank_offloads
ALTER COLUMN quality_check SET DEFAULT 'Grade A';