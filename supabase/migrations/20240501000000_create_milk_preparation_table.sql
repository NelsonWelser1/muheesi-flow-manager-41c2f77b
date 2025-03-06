
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create milk_preparation table
CREATE TABLE IF NOT EXISTS public.yogurt_milk_preparation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id TEXT NOT NULL,
    production_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    operator_id UUID,
    -- Milk details
    milk_volume DECIMAL(10,2) NOT NULL,
    pre_standardization_fat DECIMAL(5,2) NOT NULL,
    target_fat DECIMAL(5,2) NOT NULL,
    -- Homogenization details
    homogenization_temperature DECIMAL(5,2),
    homogenization_pressure DECIMAL(8,2),
    homogenization_duration INTEGER,
    -- Additional info
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_yogurt_milk_preparation_batch_id ON public.yogurt_milk_preparation(batch_id);
CREATE INDEX idx_yogurt_milk_preparation_created_at ON public.yogurt_milk_preparation(created_at);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_yogurt_milk_preparation_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_yogurt_milk_preparation_updated_at
    BEFORE UPDATE ON public.yogurt_milk_preparation
    FOR EACH ROW
    EXECUTE FUNCTION update_yogurt_milk_preparation_updated_at();

-- Disable RLS for now as requested (no authentication required temporarily)
ALTER TABLE public.yogurt_milk_preparation DISABLE ROW LEVEL SECURITY;

-- Grant access to public
GRANT ALL ON public.yogurt_milk_preparation TO anon;
GRANT ALL ON public.yogurt_milk_preparation TO authenticated;
GRANT ALL ON public.yogurt_milk_preparation TO service_role;
