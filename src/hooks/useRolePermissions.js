import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Fetch all permission definitions
export const usePermissionDefinitions = () => {
  return useQuery({
    queryKey: ['permission-definitions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('permission_definitions')
        .select('*')
        .order('category', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });
};

// Fetch role permissions for a specific role
export const useRolePermissionsForRole = (role) => {
  return useQuery({
    queryKey: ['role-permissions', role],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('role_permissions')
        .select('*')
        .eq('role', role);
      
      if (error) throw error;
      return data;
    },
    enabled: !!role,
  });
};

// Fetch all role permissions
export const useAllRolePermissions = () => {
  return useQuery({
    queryKey: ['all-role-permissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('role_permissions')
        .select('*');
      
      if (error) throw error;
      return data;
    },
  });
};

// Update a role permission
export const useUpdateRolePermission = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ role, permissionKey, isEnabled }) => {
      const { data, error } = await supabase
        .from('role_permissions')
        .upsert({
          role,
          permission_key: permissionKey,
          is_enabled: isEnabled,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'role,permission_key',
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['role-permissions'] });
      queryClient.invalidateQueries({ queryKey: ['all-role-permissions'] });
      queryClient.invalidateQueries({ queryKey: ['user-permissions'] });
    },
  });
};

// Bulk update permissions for a role
export const useBulkUpdateRolePermissions = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ role, permissions }) => {
      const updates = permissions.map(p => ({
        role,
        permission_key: p.permissionKey,
        is_enabled: p.isEnabled,
        updated_at: new Date().toISOString(),
      }));
      
      const { data, error } = await supabase
        .from('role_permissions')
        .upsert(updates, {
          onConflict: 'role,permission_key',
        })
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['role-permissions'] });
      queryClient.invalidateQueries({ queryKey: ['all-role-permissions'] });
      queryClient.invalidateQueries({ queryKey: ['user-permissions'] });
    },
  });
};

// Get available roles
export const useAvailableRoles = () => {
  return useQuery({
    queryKey: ['available-roles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_available_roles');
      
      if (error) {
        // Fallback to hardcoded roles if RPC doesn't exist
        return [
          'sysadmin', 'ceo', 'manager', 'staff', 'hr_manager', 
          'finance_manager', 'operations_manager', 'sales_manager',
          'logistics_manager', 'it_manager', 'factory_manager',
          'procurement_manager', 'warehouse_supervisor', 'compliance_officer',
          'risk_manager', 'board_member', 'ceo_assistant', 'inventory_manager',
          'marketing_manager', 'product_manager', 'association_manager', 'farm_manager'
        ];
      }
      return data;
    },
  });
};
