import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Update a single role-feature access
export const useUpdateRoleFeatureAccess = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ role, featureKey, accessLevel, isEnabled, company = null }) => {
      const { data, error } = await supabase
        .from('role_feature_access')
        .upsert({
          role,
          feature_key: featureKey,
          access_level: accessLevel,
          is_enabled: isEnabled,
          company,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'role,feature_key,company'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['role-feature-access'] });
      queryClient.invalidateQueries({ queryKey: ['feature-access'] });
      queryClient.invalidateQueries({ queryKey: ['user-accessible-features'] });
      toast({
        title: 'Access Updated',
        description: 'Feature access has been updated successfully.'
      });
    },
    onError: (error) => {
      console.error('Error updating role feature access:', error);
      toast({
        title: 'Error',
        description: 'Failed to update feature access.',
        variant: 'destructive'
      });
    }
  });
};

// Bulk update role-feature access
export const useBulkUpdateRoleFeatureAccess = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (updates) => {
      // updates is an array of { role, featureKey, accessLevel, isEnabled, company }
      const formattedUpdates = updates.map(u => ({
        role: u.role,
        feature_key: u.featureKey,
        access_level: u.accessLevel,
        is_enabled: u.isEnabled,
        company: u.company || null,
        updated_at: new Date().toISOString()
      }));

      const { data, error } = await supabase
        .from('role_feature_access')
        .upsert(formattedUpdates)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['role-feature-access'] });
      queryClient.invalidateQueries({ queryKey: ['feature-access'] });
      queryClient.invalidateQueries({ queryKey: ['user-accessible-features'] });
      toast({
        title: 'Access Updated',
        description: `Updated ${variables.length} feature access settings.`
      });
    },
    onError: (error) => {
      console.error('Error bulk updating role feature access:', error);
      toast({
        title: 'Error',
        description: 'Failed to update feature access.',
        variant: 'destructive'
      });
    }
  });
};

// Delete a role-feature access entry
export const useDeleteRoleFeatureAccess = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from('role_feature_access')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['role-feature-access'] });
      queryClient.invalidateQueries({ queryKey: ['feature-access'] });
      queryClient.invalidateQueries({ queryKey: ['user-accessible-features'] });
      toast({
        title: 'Access Removed',
        description: 'Feature access has been removed.'
      });
    },
    onError: (error) => {
      console.error('Error deleting role feature access:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove feature access.',
        variant: 'destructive'
      });
    }
  });
};

// Apply a role template (preset feature access for common roles)
export const useApplyRoleTemplate = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const roleTemplates = {
    manager: [
      { feature_key: 'system_dashboard', access_level: 'full' },
      { feature_key: 'user_management', access_level: 'view' },
      { feature_key: 'finance_dashboard', access_level: 'view' },
      { feature_key: 'hr_dashboard', access_level: 'view' }
    ],
    staff: [
      { feature_key: 'system_dashboard', access_level: 'view' }
    ],
    finance_manager: [
      { feature_key: 'system_dashboard', access_level: 'view' },
      { feature_key: 'finance_dashboard', access_level: 'full' },
      { feature_key: 'finance_invoices', access_level: 'full' },
      { feature_key: 'finance_expenses', access_level: 'full' },
      { feature_key: 'finance_reports', access_level: 'full' }
    ],
    hr_manager: [
      { feature_key: 'system_dashboard', access_level: 'view' },
      { feature_key: 'hr_dashboard', access_level: 'full' },
      { feature_key: 'hr_employees', access_level: 'full' },
      { feature_key: 'hr_attendance', access_level: 'full' },
      { feature_key: 'user_management', access_level: 'edit' }
    ],
    farm_manager: [
      { feature_key: 'system_dashboard', access_level: 'view' },
      { feature_key: 'kashari_dashboard', access_level: 'full' },
      { feature_key: 'kashari_cattle', access_level: 'full' },
      { feature_key: 'kashari_fattening', access_level: 'full' },
      { feature_key: 'kyalima_dashboard', access_level: 'full' },
      { feature_key: 'kyalima_cattle', access_level: 'full' }
    ],
    factory_manager: [
      { feature_key: 'system_dashboard', access_level: 'view' },
      { feature_key: 'berna_dashboard', access_level: 'full' },
      { feature_key: 'berna_production', access_level: 'full' },
      { feature_key: 'berna_cold_rooms', access_level: 'full' },
      { feature_key: 'berna_quality', access_level: 'full' }
    ],
    sales_manager: [
      { feature_key: 'system_dashboard', access_level: 'view' },
      { feature_key: 'kajon_dashboard', access_level: 'view' },
      { feature_key: 'kajon_sales', access_level: 'full' },
      { feature_key: 'kajon_exports', access_level: 'full' },
      { feature_key: 'finance_invoices', access_level: 'edit' }
    ]
  };

  return useMutation({
    mutationFn: async ({ role, templateName }) => {
      const template = roleTemplates[templateName];
      if (!template) {
        throw new Error(`Template "${templateName}" not found`);
      }

      const updates = template.map(t => ({
        role,
        feature_key: t.feature_key,
        access_level: t.access_level,
        is_enabled: true,
        updated_at: new Date().toISOString()
      }));

      const { data, error } = await supabase
        .from('role_feature_access')
        .upsert(updates)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['role-feature-access'] });
      queryClient.invalidateQueries({ queryKey: ['feature-access'] });
      toast({
        title: 'Template Applied',
        description: `Applied "${variables.templateName}" template to role.`
      });
    },
    onError: (error) => {
      console.error('Error applying role template:', error);
      toast({
        title: 'Error',
        description: 'Failed to apply role template.',
        variant: 'destructive'
      });
    }
  });
};
