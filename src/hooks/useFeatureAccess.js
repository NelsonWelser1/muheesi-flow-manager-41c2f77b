import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Hook to check if user can access a specific feature
export const useFeatureAccess = (featureKey, requiredLevel = 'view') => {
  // Defensive check for query client availability during HMR
  try {
    useQueryClient();
  } catch (error) {
    console.warn('useFeatureAccess: Query context not ready yet');
    return { canAccess: false, accessLevel: null, isLoading: false, error: null };
  }

  return useQuery({
    queryKey: ['feature-access', featureKey, requiredLevel],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { canAccess: false, accessLevel: null };
      }

      const { data, error } = await supabase.rpc('can_access_feature', {
        _user_id: user.id,
        _feature_key: featureKey,
        _required_level: requiredLevel
      });

      if (error) {
        console.error('Error checking feature access:', error);
        return { canAccess: false, accessLevel: null };
      }

      const result = data?.[0];
      return {
        canAccess: result?.can_access || false,
        accessLevel: result?.access_level || null,
        company: result?.company || null
      };
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    enabled: !!featureKey
  });
};

// Hook to get all features the current user can access
export const useUserFeatures = () => {
  // Defensive check for query client availability during HMR
  try {
    useQueryClient();
  } catch (error) {
    console.warn('useUserFeatures: Query context not ready yet');
    return { data: [], isLoading: false, error: null };
  }

  return useQuery({
    queryKey: ['user-accessible-features'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return [];
      }

      const { data, error } = await supabase.rpc('get_user_accessible_features', {
        _user_id: user.id
      });

      if (error) {
        console.error('Error fetching user features:', error);
        return [];
      }

      return data || [];
    },
    staleTime: 5 * 60 * 1000
  });
};

// Hook to get all feature definitions (for admin)
export const useFeatureDefinitions = () => {
  return useQuery({
    queryKey: ['feature-definitions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feature_definitions')
        .select('*')
        .eq('is_active', true)
        .order('category')
        .order('feature_name');

      if (error) {
        console.error('Error fetching feature definitions:', error);
        throw error;
      }

      return data || [];
    }
  });
};

// Hook to get role-feature access mappings (for admin)
export const useRoleFeatureAccess = (role = null) => {
  return useQuery({
    queryKey: ['role-feature-access', role],
    queryFn: async () => {
      let query = supabase
        .from('role_feature_access')
        .select('*');

      if (role) {
        query = query.eq('role', role);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching role feature access:', error);
        throw error;
      }

      return data || [];
    }
  });
};

export default useFeatureAccess;
