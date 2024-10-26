import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase';

export const useUserRole = () => {
  return useQuery({
    queryKey: ['userRole'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      const { data: roles } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      return roles;
    },
  });
};

export const useCompanyAccess = (company) => {
  const { data: role } = useUserRole();
  
  return role?.company === company || role?.company === 'All Companies';
};