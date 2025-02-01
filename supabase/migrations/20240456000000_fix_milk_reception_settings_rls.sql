-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow read access to everyone" ON public.milk_reception_settings;
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON public.milk_reception_settings;
DROP POLICY IF EXISTS "Allow update for authenticated users" ON public.milk_reception_settings;

-- Enable RLS
ALTER TABLE public.milk_reception_settings ENABLE ROW LEVEL SECURITY;

-- Create new policies with proper authentication checks
CREATE POLICY "Enable read access for authenticated users"
ON public.milk_reception_settings FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable insert access for authenticated users"
ON public.milk_reception_settings FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users"
ON public.milk_reception_settings FOR UPDATE
TO authenticated
USING (true);

-- Grant necessary permissions
GRANT ALL ON public.milk_reception_settings TO authenticated;
GRANT USAGE ON SEQUENCE milk_reception_settings_id_seq TO authenticated;