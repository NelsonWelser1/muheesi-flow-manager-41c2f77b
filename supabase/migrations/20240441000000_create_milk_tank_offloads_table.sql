-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create milk_tank_offloads table
CREATE TABLE IF NOT EXISTS public.milk_tank_offloads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tank_number TEXT NOT NULL,
    volume_offloaded DECIMAL(10,2) NOT NULL,
    destination TEXT NOT NULL,
    temperature DECIMAL(5,2) NOT NULL,
    quality_check TEXT NOT NULL,
    notes TEXT,
    offload_date TIMESTAMP WITH TIME ZONE NOT NULL,
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE public.milk_tank_offloads ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for authenticated users"
ON public.milk_tank_offloads FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable insert access for authenticated users"
ON public.milk_tank_offloads FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create indexes
CREATE INDEX idx_milk_tank_offloads_tank_number ON public.milk_tank_offloads(tank_number);
CREATE INDEX idx_milk_tank_offloads_offload_date ON public.milk_tank_offloads(offload_date DESC);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_milk_tank_offloads_updated_at
    BEFORE UPDATE ON public.milk_tank_offloads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();