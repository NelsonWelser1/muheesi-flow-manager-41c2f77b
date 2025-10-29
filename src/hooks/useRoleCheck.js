import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useRoleCheck = (requiredRole) => {
  return useQuery({
    queryKey: ['roleCheck', requiredRole],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;
      
      const { data: roles, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', requiredRole)
        .maybeSingle();
      
      if (error) {
        console.error('Error checking role:', error);
        return false;
      }
      
      return !!roles;
    },
    enabled: !!requiredRole,
  });
};

export const useIsAdmin = () => {
  return useRoleCheck('sysadmin');
};
