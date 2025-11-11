import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useUserRole = () => {
  return useQuery({
    queryKey: ['userRole'],
    queryFn: async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error('Error fetching user:', userError);
          return null;
        }
        
        if (!user) {
          console.log('No authenticated user found');
          return null;
        }
        
        const { data: roles, error: roleError } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (roleError) {
          // Don't throw error if it's just that the user has no role yet
          if (roleError.code === 'PGRST116') {
            console.log('User has no role assigned yet');
            return null;
          }
          console.error('Error fetching user role:', roleError);
          return null;
        }
        
        return roles;
      } catch (error) {
        console.error('Unexpected error in useUserRole:', error);
        return null;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
    enabled: true,
  });
};

export const useUserProfile = () => {
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error('Error fetching user:', userError);
          return null;
        }
        
        if (!user) {
          console.log('No authenticated user found');
          return null;
        }
        
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profileError) {
          console.error('Error fetching user profile:', profileError);
          // Return basic user info if profile doesn't exist yet
          return {
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
          };
        }
        
        return profile;
      } catch (error) {
        console.error('Unexpected error in useUserProfile:', error);
        return null;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
    enabled: true,
  });
};

export const useCompanyAccess = (company) => {
  const { data: role } = useUserRole();
  
  return role?.company === company || role?.company === 'All Companies';
};