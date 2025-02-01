-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop dependent tables first
DROP TABLE IF EXISTS public.milk_reception_audit_log CASCADE;
DROP TABLE IF EXISTS public.milk_tank_offloads CASCADE;
DROP TABLE IF EXISTS public.milk_reception CASCADE;

-- Create milk_reception table with all required fields
CREATE TABLE IF NOT EXISTS public.milk_reception (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_name TEXT NOT NULL,
    milk_volume DECIMAL(10,2) NOT NULL,
    temperature DECIMAL(5,2) NOT NULL,
    fat_percentage DECIMAL(5,2) NOT NULL,
    protein_percentage DECIMAL(5,2) NOT NULL,
    total_plate_count INTEGER NOT NULL,
    acidity DECIMAL(5,2) NOT NULL,
    notes TEXT,
    quality_score TEXT NOT NULL,
    tank_number TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create milk_tank_offloads table
CREATE TABLE IF NOT EXISTS public.milk_tank_offloads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    storage_tank TEXT NOT NULL,
    volume_offloaded DECIMAL(10,2) NOT NULL,
    destination TEXT NOT NULL,
    temperature DECIMAL(5,2) NOT NULL,
    quality_check TEXT DEFAULT 'Grade A',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create audit log table
CREATE TABLE IF NOT EXISTS public.milk_reception_audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    milk_reception_id UUID REFERENCES public.milk_reception(id),
    action TEXT NOT NULL,
    old_data JSONB,
    new_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE public.milk_reception ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milk_tank_offloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milk_reception_audit_log ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable all operations for milk_reception" ON public.milk_reception;
DROP POLICY IF EXISTS "Enable all operations for milk_tank_offloads" ON public.milk_tank_offloads;
DROP POLICY IF EXISTS "Enable all operations for milk_reception_audit_log" ON public.milk_reception_audit_log;

-- Create new policies
CREATE POLICY "Enable all operations for milk_reception"
ON public.milk_reception FOR ALL 
TO PUBLIC
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable all operations for milk_tank_offloads"
ON public.milk_tank_offloads FOR ALL 
TO PUBLIC
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable all operations for milk_reception_audit_log"
ON public.milk_reception_audit_log FOR ALL 
TO PUBLIC
USING (true)
WITH CHECK (true);

-- Add constraints
ALTER TABLE public.milk_reception
ADD CONSTRAINT chk_milk_reception_tank CHECK (tank_number IN ('Tank A', 'Tank B')),
ADD CONSTRAINT chk_milk_reception_quality_score CHECK (quality_score IN ('Grade A', 'Grade B', 'Grade C', 'Rejected'));

-- Create indexes for better performance
CREATE INDEX idx_milk_reception_supplier ON public.milk_reception(supplier_name);
CREATE INDEX idx_milk_reception_tank ON public.milk_reception(tank_number);
CREATE INDEX idx_milk_tank_offloads_tank ON public.milk_tank_offloads(storage_tank);
CREATE INDEX idx_milk_reception_audit_created_at ON public.milk_reception_audit_log(created_at);