-- Phase 1: Create Feature Definitions Table
CREATE TABLE IF NOT EXISTS public.feature_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_key VARCHAR(100) UNIQUE NOT NULL,
  feature_name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  route_path VARCHAR(255),
  parent_feature_key VARCHAR(100),
  icon VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create Role-Feature Access Table
CREATE TABLE IF NOT EXISTS public.role_feature_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role VARCHAR(50) NOT NULL,
  feature_key VARCHAR(100) NOT NULL REFERENCES public.feature_definitions(feature_key) ON DELETE CASCADE,
  company VARCHAR(100),
  access_level VARCHAR(20) DEFAULT 'view' CHECK (access_level IN ('view', 'edit', 'full')),
  is_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create unique index for role-feature-company combination
CREATE UNIQUE INDEX IF NOT EXISTS idx_role_feature_company 
ON public.role_feature_access (role, feature_key, COALESCE(company, '__null__'));

-- Create Feature Access Log Table for Auditing
CREATE TABLE IF NOT EXISTS public.feature_access_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  feature_key VARCHAR(100) NOT NULL,
  action VARCHAR(50) NOT NULL,
  company VARCHAR(100),
  metadata JSONB,
  accessed_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.feature_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_feature_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_access_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for feature_definitions (readable by all authenticated, writable by sysadmin)
CREATE POLICY "Feature definitions are viewable by authenticated users"
ON public.feature_definitions FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Feature definitions are manageable by sysadmin"
ON public.feature_definitions FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'sysadmin'
  )
);

-- RLS Policies for role_feature_access
CREATE POLICY "Role feature access viewable by authenticated users"
ON public.role_feature_access FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Role feature access manageable by sysadmin"
ON public.role_feature_access FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'sysadmin'
  )
);

-- RLS Policies for feature_access_log
CREATE POLICY "Users can view their own access logs"
ON public.feature_access_log FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Sysadmin can view all access logs"
ON public.feature_access_log FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'sysadmin'
  )
);

CREATE POLICY "System can insert access logs"
ON public.feature_access_log FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Create function to check feature access
CREATE OR REPLACE FUNCTION public.can_access_feature(
  _user_id UUID,
  _feature_key VARCHAR,
  _required_level VARCHAR DEFAULT 'view'
)
RETURNS TABLE(can_access BOOLEAN, access_level VARCHAR, company VARCHAR)
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_role VARCHAR;
  _user_company VARCHAR;
BEGIN
  -- Get user's role and company
  SELECT role, ur.company INTO _user_role, _user_company
  FROM user_roles ur WHERE ur.user_id = _user_id LIMIT 1;
  
  -- SysAdmin has full access to everything
  IF _user_role = 'sysadmin' THEN
    RETURN QUERY SELECT true, 'full'::VARCHAR, 'All Companies'::VARCHAR;
    RETURN;
  END IF;
  
  -- CEO has full access to everything
  IF _user_role = 'ceo' THEN
    RETURN QUERY SELECT true, 'full'::VARCHAR, _user_company;
    RETURN;
  END IF;
  
  -- Check role-feature access with company matching
  RETURN QUERY
  SELECT 
    CASE 
      WHEN rfa.access_level = 'full' THEN true
      WHEN rfa.access_level = 'edit' AND _required_level IN ('view', 'edit') THEN true
      WHEN rfa.access_level = 'view' AND _required_level = 'view' THEN true
      ELSE false
    END as can_access,
    rfa.access_level,
    COALESCE(rfa.company, _user_company)
  FROM role_feature_access rfa
  WHERE rfa.role = _user_role
    AND rfa.feature_key = _feature_key
    AND rfa.is_enabled = true
    AND (rfa.company IS NULL OR rfa.company = _user_company OR _user_company = 'All Companies')
  LIMIT 1;
END;
$$;

-- Create function to get all accessible features for a user
CREATE OR REPLACE FUNCTION public.get_user_accessible_features(_user_id UUID)
RETURNS TABLE(
  feature_key VARCHAR,
  feature_name VARCHAR,
  category VARCHAR,
  route_path VARCHAR,
  access_level VARCHAR,
  icon VARCHAR
)
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_role VARCHAR;
  _user_company VARCHAR;
