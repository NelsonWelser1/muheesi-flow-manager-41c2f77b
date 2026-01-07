
-- Phase 1: Create all new tables for full database functionality

-- 1. Kashari Employees Table
CREATE TABLE public.kashari_employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  position TEXT,
  department TEXT,
  company TEXT DEFAULT 'Kashari Farm',
  join_date DATE,
  contact TEXT,
  email TEXT,
  address TEXT,
  salary NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'active',
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Kashari Attendance Table
CREATE TABLE public.kashari_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES public.kashari_employees(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  check_in TIME,
  check_out TIME,
  status TEXT DEFAULT 'present',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Kashari Leave Records Table
CREATE TABLE public.kashari_leave_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES public.kashari_employees(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  duration INTEGER,
  status TEXT DEFAULT 'pending',
  reason TEXT,
  approved_by TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Coffee Customers Table
CREATE TABLE public.coffee_customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT,
  location TEXT,
  country TEXT,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  website TEXT,
  preferred_coffee_types TEXT[],
  preferred_grades TEXT[],
  status TEXT DEFAULT 'Active',
  notes TEXT,
  last_order_date DATE,
  total_orders INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Dairy Customers Table
CREATE TABLE public.dairy_customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT,
  location TEXT,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  status TEXT DEFAULT 'Active',
  notes TEXT,
  last_order_date DATE,
  total_orders INTEGER DEFAULT 0,
  credit_limit NUMERIC DEFAULT 0,
  outstanding_balance NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Kashari Scholarships Table
CREATE TABLE public.kashari_scholarships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name TEXT NOT NULL,
  student_id TEXT UNIQUE,
  school TEXT,
  grade_level TEXT,
  scholarship_type TEXT,
  amount NUMERIC DEFAULT 0,
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'active',
  guardian_name TEXT,
  guardian_contact TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Coffee Orders Table
CREATE TABLE public.coffee_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES public.coffee_customers(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  order_date DATE DEFAULT CURRENT_DATE,
  delivery_date DATE,
  coffee_type TEXT,
  grade TEXT,
  quantity NUMERIC DEFAULT 0,
  unit TEXT DEFAULT 'kg',
  unit_price NUMERIC DEFAULT 0,
  total_amount NUMERIC DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending',
  fulfillment TEXT DEFAULT 'Unfulfilled',
  payment_status TEXT DEFAULT 'unpaid',
  shipping_address TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.kashari_employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kashari_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kashari_leave_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coffee_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dairy_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kashari_scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coffee_orders ENABLE ROW LEVEL SECURITY;

-- Create public read policies (for now, can be restricted later)
CREATE POLICY "Allow public read kashari_employees" ON public.kashari_employees FOR SELECT USING (true);
CREATE POLICY "Allow public insert kashari_employees" ON public.kashari_employees FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update kashari_employees" ON public.kashari_employees FOR UPDATE USING (true);
CREATE POLICY "Allow public delete kashari_employees" ON public.kashari_employees FOR DELETE USING (true);

CREATE POLICY "Allow public read kashari_attendance" ON public.kashari_attendance FOR SELECT USING (true);
CREATE POLICY "Allow public insert kashari_attendance" ON public.kashari_attendance FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update kashari_attendance" ON public.kashari_attendance FOR UPDATE USING (true);
CREATE POLICY "Allow public delete kashari_attendance" ON public.kashari_attendance FOR DELETE USING (true);

CREATE POLICY "Allow public read kashari_leave_records" ON public.kashari_leave_records FOR SELECT USING (true);
CREATE POLICY "Allow public insert kashari_leave_records" ON public.kashari_leave_records FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update kashari_leave_records" ON public.kashari_leave_records FOR UPDATE USING (true);
CREATE POLICY "Allow public delete kashari_leave_records" ON public.kashari_leave_records FOR DELETE USING (true);

CREATE POLICY "Allow public read coffee_customers" ON public.coffee_customers FOR SELECT USING (true);
CREATE POLICY "Allow public insert coffee_customers" ON public.coffee_customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update coffee_customers" ON public.coffee_customers FOR UPDATE USING (true);
CREATE POLICY "Allow public delete coffee_customers" ON public.coffee_customers FOR DELETE USING (true);

CREATE POLICY "Allow public read dairy_customers" ON public.dairy_customers FOR SELECT USING (true);
CREATE POLICY "Allow public insert dairy_customers" ON public.dairy_customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update dairy_customers" ON public.dairy_customers FOR UPDATE USING (true);
CREATE POLICY "Allow public delete dairy_customers" ON public.dairy_customers FOR DELETE USING (true);

CREATE POLICY "Allow public read kashari_scholarships" ON public.kashari_scholarships FOR SELECT USING (true);
CREATE POLICY "Allow public insert kashari_scholarships" ON public.kashari_scholarships FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update kashari_scholarships" ON public.kashari_scholarships FOR UPDATE USING (true);
CREATE POLICY "Allow public delete kashari_scholarships" ON public.kashari_scholarships FOR DELETE USING (true);

CREATE POLICY "Allow public read coffee_orders" ON public.coffee_orders FOR SELECT USING (true);
CREATE POLICY "Allow public insert coffee_orders" ON public.coffee_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update coffee_orders" ON public.coffee_orders FOR UPDATE USING (true);
CREATE POLICY "Allow public delete coffee_orders" ON public.coffee_orders FOR DELETE USING (true);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_kashari_employees_updated_at BEFORE UPDATE ON public.kashari_employees FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_coffee_customers_updated_at BEFORE UPDATE ON public.coffee_customers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_dairy_customers_updated_at BEFORE UPDATE ON public.dairy_customers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_kashari_scholarships_updated_at BEFORE UPDATE ON public.kashari_scholarships FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_coffee_orders_updated_at BEFORE UPDATE ON public.coffee_orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_kashari_employees_status ON public.kashari_employees(status);
CREATE INDEX idx_kashari_attendance_date ON public.kashari_attendance(date);
CREATE INDEX idx_kashari_attendance_employee ON public.kashari_attendance(employee_id);
CREATE INDEX idx_kashari_leave_employee ON public.kashari_leave_records(employee_id);
CREATE INDEX idx_coffee_customers_status ON public.coffee_customers(status);
CREATE INDEX idx_dairy_customers_status ON public.dairy_customers(status);
CREATE INDEX idx_kashari_scholarships_status ON public.kashari_scholarships(status);
CREATE INDEX idx_coffee_orders_status ON public.coffee_orders(status);
CREATE INDEX idx_coffee_orders_customer ON public.coffee_orders(customer_id);
