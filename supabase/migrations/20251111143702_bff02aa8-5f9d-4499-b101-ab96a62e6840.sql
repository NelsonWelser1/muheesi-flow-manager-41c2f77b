-- Create milk_reception table
CREATE TABLE IF NOT EXISTS public.milk_reception (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  session TEXT NOT NULL CHECK (session IN ('morning', 'midday', 'evening')),
  supplier_name TEXT,
  volume NUMERIC NOT NULL CHECK (volume > 0),
  temperature NUMERIC,
  quality_grade TEXT,
  price_per_liter NUMERIC,
  total_amount NUMERIC,
  payment_status TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create milk_tank_offloads table
CREATE TABLE IF NOT EXISTS public.milk_tank_offloads (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  tank_id TEXT NOT NULL,
  volume NUMERIC NOT NULL CHECK (volume > 0),
  destination TEXT,
  vehicle_number TEXT,
  driver_name TEXT,
  temperature NUMERIC,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create milk_reception_quality_metrics table (if needed for reports)
CREATE TABLE IF NOT EXISTS public.milk_reception_quality_metrics (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  reception_id uuid REFERENCES public.milk_reception(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  fat_content NUMERIC,
  protein_content NUMERIC,
  lactose_content NUMERIC,
  total_solids NUMERIC,
  bacteria_count NUMERIC,
  temperature NUMERIC,
  ph_level NUMERIC,
  quality_score NUMERIC,
  volume NUMERIC,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_milk_reception_date ON public.milk_reception(date);
CREATE INDEX IF NOT EXISTS idx_milk_reception_session ON public.milk_reception(session);
CREATE INDEX IF NOT EXISTS idx_milk_tank_offloads_date ON public.milk_tank_offloads(date);
CREATE INDEX IF NOT EXISTS idx_milk_quality_metrics_date ON public.milk_reception_quality_metrics(date);

-- Enable RLS
ALTER TABLE public.milk_reception ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milk_tank_offloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milk_reception_quality_metrics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for milk_reception (admin full access)
CREATE POLICY "Admins can view all milk reception records"
  ON public.milk_reception FOR SELECT
  USING (public.has_role(auth.uid(), 'sysadmin'::app_role));

CREATE POLICY "Admins can insert milk reception records"
  ON public.milk_reception FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'sysadmin'::app_role));

CREATE POLICY "Admins can update milk reception records"
  ON public.milk_reception FOR UPDATE
  USING (public.has_role(auth.uid(), 'sysadmin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'sysadmin'::app_role));

CREATE POLICY "Admins can delete milk reception records"
  ON public.milk_reception FOR DELETE
  USING (public.has_role(auth.uid(), 'sysadmin'::app_role));

-- Create RLS policies for milk_tank_offloads (admin full access)
CREATE POLICY "Admins can view all milk tank offloads"
  ON public.milk_tank_offloads FOR SELECT
  USING (public.has_role(auth.uid(), 'sysadmin'::app_role));

CREATE POLICY "Admins can insert milk tank offloads"
  ON public.milk_tank_offloads FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'sysadmin'::app_role));

CREATE POLICY "Admins can update milk tank offloads"
  ON public.milk_tank_offloads FOR UPDATE
  USING (public.has_role(auth.uid(), 'sysadmin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'sysadmin'::app_role));

CREATE POLICY "Admins can delete milk tank offloads"
  ON public.milk_tank_offloads FOR DELETE
  USING (public.has_role(auth.uid(), 'sysadmin'::app_role));

-- Create RLS policies for milk_reception_quality_metrics (admin full access)
CREATE POLICY "Admins can view all quality metrics"
  ON public.milk_reception_quality_metrics FOR SELECT
  USING (public.has_role(auth.uid(), 'sysadmin'::app_role));

CREATE POLICY "Admins can insert quality metrics"
  ON public.milk_reception_quality_metrics FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'sysadmin'::app_role));

CREATE POLICY "Admins can update quality metrics"
  ON public.milk_reception_quality_metrics FOR UPDATE
  USING (public.has_role(auth.uid(), 'sysadmin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'sysadmin'::app_role));

CREATE POLICY "Admins can delete quality metrics"
  ON public.milk_reception_quality_metrics FOR DELETE
  USING (public.has_role(auth.uid(), 'sysadmin'::app_role));

-- Create triggers for updated_at
CREATE TRIGGER update_milk_reception_updated_at
  BEFORE UPDATE ON public.milk_reception
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_milk_tank_offloads_updated_at
  BEFORE UPDATE ON public.milk_tank_offloads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_milk_quality_metrics_updated_at
  BEFORE UPDATE ON public.milk_reception_quality_metrics
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add comments
COMMENT ON TABLE public.milk_reception IS 'Stores milk reception records from suppliers';
COMMENT ON TABLE public.milk_tank_offloads IS 'Stores milk tank offload records for distribution';
COMMENT ON TABLE public.milk_reception_quality_metrics IS 'Stores quality metrics for received milk';