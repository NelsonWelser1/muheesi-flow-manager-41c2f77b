-- Add quality_check column to milk_reception table
ALTER TABLE public.milk_reception 
ADD COLUMN IF NOT EXISTS quality_check TEXT DEFAULT 'Pass';

-- Add quality_check column to milk_tank_offloads table if it doesn't exist
ALTER TABLE public.milk_tank_offloads 
ADD COLUMN IF NOT EXISTS quality_check TEXT DEFAULT 'Pass';

-- Create an index for better query performance
CREATE INDEX IF NOT EXISTS idx_milk_reception_quality_check 
ON public.milk_reception(quality_check);

CREATE INDEX IF NOT EXISTS idx_milk_tank_offloads_quality_check 
ON public.milk_tank_offloads(quality_check);

-- Add constraint to limit possible values
ALTER TABLE public.milk_reception
ADD CONSTRAINT chk_quality_check 
CHECK (quality_check IN ('Pass', 'Fail', 'Pending'));

ALTER TABLE public.milk_tank_offloads
ADD CONSTRAINT chk_tank_offloads_quality_check 
CHECK (quality_check IN ('Pass', 'Fail', 'Pending'));