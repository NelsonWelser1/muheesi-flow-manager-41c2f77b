
-- Enhance milk_tank_offloads table with additional fields
ALTER TABLE public.milk_tank_offloads
ADD COLUMN IF NOT EXISTS supplier_name TEXT,
ADD COLUMN IF NOT EXISTS fat_percentage DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS protein_percentage DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS total_plate_count INTEGER,
ADD COLUMN IF NOT EXISTS acidity DECIMAL(5,2);

-- Only rename if tank_number exists and storage_tank doesn't
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'milk_tank_offloads'
        AND column_name = 'tank_number'
    ) AND NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'milk_tank_offloads'
        AND column_name = 'storage_tank'
    ) THEN
        ALTER TABLE public.milk_tank_offloads 
        RENAME COLUMN tank_number TO storage_tank;
    END IF;
END $$;

-- Add constraints
ALTER TABLE public.milk_tank_offloads
ADD CONSTRAINT chk_storage_tank CHECK (storage_tank IN ('Tank A', 'Tank B')),
ADD CONSTRAINT chk_fat_percentage CHECK (fat_percentage >= 0 AND fat_percentage <= 100),
ADD CONSTRAINT chk_protein_percentage CHECK (protein_percentage >= 0 AND protein_percentage <= 100),
ADD CONSTRAINT chk_acidity CHECK (acidity >= 0 AND acidity <= 14);

-- Create indexes for new columns
CREATE INDEX IF NOT EXISTS idx_milk_tank_offloads_supplier ON public.milk_tank_offloads(supplier_name);
CREATE INDEX IF NOT EXISTS idx_milk_tank_offloads_quality ON public.milk_tank_offloads(quality_check);

-- Update RLS policies
DROP POLICY IF EXISTS "Enable all operations for milk_tank_offloads" ON public.milk_tank_offloads;
CREATE POLICY "Enable all operations for milk_tank_offloads"
ON public.milk_tank_offloads
FOR ALL 
TO PUBLIC
USING (true)
WITH CHECK (true);