BEGIN
  -- Get user's role and company
  SELECT role, ur.company INTO _user_role, _user_company
  FROM user_roles ur WHERE ur.user_id = _user_id LIMIT 1;
  
  -- SysAdmin/CEO sees all features
  IF _user_role IN ('sysadmin', 'ceo') THEN
    RETURN QUERY
    SELECT fd.feature_key, fd.feature_name, fd.category, fd.route_path, 'full'::VARCHAR, fd.icon
    FROM feature_definitions fd
    WHERE fd.is_active = true
    ORDER BY fd.category, fd.feature_name;
    RETURN;
  END IF;
  
  -- Return features based on role access
  RETURN QUERY
  SELECT fd.feature_key, fd.feature_name, fd.category, fd.route_path, rfa.access_level, fd.icon
  FROM feature_definitions fd
  INNER JOIN role_feature_access rfa ON rfa.feature_key = fd.feature_key
  WHERE fd.is_active = true
    AND rfa.role = _user_role
    AND rfa.is_enabled = true
    AND (rfa.company IS NULL OR rfa.company = _user_company OR _user_company = 'All Companies')
  ORDER BY fd.category, fd.feature_name;
END;
$$;

-- Seed initial feature definitions
INSERT INTO public.feature_definitions (feature_key, feature_name, description, category, route_path, icon) VALUES
-- System Administration
('system_dashboard', 'System Dashboard', 'Main system dashboard with overview', 'System', '/manage-inventory', 'LayoutDashboard'),
('user_management', 'User Management', 'Manage system users and roles', 'System', '/users', 'Users'),
('role_permissions', 'Role Permissions', 'Configure role-based permissions', 'System', '/users/permissions', 'Shield'),
('company_management', 'Company Management', 'Manage companies in the system', 'System', '/manage-companies', 'Building2'),
('system_monitoring', 'System Monitoring', 'Monitor system health and performance', 'System', '/system-monitoring', 'Activity'),

-- KAJON Coffee
('kajon_dashboard', 'KAJON Coffee Dashboard', 'Main dashboard for KAJON Coffee operations', 'KAJON Coffee', '/manage-inventory/kajon-coffee', 'Coffee'),
('kajon_inventory', 'Coffee Inventory', 'Manage coffee stock and inventory', 'KAJON Coffee', '/manage-inventory/kajon-coffee/inventory', 'Package'),
('kajon_sales', 'Coffee Sales', 'Manage coffee sales and orders', 'KAJON Coffee', '/manage-inventory/kajon-coffee/sales', 'ShoppingCart'),
('kajon_exports', 'Coffee Exports', 'Manage coffee export contracts', 'KAJON Coffee', '/manage-inventory/kajon-coffee/exports', 'Ship'),
('kajon_associations', 'Farmer Associations', 'Manage farmer associations', 'KAJON Coffee', '/manage-inventory/kajon-coffee/associations', 'Users'),

-- Grand Berna Dairies
('berna_dashboard', 'Grand Berna Dashboard', 'Main dashboard for Grand Berna Dairies', 'Grand Berna Dairies', '/manage-inventory/grand-berna-dairies', 'Milk'),
('berna_production', 'Dairy Production', 'Manage dairy production operations', 'Grand Berna Dairies', '/manage-inventory/grand-berna-dairies/production', 'Factory'),
('berna_cold_rooms', 'Cold Room Management', 'Manage cold storage facilities', 'Grand Berna Dairies', '/manage-inventory/grand-berna-dairies/cold-rooms', 'Thermometer'),
('berna_quality', 'Quality Control', 'Dairy quality testing and control', 'Grand Berna Dairies', '/manage-inventory/grand-berna-dairies/quality', 'CheckCircle'),

-- Kashari Farm
('kashari_dashboard', 'Kashari Farm Dashboard', 'Main dashboard for Kashari Farm', 'Kashari Farm', '/manage-inventory/kashari-farm', 'Tractor'),
('kashari_cattle', 'Cattle Management', 'Manage cattle inventory and health', 'Kashari Farm', '/manage-inventory/kashari-farm/cattle', 'Beef'),
('kashari_fattening', 'Fattening Program', 'Cattle fattening program management', 'Kashari Farm', '/manage-inventory/kashari-farm/fattening', 'TrendingUp'),

-- Bukomero Dairy
('bukomero_dashboard', 'Bukomero Dairy Dashboard', 'Main dashboard for Bukomero Dairy', 'Bukomero Dairy', '/manage-inventory/bukomero-dairy', 'Milk'),
('bukomero_collection', 'Milk Collection', 'Manage milk collection operations', 'Bukomero Dairy', '/manage-inventory/bukomero-dairy/collection', 'Droplet'),

-- Kyalima Farmers
('kyalima_dashboard', 'Kyalima Farmers Dashboard', 'Main dashboard for Kyalima Farmers', 'Kyalima Farmers', '/manage-inventory/kyalima-farmers', 'Leaf'),
('kyalima_cattle', 'Kyalima Cattle', 'Manage Kyalima cattle operations', 'Kyalima Farmers', '/manage-inventory/kyalima-farmers/cattle', 'Beef'),

