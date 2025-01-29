-- Rename tank_number to storage_tank in milk_tank_offloads table
ALTER TABLE public.milk_tank_offloads 
RENAME COLUMN tank_number TO storage_tank;

-- Add constraint to ensure valid tank names
ALTER TABLE public.milk_tank_offloads
DROP CONSTRAINT IF EXISTS chk_storage_tank;

ALTER TABLE public.milk_tank_offloads
ADD CONSTRAINT chk_storage_tank 
CHECK (storage_tank IN ('Tank A', 'Tank B'));

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_milk_tank_offloads_storage_tank 
ON public.milk_tank_offloads(storage_tank);