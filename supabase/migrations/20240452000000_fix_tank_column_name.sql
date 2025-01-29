-- First check which column exists and handle accordingly
DO $$
BEGIN
    -- Check if tank_number exists
    IF EXISTS (SELECT 1 
               FROM information_schema.columns 
               WHERE table_name='milk_tank_offloads' 
               AND column_name='tank_number') THEN
        -- Rename tank_number to storage_tank if it exists
        ALTER TABLE public.milk_tank_offloads 
        RENAME COLUMN tank_number TO storage_tank;
    END IF;

    -- If neither column exists, add storage_tank
    IF NOT EXISTS (SELECT 1 
                  FROM information_schema.columns 
                  WHERE table_name='milk_tank_offloads' 
                  AND column_name='storage_tank') THEN
        ALTER TABLE public.milk_tank_offloads 
        ADD COLUMN storage_tank TEXT;
    END IF;
END$$;

-- Add constraint to ensure valid tank names
ALTER TABLE public.milk_tank_offloads
DROP CONSTRAINT IF EXISTS chk_storage_tank;

ALTER TABLE public.milk_tank_offloads
ADD CONSTRAINT chk_storage_tank 
CHECK (storage_tank IN ('Tank A', 'Tank B'));

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_milk_tank_offloads_storage_tank 
ON public.milk_tank_offloads(storage_tank);