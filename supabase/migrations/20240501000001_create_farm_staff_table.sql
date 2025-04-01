
-- Create farm_staff table for storing staff member information
CREATE TABLE IF NOT EXISTS public.farm_staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'farm_worker',
  contact_number TEXT NOT NULL,
  email TEXT,
  start_date DATE,
  salary NUMERIC(12, 2),
  status TEXT NOT NULL DEFAULT 'active',
  address TEXT,
  notes TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create indexes for common query patterns
CREATE INDEX IF NOT EXISTS farm_staff_farm_id_idx ON public.farm_staff (farm_id);
CREATE INDEX IF NOT EXISTS farm_staff_role_idx ON public.farm_staff (role);
CREATE INDEX IF NOT EXISTS farm_staff_status_idx ON public.farm_staff (status);

-- Enable Row Level Security
ALTER TABLE public.farm_staff ENABLE ROW LEVEL SECURITY;

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION public.set_current_timestamp_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_farm_staff_updated_at
BEFORE UPDATE ON public.farm_staff
FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- Add RLS policies (temporarily allowing public access since authentication is disabled)
CREATE POLICY "Allow public read access to farm_staff" 
ON public.farm_staff 
FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to farm_staff" 
ON public.farm_staff 
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access to farm_staff" 
ON public.farm_staff 
FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow public delete access to farm_staff" 
ON public.farm_staff 
FOR DELETE USING (true);

-- Add comment to table
COMMENT ON TABLE public.farm_staff IS 'Stores information about farm staff members';
