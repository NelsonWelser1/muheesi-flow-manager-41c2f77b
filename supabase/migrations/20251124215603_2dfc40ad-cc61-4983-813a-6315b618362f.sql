-- Create Kakyinga Coffee Farm Employees table
CREATE TABLE IF NOT EXISTS public.kakyinga_employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  position TEXT NOT NULL,
  department TEXT NOT NULL,
  hire_date DATE NOT NULL,
  phone TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  salary NUMERIC,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Kakyinga Fresh Coffee Harvest table
CREATE TABLE IF NOT EXISTS public.kakyinga_fresh_harvest (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  harvest_date DATE NOT NULL,
  quantity_kg NUMERIC NOT NULL,
  harvester_name TEXT NOT NULL,
  field_section TEXT NOT NULL,
  quality_grade TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Kakyinga Dry Coffee Stock table
CREATE TABLE IF NOT EXISTS public.kakyinga_dry_coffee_stock (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_date DATE NOT NULL,
  quantity_kg NUMERIC NOT NULL,
  source TEXT NOT NULL,
  quality_grade TEXT NOT NULL,
  moisture_content NUMERIC,
  batch_number TEXT,
  location TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Kakyinga Coffee Sales table
CREATE TABLE IF NOT EXISTS public.kakyinga_coffee_sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_date DATE NOT NULL,
  buyer_name TEXT NOT NULL,
  buyer_contact TEXT,
  destination TEXT NOT NULL,
  quantity_kg NUMERIC NOT NULL,
  price_per_kg NUMERIC NOT NULL,
  total_amount NUMERIC NOT NULL,
  payment_method TEXT NOT NULL,
  money_received_by TEXT NOT NULL,
  quality_grade TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Kakyinga Requisitions table
CREATE TABLE IF NOT EXISTS public.kakyinga_requisitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requisition_number TEXT NOT NULL UNIQUE,
  request_date DATE NOT NULL,
  requested_by TEXT NOT NULL,
  category TEXT NOT NULL,
  item_name TEXT NOT NULL,
  quantity TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium',
  status TEXT NOT NULL DEFAULT 'pending',
  estimated_cost NUMERIC,
  justification TEXT NOT NULL,
  approved_by TEXT,
  approved_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.kakyinga_employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kakyinga_fresh_harvest ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kakyinga_dry_coffee_stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kakyinga_coffee_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kakyinga_requisitions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "sysadmin_all_kakyinga_employees" ON public.kakyinga_employees FOR ALL USING (has_role(auth.uid(), 'sysadmin'::app_role));
CREATE POLICY "operations_all_kakyinga_employees" ON public.kakyinga_employees FOR ALL USING (has_role(auth.uid(), 'operations_manager'::app_role));
CREATE POLICY "ceo_read_kakyinga_employees" ON public.kakyinga_employees FOR SELECT USING (has_role(auth.uid(), 'ceo'::app_role));

CREATE POLICY "sysadmin_all_kakyinga_harvest" ON public.kakyinga_fresh_harvest FOR ALL USING (has_role(auth.uid(), 'sysadmin'::app_role));
CREATE POLICY "operations_all_kakyinga_harvest" ON public.kakyinga_fresh_harvest FOR ALL USING (has_role(auth.uid(), 'operations_manager'::app_role));
CREATE POLICY "ceo_read_kakyinga_harvest" ON public.kakyinga_fresh_harvest FOR SELECT USING (has_role(auth.uid(), 'ceo'::app_role));

CREATE POLICY "sysadmin_all_kakyinga_dry_stock" ON public.kakyinga_dry_coffee_stock FOR ALL USING (has_role(auth.uid(), 'sysadmin'::app_role));
CREATE POLICY "operations_all_kakyinga_dry_stock" ON public.kakyinga_dry_coffee_stock FOR ALL USING (has_role(auth.uid(), 'operations_manager'::app_role));
CREATE POLICY "ceo_read_kakyinga_dry_stock" ON public.kakyinga_dry_coffee_stock FOR SELECT USING (has_role(auth.uid(), 'ceo'::app_role));

CREATE POLICY "sysadmin_all_kakyinga_sales" ON public.kakyinga_coffee_sales FOR ALL USING (has_role(auth.uid(), 'sysadmin'::app_role));
CREATE POLICY "operations_all_kakyinga_sales" ON public.kakyinga_coffee_sales FOR ALL USING (has_role(auth.uid(), 'operations_manager'::app_role));
CREATE POLICY "sales_all_kakyinga_sales" ON public.kakyinga_coffee_sales FOR ALL USING (has_role(auth.uid(), 'sales_manager'::app_role));
CREATE POLICY "ceo_read_kakyinga_sales" ON public.kakyinga_coffee_sales FOR SELECT USING (has_role(auth.uid(), 'ceo'::app_role));

CREATE POLICY "sysadmin_all_kakyinga_requisitions" ON public.kakyinga_requisitions FOR ALL USING (has_role(auth.uid(), 'sysadmin'::app_role));
CREATE POLICY "operations_all_kakyinga_requisitions" ON public.kakyinga_requisitions FOR ALL USING (has_role(auth.uid(), 'operations_manager'::app_role));
CREATE POLICY "ceo_read_kakyinga_requisitions" ON public.kakyinga_requisitions FOR SELECT USING (has_role(auth.uid(), 'ceo'::app_role));

-- Triggers for updated_at
CREATE TRIGGER update_kakyinga_employees_updated_at BEFORE UPDATE ON public.kakyinga_employees FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_kakyinga_harvest_updated_at BEFORE UPDATE ON public.kakyinga_fresh_harvest FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_kakyinga_dry_stock_updated_at BEFORE UPDATE ON public.kakyinga_dry_coffee_stock FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_kakyinga_sales_updated_at BEFORE UPDATE ON public.kakyinga_coffee_sales FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_kakyinga_requisitions_updated_at BEFORE UPDATE ON public.kakyinga_requisitions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();