-- Finance
('finance_dashboard', 'Finance Dashboard', 'Financial overview and reports', 'Finance', '/finance', 'DollarSign'),
('finance_invoices', 'Invoices', 'Manage invoices and billing', 'Finance', '/finance/invoices', 'FileText'),
('finance_expenses', 'Expenses', 'Track and manage expenses', 'Finance', '/finance/expenses', 'Receipt'),
('finance_reports', 'Financial Reports', 'Generate financial reports', 'Finance', '/finance/reports', 'BarChart'),

-- HR
('hr_dashboard', 'HR Dashboard', 'Human resources overview', 'HR', '/hr', 'UserCog'),
('hr_employees', 'Employee Management', 'Manage employee records', 'HR', '/hr/employees', 'Users'),
('hr_attendance', 'Attendance', 'Track employee attendance', 'HR', '/hr/attendance', 'Clock')
ON CONFLICT (feature_key) DO NOTHING;

-- Seed default role-feature access for key roles
-- Manager role - broad access
INSERT INTO public.role_feature_access (role, feature_key, access_level, is_enabled) VALUES
('manager', 'system_dashboard', 'full', true),
('manager', 'user_management', 'view', true),
('manager', 'kajon_dashboard', 'full', true),
('manager', 'kajon_inventory', 'full', true),
('manager', 'kajon_sales', 'full', true),
('manager', 'berna_dashboard', 'full', true),
('manager', 'berna_production', 'full', true),
('manager', 'kashari_dashboard', 'full', true),
('manager', 'finance_dashboard', 'view', true),
('manager', 'hr_dashboard', 'view', true)
ON CONFLICT DO NOTHING;

-- Staff role - limited access
INSERT INTO public.role_feature_access (role, feature_key, access_level, is_enabled) VALUES
('staff', 'system_dashboard', 'view', true),
('staff', 'kajon_inventory', 'view', true),
('staff', 'berna_production', 'view', true)
ON CONFLICT DO NOTHING;

-- Finance Manager
INSERT INTO public.role_feature_access (role, feature_key, access_level, is_enabled) VALUES
('finance_manager', 'system_dashboard', 'view', true),
('finance_manager', 'finance_dashboard', 'full', true),
('finance_manager', 'finance_invoices', 'full', true),
('finance_manager', 'finance_expenses', 'full', true),
('finance_manager', 'finance_reports', 'full', true)
ON CONFLICT DO NOTHING;

-- HR Manager
INSERT INTO public.role_feature_access (role, feature_key, access_level, is_enabled) VALUES
('hr_manager', 'system_dashboard', 'view', true),
('hr_manager', 'hr_dashboard', 'full', true),
('hr_manager', 'hr_employees', 'full', true),
('hr_manager', 'hr_attendance', 'full', true),
('hr_manager', 'user_management', 'edit', true)
ON CONFLICT DO NOTHING;

-- Farm Manager
INSERT INTO public.role_feature_access (role, feature_key, access_level, is_enabled) VALUES
('farm_manager', 'system_dashboard', 'view', true),
('farm_manager', 'kashari_dashboard', 'full', true),
('farm_manager', 'kashari_cattle', 'full', true),
('farm_manager', 'kashari_fattening', 'full', true),
('farm_manager', 'kyalima_dashboard', 'full', true),
('farm_manager', 'kyalima_cattle', 'full', true)
ON CONFLICT DO NOTHING;

-- Factory Manager
INSERT INTO public.role_feature_access (role, feature_key, access_level, is_enabled) VALUES
('factory_manager', 'system_dashboard', 'view', true),
('factory_manager', 'berna_dashboard', 'full', true),
('factory_manager', 'berna_production', 'full', true),
('factory_manager', 'berna_cold_rooms', 'full', true),
('factory_manager', 'berna_quality', 'full', true)
ON CONFLICT DO NOTHING;

-- Sales Manager
INSERT INTO public.role_feature_access (role, feature_key, access_level, is_enabled) VALUES
('sales_manager', 'system_dashboard', 'view', true),
('sales_manager', 'kajon_dashboard', 'view', true),
('sales_manager', 'kajon_sales', 'full', true),
('sales_manager', 'kajon_exports', 'full', true),
('sales_manager', 'finance_invoices', 'edit', true)
ON CONFLICT DO NOTHING;

-- Inventory Manager
INSERT INTO public.role_feature_access (role, feature_key, access_level, is_enabled) VALUES
('inventory_manager', 'system_dashboard', 'view', true),
('inventory_manager', 'kajon_inventory', 'full', true),
('inventory_manager', 'berna_cold_rooms', 'full', true)
ON CONFLICT DO NOTHING;

-- Association Manager
INSERT INTO public.role_feature_access (role, feature_key, access_level, is_enabled) VALUES
('association_manager', 'system_dashboard', 'view', true),
('association_manager', 'kajon_associations', 'full', true),
('association_manager', 'kajon_inventory', 'view', true)
ON CONFLICT DO NOTHING;