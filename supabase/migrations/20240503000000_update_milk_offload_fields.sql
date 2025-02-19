
-- Add new columns to milk_tank_offloads table
ALTER TABLE public.milk_tank_offloads
ADD COLUMN IF NOT EXISTS fat_percentage DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS protein_percentage DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS total_plate_count INTEGER,
ADD COLUMN IF NOT EXISTS acidity DECIMAL(5,2);

-- Add constraints
ALTER TABLE public.milk_tank_offloads
ADD CONSTRAINT chk_fat_percentage CHECK (fat_percentage >= 0 AND fat_percentage <= 100),
ADD CONSTRAINT chk_protein_percentage CHECK (protein_percentage >= 0 AND protein_percentage <= 100),
ADD CONSTRAINT chk_total_plate_count CHECK (total_plate_count >= 0),
ADD CONSTRAINT chk_acidity CHECK (acidity >= 0 AND acidity <= 14);

-- Create indexes for the new columns
CREATE INDEX IF NOT EXISTS idx_milk_tank_offloads_quality ON public.milk_tank_offloads(quality_check);
CREATE INDEX IF NOT EXISTS idx_milk_tank_offloads_fat ON public.milk_tank_offloads(fat_percentage);
CREATE INDEX IF NOT EXISTS idx_milk_tank_offloads_protein ON public.milk_tank_offloads(protein_percentage);
