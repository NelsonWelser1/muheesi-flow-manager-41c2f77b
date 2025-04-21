
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';

/**
 * Custom hook for managing CEO Dashboard data
 * Optimized for performance with memoization and efficient data processing
 */
export const useCEODashboardData = () => {
  const queryClient = useQueryClient();

  // Fetch dashboard data with proper error handling and caching
  const fetchDashboardData = async () => {
    console.log('Fetching CEO dashboard data from Supabase');
    try {
      const { data, error } = await supabase
        .from('ceo_dashboard_data')
        .select('*')
        .not('company', 'eq', 'Fresheco Farming Limited')
        .order('created_at', { ascending: false })
        .limit(500);

      if (error) {
        console.error('Error fetching CEO dashboard data:', error);
        throw error;
      }

      console.log('Fetched CEO dashboard data:', data);
      return data || [];
    } catch (error) {
      console.error('Error in fetchDashboardData:', error);
      throw error;
    }
  };

  // Add new dashboard data with proper validation
  const addDashboardData = async (newData) => {
    console.log('Adding new CEO dashboard data:', newData);
    
    try {
      // Skip data for Fresheco Farming
      if (newData.company === 'Fresheco Farming Limited') {
        console.log('Skipping data for Fresheco Farming Limited');
        return null;
      }
      
      const { data, error } = await supabase
        .from('ceo_dashboard_data')
        .insert([newData])
        .select()
        .single();

      if (error) {
        console.error('Error adding CEO dashboard data:', error);
        throw error;
      }

      console.log('Successfully added CEO dashboard data:', data);
      return data;
    } catch (error) {
      console.error('Error in addDashboardData:', error);
      throw error;
    }
  };

  // Optimized data processing with fallback values
  const processDashboardData = (data) => {
    // Initialize empty result structure with default values
    const result = {
      companies: [],
      sales: [],
      inventory: [],
      operations: [],
      personnel: [],
      finance: [],
      recentActivity: [],
      metrics: {
        totalRevenue: 0,
        totalSales: 0,
        activeProjects: 0,
        employeeCount: 0,
        inventoryValue: 0,
        pendingApprovals: 0
      }
    };
    
    // Return default structure if no data is available
    if (!data || !Array.isArray(data) || data.length === 0) {
      return result;
    }

    // Process data efficiently
    data.forEach(item => {
      // Add to recent activity if it has a timestamp
      if (item.created_at) {
        result.recentActivity.push({
          id: item.id,
          type: item.data_type,
          company: item.company,
          module: item.module,
          summary: generateSummary(item),
          timestamp: item.created_at
        });
      }
      
      // Categorize data by type
      switch(item.data_type) {
        case 'sales':
          result.sales.push(item);
          if (item.data?.unitPrice && item.data?.quantity) {
            result.metrics.totalRevenue += item.data.unitPrice * item.data.quantity;
            result.metrics.totalSales++;
          }
          break;
        case 'inventory':
          result.inventory.push(item);
          if (item.data?.value) {
            result.metrics.inventoryValue += item.data.value;
          }
          break;
        case 'operations':
          result.operations.push(item);
          if (item.data?.status === 'active') {
            result.metrics.activeProjects++;
          }
          break;
        case 'personnel':
          result.personnel.push(item);
          if (item.data?.count) {
            result.metrics.employeeCount += item.data.count;
          }
          break;
        case 'finance':
          result.finance.push(item);
          break;
        case 'approval':
          if (item.data?.status === 'pending') {
            result.metrics.pendingApprovals++;
          }
          break;
        case 'company':
          // Avoid duplicates
          const existingCompany = result.companies.find(c => c.name === item.company);
          if (!existingCompany) {
            result.companies.push({
              name: item.company,
              data: item.data
            });
          }
          break;
      }
    });
    
    return result;
  };

  // Generate summary text for activity feed
  const generateSummary = (item) => {
    switch(item.data_type) {
      case 'sales':
        return `New sale of ${item.data?.quantity || ''} ${item.data?.product || 'items'} to ${item.data?.customer || 'customer'}`;
      case 'inventory':
        return `Inventory update: ${item.data?.action || 'change'} for ${item.data?.product || 'items'}`;
      case 'operations':
        return `Operations update in ${item.module}`;
      case 'personnel':
        return `Personnel update: ${item.data?.action || ''} ${item.data?.role || 'employee'}`;
      case 'finance':
        return `Financial update: ${item.data?.type || ''} of UGX ${item.data?.amount?.toLocaleString() || ''}`;
      case 'approval':
        return `${item.data?.type || 'Item'} waiting for your approval`;
      default:
        return `Update from ${item.company} - ${item.module}`;
    }
  };

  // Use React Query with optimized configuration
  const { data: rawData, isLoading, error, refetch } = useQuery({
    queryKey: ['ceoDashboardData'],
    queryFn: fetchDashboardData,
    staleTime: 60000, // 1 minute
    cacheTime: 300000, // 5 minutes
    retry: 2,
    onError: (err) => {
      console.error('Query error in useCEODashboardData:', err);
    }
  });

  // Process data once after fetching
  const dashboardData = processDashboardData(rawData);

  // Setup mutation with proper invalidation
  const addDataMutation = useMutation({
    mutationFn: addDashboardData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ceoDashboardData'] });
    },
  });

  return {
    dashboardData,
    isLoading,
    error,
    refetch,
    addDashboardEntry: addDataMutation.mutate,
    rawData
  };
};

export default useCEODashboardData;
