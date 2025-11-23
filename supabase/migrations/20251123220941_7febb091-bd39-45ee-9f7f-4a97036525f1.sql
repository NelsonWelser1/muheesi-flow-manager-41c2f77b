-- Create a companies table to properly track all business entities
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL UNIQUE,
  description TEXT,
  company_type TEXT,
  manager_name TEXT,
  contact_phone TEXT,
  location TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "System admins can do everything on companies"
  ON public.companies
  FOR ALL
  USING (has_role(auth.uid(), 'sysadmin'::app_role));

CREATE POLICY "Authenticated users can view companies"
  ON public.companies
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Insert the 5 actual business entities
INSERT INTO public.companies (company_name, description, company_type, manager_name, contact_phone, location) VALUES
('Grand Berna Dairies', 'Raw Milk, Processed Milk, Cheese, Yogurt, Packed Meat of Beef, Pork, and Goat. Factories in Kyiboga and Mbarara with various outlets.', 'Dairy & Meat Processing', NULL, NULL, 'Kyiboga and Mbarara'),
('KAJON Coffee Limited', 'Robusta and Arabica Coffee, Kakyinga Coffee Farm, Kakyinga Factory, JBER, and additional stores and projects.', 'Coffee Production & Export', NULL, NULL, 'Kakyinga'),
('Kyalima Farmers Limited', 'Assets and Cooperations, Agri-Business.', 'Agri-Business', NULL, NULL, NULL),
('Kashari Mixed Farm', 'Integrated farm in Mbarara managing dairy products, livestock, banana plantation, and scholarship programs.', 'Mixed Farming', 'Asiimwe Daniel', '+256 782 222993', 'Mbarara'),
('Bukomero Dairy Farm', 'Specialized dairy farm focusing on milk production, livestock management, silage making, and comprehensive financial tracking.', 'Dairy Farm', 'Manager Boaz', '+256 772 674060', 'Bukomero, Kyiboga District')
ON CONFLICT (company_name) DO NOTHING;

-- Create trigger for updated_at
CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();