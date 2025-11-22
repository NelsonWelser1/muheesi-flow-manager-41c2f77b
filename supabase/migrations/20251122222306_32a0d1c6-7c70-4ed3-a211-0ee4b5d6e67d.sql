-- Enable RLS on dairy_section_reports and high_priority_reports tables

-- Enable RLS on dairy_section_reports
ALTER TABLE public.dairy_section_reports ENABLE ROW LEVEL SECURITY;

-- Create open access policies for dairy_section_reports
CREATE POLICY "Enable read access for all users" ON public.dairy_section_reports
  FOR SELECT
  USING (true);

CREATE POLICY "Enable insert access for all users" ON public.dairy_section_reports
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON public.dairy_section_reports
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable delete access for all users" ON public.dairy_section_reports
  FOR DELETE
  USING (true);

-- Enable RLS on high_priority_reports
ALTER TABLE public.high_priority_reports ENABLE ROW LEVEL SECURITY;

-- Create open access policies for high_priority_reports
CREATE POLICY "Enable read access for all users" ON public.high_priority_reports
  FOR SELECT
  USING (true);

CREATE POLICY "Enable insert access for all users" ON public.high_priority_reports
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON public.high_priority_reports
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable delete access for all users" ON public.high_priority_reports
  FOR DELETE
  USING (true);