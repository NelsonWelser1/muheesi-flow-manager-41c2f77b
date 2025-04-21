
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';

export const useCEODashboardData = () => {
  const queryClient = useQueryClient();

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
      return data;
    } catch (error) {
      console.error('Error in fetchDashboardData:', error);
      throw error;
    }
  };

  const addDashboardData = async (newData) => {
    console.log('Adding new CEO dashboard data:', newData);
    
    try {
      // Validate that we're not sending data for Fresheco Farming
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

  // Process data for dashboard display
  const processDashboardData = (data = []) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return {
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
    }

    const companies = [];
    const sales = [];
    const inventory = [];
    const operations = [];
    const personnel = [];
    const finance = [];
    const recentActivity = [];
    
    let totalRevenue = 0;
    let totalSales = 0;
    let activeProjects = 0;
    let employeeCount = 0;
    let inventoryValue = 0;
    let pendingApprovals = 0;
    
    data.forEach(item => {
      if (item.created_at) {
        recentActivity.push({
          id: item.id,
          type: item.data_type,
          company: item.company,
          module: item.module,
          summary: generateSummary(item),
          timestamp: item.created_at
        });
      }
      
      switch(item.data_type) {
        case 'sales':
          sales.push(item);
          if (item.data && item.data.unitPrice && item.data.quantity) {
            totalRevenue += item.data.unitPrice * item.data.quantity;
            totalSales++;
          }
          break;
        case 'inventory':
          inventory.push(item);
          if (item.data && item.data.value) {
            inventoryValue += item.data.value;
          }
          break;
        case 'operations':
          operations.push(item);
          if (item.data && item.data.status === 'active') {
            activeProjects++;
          }
          break;
        case 'personnel':
          personnel.push(item);
          if (item.data && item.data.count) {
            employeeCount += item.data.count;
          }
          break;
        case 'finance':
          finance.push(item);
          break;
        case 'approval':
          if (item.data && item.data.status === 'pending') {
            pendingApprovals++;
          }
          break;
        case 'company':
          const existingCompany = companies.find(c => c.name === item.company);
          if (!existingCompany) {
            companies.push({
              name: item.company,
              data: item.data
            });
          }
          break;
        default:
          break;
      }
    });
    
    return {
      companies,
      sales,
      inventory,
      operations,
      personnel,
      finance,
      recentActivity,
      metrics: {
        totalRevenue,
        totalSales,
        activeProjects,
        employeeCount,
        inventoryValue,
        pendingApprovals
      }
    };
  };

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

  const { data: rawData, isLoading, refetch } = useQuery({
    queryKey: ['ceoDashboardData'],
    queryFn: fetchDashboardData,
    onError: (err) => {
      console.error('Query error in useCEODashboardData:', err);
    }
  });

  const dashboardData = processDashboardData(rawData);

  const addDataMutation = useMutation({
    mutationFn: addDashboardData,
    onSuccess: () => {
      queryClient.invalidateQueries(['ceoDashboardData']);
    },
  });

  return {
    dashboardData,
    isLoading,
    refetch,
    addDashboardEntry: addDataMutation.mutate,
    rawData
  };
};

export default useCEODashboardData;
