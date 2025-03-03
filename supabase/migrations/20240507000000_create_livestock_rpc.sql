
-- Create a function to create the livestock table if it doesn't exist
CREATE OR REPLACE FUNCTION public.create_livestock_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Create the livestock table if it doesn't exist
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

  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON public.livestock;
  DROP POLICY IF EXISTS "Enable insert access for all authenticated users" ON public.livestock;
  DROP POLICY IF EXISTS "Enable update access for all authenticated users" ON public.livestock;
  DROP POLICY IF EXISTS "Enable delete access for all authenticated users" ON public.livestock;

  -- Create new policies
  CREATE POLICY "Enable read access for all authenticated users" 
  ON public.livestock FOR SELECT 
  TO authenticated 
  USING (true);

  CREATE POLICY "Enable insert access for all authenticated users" 
  ON public.livestock FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

  CREATE POLICY "Enable update access for all authenticated users" 
  ON public.livestock FOR UPDATE 
  TO authenticated 
  USING (true)
  WITH CHECK (true);

  CREATE POLICY "Enable delete access for all authenticated users" 
  ON public.livestock FOR DELETE 
  TO authenticated 
  USING (true);

  -- Create trigger for updated_at if it doesn't exist
  DROP TRIGGER IF EXISTS set_livestock_updated_at ON public.livestock;
  
  CREATE TRIGGER set_livestock_updated_at
  BEFORE UPDATE ON public.livestock
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.create_livestock_table() TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_livestock_table() TO anon;
