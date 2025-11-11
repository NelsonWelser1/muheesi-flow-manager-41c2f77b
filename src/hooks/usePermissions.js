import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const usePermissions = () => {
  const { data: permissions, isLoading } = useQuery({
    queryKey: ['user-permissions'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return {
          isAuthenticated: false,
          isSysAdmin: false,
          isManager: false,
          isStaff: false,
          role: null,
          company: null,
          canManageUsers: false,
          canAssignRoles: false,
          canViewAuditLog: false,
          canManageTemplates: false,
          canApproveRequests: false
        };
      }

      const { data: roleData, error } = await supabase
        .from('user_roles')
        .select('role, company')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user role:', error);
        return {
          isAuthenticated: true,
          isSysAdmin: false,
          isManager: false,
          isStaff: false,
          role: null,
          company: null,
          canManageUsers: false,
          canAssignRoles: false,
          canViewAuditLog: false,
          canManageTemplates: false,
          canApproveRequests: false
        };
      }

      const role = roleData?.role || null;
      const company = roleData?.company || null;

      return {
        isAuthenticated: true,
        isSysAdmin: role === 'sysadmin',
        isManager: role === 'manager',
        isStaff: role === 'staff',
        role,
        company,
        // Permission flags
        canManageUsers: role === 'sysadmin',
        canAssignRoles: role === 'sysadmin',
        canViewAuditLog: role === 'sysadmin' || role === 'manager',
        canManageTemplates: role === 'sysadmin',
        canApproveRequests: role === 'sysadmin',
        canViewOwnData: true,
        canCreateData: role === 'sysadmin' || role === 'manager',
        canUpdateData: role === 'sysadmin' || role === 'manager',
        canDeleteData: role === 'sysadmin' || role === 'manager'
      };
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 1
  });

  return {
    permissions: permissions || {
      isAuthenticated: false,
      isSysAdmin: false,
      isManager: false,
      isStaff: false,
      role: null,
      company: null,
      canManageUsers: false,
      canAssignRoles: false,
      canViewAuditLog: false,
      canManageTemplates: false,
      canApproveRequests: false
    },
    isLoading
  };
};

// Hook to require specific permission
export const useRequirePermission = (requiredPermission) => {
  const { permissions, isLoading } = usePermissions();

  return {
    hasPermission: permissions[requiredPermission] === true,
    isLoading,
    permissions
  };
};

// Hook specifically for admin check
export const useIsAdmin = () => {
  const { permissions, isLoading } = usePermissions();

  return {
    isAdmin: permissions.isSysAdmin,
    isLoading,
    permissions
  };
};
