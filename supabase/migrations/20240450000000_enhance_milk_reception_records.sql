-- Enhance milk_reception table with additional fields
ALTER TABLE public.milk_reception
ADD COLUMN IF NOT EXISTS destination TEXT,
ADD COLUMN IF NOT EXISTS entry_type TEXT DEFAULT 'reception' CHECK (entry_type IN ('reception', 'offload'));

-- Update existing records
UPDATE public.milk_reception
SET entry_type = CASE 
    WHEN supplier_name LIKE 'Offload from%' THEN 'offload'
    ELSE 'reception'
END
WHERE entry_type IS NULL;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_milk_reception_entry_type ON public.milk_reception(entry_type);
CREATE INDEX IF NOT EXISTS idx_milk_reception_destination ON public.milk_reception(destination);

-- Ensure all numeric fields have appropriate constraints
ALTER TABLE public.milk_reception
ADD CONSTRAINT chk_milk_volume CHECK (milk_volume IS NULL OR milk_volume >= -10000 AND milk_volume <= 10000),
ADD CONSTRAINT chk_temperature CHECK (temperature IS NULL OR temperature >= 0 AND temperature <= 100),
ADD CONSTRAINT chk_fat_percentage CHECK (fat_percentage IS NULL OR fat_percentage >= 0 AND fat_percentage <= 100),
ADD CONSTRAINT chk_protein_percentage CHECK (protein_percentage IS NULL OR protein_percentage >= 0 AND protein_percentage <= 100),
ADD CONSTRAINT chk_total_plate_count CHECK (total_plate_count IS NULL OR total_plate_count >= 0),
ADD CONSTRAINT chk_acidity CHECK (acidity IS NULL OR acidity >= 0 AND acidity <= 14);

-- Update RLS policies
DROP POLICY IF EXISTS "Enable all operations for milk_reception" ON public.milk_reception;
CREATE POLICY "Enable all operations for milk_reception"
ON public.milk_reception
FOR ALL 
TO PUBLIC
USING (true)
WITH CHECK (true);

-- Grant necessary permissions
GRANT ALL ON public.milk_reception TO anon;
GRANT ALL ON public.milk_reception TO authenticated;
GRANT ALL ON public.milk_reception TO service_role;