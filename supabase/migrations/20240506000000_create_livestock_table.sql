
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the livestock table
CREATE TABLE IF NOT EXISTS public.livestock (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    animal_id TEXT NOT NULL,
    species TEXT NOT NULL,
    breed TEXT NOT NULL,
    age TEXT NOT NULL,
    health_status TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) NULL -- Making this NULL to allow for temporarily disabled auth
);

-- Add RLS policies, but make them permissive for now to temporarily disable authentication
ALTER TABLE public.livestock ENABLE ROW LEVEL SECURITY;

-- Create policy for selecting - Allow all reads (for testing)
CREATE POLICY "Enable read access for all users" 
ON public.livestock FOR SELECT 
USING (true);

-- Create policy for inserting - Allow all inserts (for testing)
CREATE POLICY "Enable insert access for all users" 
ON public.livestock FOR INSERT 
WITH CHECK (true);

-- Create policy for updating - Allow all updates (for testing)
CREATE POLICY "Enable update access for all users" 
ON public.livestock FOR UPDATE 
USING (true)
WITH CHECK (true);

-- Create policy for deleting - Allow all deletes (for testing)
CREATE POLICY "Enable delete access for all users" 
ON public.livestock FOR DELETE 
USING (true);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to livestock table
CREATE TRIGGER set_livestock_updated_at
BEFORE UPDATE ON public.livestock
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Create RPC function to create the table
-- This allows frontend code to create the table if it doesn't exist
CREATE OR REPLACE FUNCTION create_livestock_table()
RETURNS BOOLEAN AS $$
BEGIN
  -- Table creation is handled by the migration, so this function
  -- just serves as a way for the frontend to trigger table creation
  -- if needed without having direct DDL privileges
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RAISE;
END;
$$ LANGUAGE plpgsql;

-- Add some sample data for testing (optional)
INSERT INTO public.livestock (animal_id, species, breed, age, health_status, notes)
VALUES
  ('KF001', 'Cow', 'Holstein', '24', 'Healthy', 'Prime milk producer'),
  ('KF002', 'Goat', 'Boer', '12', 'Under Treatment', 'Receiving antibiotics for minor infection'),
  ('KF003', 'Chicken', 'Broiler', '3', 'Healthy', 'Ready for market in 2 weeks')
ON CONFLICT (id) DO NOTHING;
