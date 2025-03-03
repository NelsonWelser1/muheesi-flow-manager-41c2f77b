
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
    user_id UUID REFERENCES auth.users(id)
);

-- Add RLS policies
ALTER TABLE public.livestock ENABLE ROW LEVEL SECURITY;

-- Create policy for selecting
CREATE POLICY "Enable read access for all authenticated users" 
ON public.livestock FOR SELECT 
TO authenticated 
USING (true);

-- Create policy for inserting
CREATE POLICY "Enable insert access for all authenticated users" 
ON public.livestock FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Create policy for updating
CREATE POLICY "Enable update access for all authenticated users" 
ON public.livestock FOR UPDATE 
TO authenticated 
USING (true)
WITH CHECK (true);

-- Create policy for deleting
CREATE POLICY "Enable delete access for all authenticated users" 
ON public.livestock FOR DELETE 
TO authenticated 
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
