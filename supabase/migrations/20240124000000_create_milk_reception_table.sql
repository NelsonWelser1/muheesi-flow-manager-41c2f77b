-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create milk_reception_data table
CREATE TABLE IF NOT EXISTS public.milk_reception_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id TEXT NOT NULL,
    reception_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    supplier TEXT NOT NULL,
    milk_type TEXT NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    temperature DECIMAL(5,2) NOT NULL,
    fat_percentage DECIMAL(5,2) NOT NULL,
    protein_percentage DECIMAL(5,2) NOT NULL,
    total_plate_count INTEGER NOT NULL,
    acidity DECIMAL(5,2) NOT NULL,
    notes TEXT,
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE public.milk_reception_data ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for authenticated users"
ON public.milk_reception_data FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable insert access for authenticated users"
ON public.milk_reception_data FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX idx_milk_reception_batch_id ON public.milk_reception_data(batch_id);
CREATE INDEX idx_milk_reception_user_id ON public.milk_reception_data(user_id);
CREATE INDEX idx_milk_reception_created_at ON public.milk_reception_data(created_at DESC);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_milk_reception_data_updated_at
    BEFORE UPDATE ON public.milk_reception_data
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();