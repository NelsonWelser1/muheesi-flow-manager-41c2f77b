-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.quotes;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON public.quotes;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON public.quotes;
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON public.quotes;

-- Create new policies with proper user checks
CREATE POLICY "Enable read access for authenticated users" ON public.quotes
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Enable insert access for authenticated users" ON public.quotes
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Enable update access for authenticated users" ON public.quotes
    FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Enable delete access for authenticated users" ON public.quotes
    FOR DELETE USING (auth.uid() IS NOT NULL);

-- Add user_id column to track ownership
ALTER TABLE public.quotes 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Add trigger to automatically set user_id on insert
CREATE OR REPLACE FUNCTION public.set_user_id()
RETURNS TRIGGER AS $$
BEGIN
  NEW.user_id = auth.uid();
  RETURN NEW;
END;
$$ language plpgsql security definer;

DROP TRIGGER IF EXISTS set_quotes_user_id ON public.quotes;
CREATE TRIGGER set_quotes_user_id
  BEFORE INSERT ON public.quotes
  FOR EACH ROW
  EXECUTE FUNCTION public.set_user_id();