-- Seed default permissions for remaining roles
INSERT INTO public.role_permissions (role, permission_key, is_enabled)
SELECT r.role, pd.permission_key, false
FROM (
  SELECT unnest(enum_range(NULL::app_role)) as role
) r
CROSS JOIN public.permission_definitions pd
WHERE NOT EXISTS (
  SELECT 1 FROM public.role_permissions rp 
  WHERE rp.role = r.role AND rp.permission_key = pd.permission_key
)
ON CONFLICT (role, permission_key) DO NOTHING;

-- Enable specific permissions for department managers
UPDATE public.role_permissions
SET is_enabled = true
WHERE role IN ('hr_manager', 'finance_manager', 'operations_manager', 'sales_manager', 'logistics_manager', 
               'it_manager', 'factory_manager', 'procurement_manager', 'inventory_manager', 'marketing_manager', 
               'product_manager', 'farm_manager', 'association_manager')
AND permission_key IN ('canViewOwnData', 'canCreateData', 'canUpdateData', 'canAccessReports');

-- Enable HR module access for HR manager
UPDATE public.role_permissions
SET is_enabled = true
WHERE role = 'hr_manager' AND permission_key = 'canAccessHR';

-- Enable Finance module access for Finance manager
UPDATE public.role_permissions
SET is_enabled = true
WHERE role = 'finance_manager' AND permission_key = 'canAccessFinance';

-- Enable Operations module access for Operations manager
UPDATE public.role_permissions
SET is_enabled = true
WHERE role = 'operations_manager' AND permission_key = 'canAccessOperations';

-- Enable Sales module access for Sales manager
UPDATE public.role_permissions
SET is_enabled = true
WHERE role = 'sales_manager' AND permission_key = 'canAccessSales';

-- Enable Inventory module access for Inventory manager
UPDATE public.role_permissions
SET is_enabled = true
WHERE role IN ('inventory_manager', 'warehouse_supervisor') AND permission_key = 'canAccessInventory';

-- Enable view audit log for compliance and risk managers
UPDATE public.role_permissions
SET is_enabled = true
WHERE role IN ('compliance_officer', 'risk_manager') AND permission_key IN ('canViewAuditLog', 'canAccessReports', 'canViewOwnData');

-- Enable board member read access
UPDATE public.role_permissions
SET is_enabled = true
WHERE role = 'board_member' AND permission_key IN ('canViewOwnData', 'canAccessReports', 'canAccessFinance');