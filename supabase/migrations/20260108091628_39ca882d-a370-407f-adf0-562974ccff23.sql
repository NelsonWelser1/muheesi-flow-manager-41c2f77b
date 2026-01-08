-- Create dynamic roles table
CREATE TABLE public.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_key VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  description TEXT,
  tier VARCHAR(20) DEFAULT 'operational' CHECK (tier IN ('strategic', 'tactical', 'operational')),
  is_system_role BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

-- RLS policies for roles table
CREATE POLICY "Anyone can view active roles" ON public.roles
  FOR SELECT USING (is_active = true);

CREATE POLICY "Sysadmins can manage roles" ON public.roles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role = 'sysadmin'
    )
  );

-- Seed existing roles from enum
INSERT INTO public.roles (role_key, display_name, description, tier, is_system_role) VALUES
  -- Strategic tier
  ('sysadmin', 'System Administrator', 'Full system access and configuration', 'strategic', true),
  ('ceo', 'Chief Executive Officer', 'Executive oversight and strategic decisions', 'strategic', true),
  ('board_member', 'Board Member', 'Board-level governance and oversight', 'strategic', true),
  
  -- Tactical tier (Managers)
  ('hr_manager', 'HR Manager', 'Human resources and personnel management', 'tactical', true),
  ('finance_manager', 'Finance Manager', 'Financial operations and reporting', 'tactical', true),
  ('production_manager', 'Production Manager', 'Production planning and oversight', 'tactical', true),
  ('quality_manager', 'Quality Manager', 'Quality assurance and control', 'tactical', true),
  ('sales_manager', 'Sales Manager', 'Sales operations and customer relations', 'tactical', true),
  ('logistics_manager', 'Logistics Manager', 'Supply chain and distribution management', 'tactical', true),
  ('operations_manager', 'Operations Manager', 'Day-to-day operations oversight', 'tactical', true),
  ('marketing_manager', 'Marketing Manager', 'Marketing strategies and campaigns', 'tactical', true),
  ('procurement_manager', 'Procurement Manager', 'Purchasing and vendor management', 'tactical', true),
  ('it_manager', 'IT Manager', 'Information technology and systems', 'tactical', true),
  ('compliance_officer', 'Compliance Officer', 'Regulatory compliance and auditing', 'tactical', true),
  
  -- Operational tier
  ('staff', 'Staff', 'General staff member with basic access', 'operational', true),
  ('warehouse_supervisor', 'Warehouse Supervisor', 'Warehouse operations and inventory', 'operational', true),
  ('farm_manager', 'Farm Manager', 'Agricultural operations management', 'operational', true),
  ('dairy_manager', 'Dairy Manager', 'Dairy production and operations', 'operational', true),
  ('coffee_manager', 'Coffee Manager', 'Coffee production and processing', 'operational', true),
  ('livestock_manager', 'Livestock Manager', 'Livestock care and management', 'operational', true),
  ('association_manager', 'Association Manager', 'Cooperative/association management', 'operational', true),
  ('general_manager', 'General Manager', 'General business operations', 'operational', true);

-- Function to get roles with user count
CREATE OR REPLACE FUNCTION public.get_roles_with_user_count()
RETURNS TABLE(
  id UUID,
  role_key VARCHAR(50),
  display_name VARCHAR(100),
  description TEXT,
  tier VARCHAR(20),
  is_system_role BOOLEAN,
  is_active BOOLEAN,
  user_count BIGINT
) 
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    r.id,
    r.role_key,
    r.display_name,
    r.description,
    r.tier,
    r.is_system_role,
    r.is_active,
    COALESCE(COUNT(ur.user_id), 0) as user_count
  FROM roles r
  LEFT JOIN user_roles ur ON r.role_key = ur.role::text
  WHERE r.is_active = true
  GROUP BY r.id, r.role_key, r.display_name, r.description, r.tier, r.is_system_role, r.is_active
  ORDER BY 
    CASE r.tier 
      WHEN 'strategic' THEN 1 
      WHEN 'tactical' THEN 2 
      WHEN 'operational' THEN 3 
    END,
    r.display_name;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_roles_with_user_count() TO authenticated;

-- Update timestamp trigger
CREATE TRIGGER update_roles_updated_at
  BEFORE UPDATE ON public.roles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();