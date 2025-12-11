-- Create permission_definitions table (master list of all permissions)
CREATE TABLE public.permission_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  permission_key TEXT UNIQUE NOT NULL,
  permission_name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  is_system_critical BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create role_permissions table (maps roles to permissions)
CREATE TABLE public.role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role app_role NOT NULL,
  permission_key TEXT NOT NULL REFERENCES public.permission_definitions(permission_key) ON DELETE CASCADE,
  is_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(role, permission_key)
);

-- Enable RLS
ALTER TABLE public.permission_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- RLS policies for permission_definitions (read by all authenticated, write by sysadmin)
CREATE POLICY "Authenticated users can read permission definitions"
ON public.permission_definitions FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Sysadmin can manage permission definitions"
ON public.permission_definitions FOR ALL
USING (has_role(auth.uid(), 'sysadmin'));

-- RLS policies for role_permissions
CREATE POLICY "Authenticated users can read role permissions"
ON public.role_permissions FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Sysadmin can manage role permissions"
ON public.role_permissions FOR ALL
USING (has_role(auth.uid(), 'sysadmin'));

-- Create updated_at trigger for role_permissions
CREATE TRIGGER update_role_permissions_updated_at
BEFORE UPDATE ON public.role_permissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed permission definitions
INSERT INTO public.permission_definitions (permission_key, permission_name, description, category, is_system_critical) VALUES
-- User Management
('canManageUsers', 'Manage Users', 'Create, edit, and delete user accounts', 'User Management', true),
('canAssignRoles', 'Assign Roles', 'Assign and change user roles', 'User Management', true),
('canViewAuditLog', 'View Audit Log', 'Access the audit log for tracking changes', 'User Management', false),
('canManageTemplates', 'Manage Templates', 'Create and edit role templates', 'User Management', false),

-- Data Operations
('canViewOwnData', 'View Own Data', 'View data owned by the user', 'Data Operations', false),
('canCreateData', 'Create Data', 'Create new records in the system', 'Data Operations', false),
('canUpdateData', 'Update Data', 'Modify existing records', 'Data Operations', false),
('canDeleteData', 'Delete Data', 'Remove records from the system', 'Data Operations', false),

-- Approvals
('canApproveRequests', 'Approve Requests', 'Approve or reject pending requests', 'Approvals', false),
('canApproveTransfers', 'Approve Transfers', 'Approve stock and asset transfers', 'Approvals', false),

-- Module Access
('canAccessFinance', 'Access Finance', 'Access financial modules and reports', 'Module Access', false),
('canAccessHR', 'Access HR', 'Access human resources modules', 'Module Access', false),
('canAccessOperations', 'Access Operations', 'Access operations and production modules', 'Module Access', false),
('canAccessSales', 'Access Sales', 'Access sales and CRM modules', 'Module Access', false),
('canAccessInventory', 'Access Inventory', 'Access inventory management modules', 'Module Access', false),
('canAccessReports', 'Access Reports', 'Access reporting and analytics', 'Module Access', false),

-- System Settings
('canManageCompanies', 'Manage Companies', 'Create and configure company settings', 'System Settings', true),
('canManagePermissions', 'Manage Permissions', 'Configure role permissions', 'System Settings', true),
('canExportData', 'Export Data', 'Export data from the system', 'System Settings', false),
('canImportData', 'Import Data', 'Import data into the system', 'System Settings', false);

-- Seed default role permissions for sysadmin (all enabled)
INSERT INTO public.role_permissions (role, permission_key, is_enabled)
SELECT 'sysadmin'::app_role, permission_key, true
FROM public.permission_definitions;

-- Seed default role permissions for ceo (most enabled except system critical)
INSERT INTO public.role_permissions (role, permission_key, is_enabled)
SELECT 'ceo'::app_role, permission_key, 
  CASE WHEN is_system_critical THEN false ELSE true END
FROM public.permission_definitions;

-- Seed default role permissions for manager
INSERT INTO public.role_permissions (role, permission_key, is_enabled)
SELECT 'manager'::app_role, permission_key, 
  CASE 
    WHEN permission_key IN ('canViewAuditLog', 'canViewOwnData', 'canCreateData', 'canUpdateData', 'canAccessReports') THEN true
    ELSE false 
  END
FROM public.permission_definitions;

-- Seed default role permissions for staff (minimal)
INSERT INTO public.role_permissions (role, permission_key, is_enabled)
SELECT 'staff'::app_role, permission_key, 
  CASE WHEN permission_key = 'canViewOwnData' THEN true ELSE false END
FROM public.permission_definitions;