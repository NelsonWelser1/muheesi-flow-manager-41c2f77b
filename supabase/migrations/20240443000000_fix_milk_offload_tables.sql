-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.milk_tank_offloads;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON public.milk_tank_offloads;
DROP POLICY IF EXISTS "Enable full access for authenticated users" ON public.milk_tank_offloads;
DROP POLICY IF EXISTS "Enable full access for all users" ON public.milk_tank_offloads;

DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.milk_reception;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON public.milk_reception;
DROP POLICY IF EXISTS "Enable full access for all users" ON public.milk_reception;

-- Recreate milk_reception table with correct structure if it doesn't exist
CREATE TABLE IF NOT EXISTS public.milk_reception (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_name TEXT NOT NULL,
    milk_volume DECIMAL NOT NULL,
    temperature DECIMAL NOT NULL,
    fat_percentage DECIMAL DEFAULT 0,
    protein_percentage DECIMAL DEFAULT 0,
    total_plate_count INTEGER DEFAULT 0,
    acidity DECIMAL DEFAULT 0,
    notes TEXT,
    datetime TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    quality_check TEXT DEFAULT 'Pass',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Recreate milk_tank_offloads table with correct structure if it doesn't exist
CREATE TABLE IF NOT EXISTS public.milk_tank_offloads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tank_number TEXT NOT NULL,
    volume_offloaded DECIMAL NOT NULL,
    destination TEXT NOT NULL,
    temperature DECIMAL NOT NULL,
    quality_check TEXT DEFAULT 'Pass',
    notes TEXT,
    offload_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE public.milk_tank_offloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milk_reception ENABLE ROW LEVEL SECURITY;

-- Create new permissive policies for milk_tank_offloads
CREATE POLICY "Enable all operations for milk_tank_offloads"
ON public.milk_tank_offloads
FOR ALL 
TO PUBLIC
USING (true)
WITH CHECK (true);

-- Create new permissive policies for milk_reception
CREATE POLICY "Enable all operations for milk_reception"
ON public.milk_reception
FOR ALL 
TO PUBLIC
USING (true)
WITH CHECK (true);

-- Grant necessary permissions
GRANT ALL ON public.milk_tank_offloads TO anon;
GRANT ALL ON public.milk_tank_offloads TO authenticated;
GRANT ALL ON public.milk_tank_offloads TO service_role;

GRANT ALL ON public.milk_reception TO anon;
GRANT ALL ON public.milk_reception TO authenticated;
GRANT ALL ON public.milk_reception TO service_role;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_milk_tank_offloads_tank ON public.milk_tank_offloads(tank_number);
CREATE INDEX IF NOT EXISTS idx_milk_reception_datetime ON public.milk_reception(datetime);
CREATE INDEX IF NOT EXISTS idx_milk_reception_supplier ON public.milk_reception(supplier_name);