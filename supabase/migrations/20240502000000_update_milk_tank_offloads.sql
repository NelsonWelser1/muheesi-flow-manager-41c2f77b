
-- Drop existing constraints if they exist
ALTER TABLE public.milk_tank_offloads 
DROP CONSTRAINT IF EXISTS chk_storage_tank;

-- Add or modify columns
ALTER TABLE public.milk_tank_offloads
ADD COLUMN IF NOT EXISTS batch_id TEXT,
ALTER COLUMN storage_tank SET NOT NULL,
ALTER COLUMN volume_offloaded SET NOT NULL,
ALTER COLUMN temperature SET NOT NULL,
ALTER COLUMN quality_check SET NOT NULL,
ALTER COLUMN destination SET NOT NULL;

-- Add constraints
ALTER TABLE public.milk_tank_offloads
ADD CONSTRAINT chk_storage_tank 
  CHECK (storage_tank IN ('Tank A', 'Tank B', 'Direct-Processing')),
ADD CONSTRAINT unique_batch_id 
  UNIQUE (batch_id);

-- Create index for batch_id
CREATE INDEX IF NOT EXISTS idx_milk_tank_offloads_batch_id 
ON public.milk_tank_offloads(batch_id);
