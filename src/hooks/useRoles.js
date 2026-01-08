import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Hook to get all roles with user counts
export const useRoles = () => {
  return useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_roles_with_user_count');
      
      if (error) {
        console.error('Error fetching roles:', error);
        throw error;
      }
      
      return data || [];
    }
  });
};

// Hook to get roles grouped by tier
export const useRolesByTier = () => {
  const { data: roles, ...rest } = useRoles();
  
  const groupedRoles = roles?.reduce((acc, role) => {
    const tier = role.tier || 'operational';
    if (!acc[tier]) acc[tier] = [];
    acc[tier].push(role);
    return acc;
  }, {});
  
  return { data: groupedRoles, roles, ...rest };
};

// Hook to create a new role
export const useCreateRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (roleData) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('roles')
        .insert({
          role_key: roleData.role_key.toLowerCase().replace(/\s+/g, '_'),
          display_name: roleData.display_name,
          description: roleData.description,
          tier: roleData.tier || 'operational',
          is_system_role: false,
          created_by: user?.id
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success('Role created successfully');
    },
    onError: (error) => {
      console.error('Error creating role:', error);
      toast.error(error.message || 'Failed to create role');
    }
  });
};

// Hook to update a role
export const useUpdateRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...roleData }) => {
      const { data, error } = await supabase
        .from('roles')
        .update({
          display_name: roleData.display_name,
          description: roleData.description,
          tier: roleData.tier,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success('Role updated successfully');
    },
    onError: (error) => {
      console.error('Error updating role:', error);
      toast.error(error.message || 'Failed to update role');
    }
  });
};

// Hook to delete a role (soft delete by setting is_active to false)
export const useDeleteRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (roleId) => {
      const { error } = await supabase
        .from('roles')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('id', roleId)
        .eq('is_system_role', false); // Only allow deleting non-system roles
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success('Role deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting role:', error);
      toast.error(error.message || 'Failed to delete role');
    }
  });
};

export default useRoles;
