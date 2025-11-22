import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useSystemMetrics = () => {
  return useQuery({
    queryKey: ['systemMetrics'],
    queryFn: async () => {
      try {
        // Fetch total users count
        const { count: totalUsers, error: usersError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        if (usersError) throw usersError;

        // Fetch active companies (associations)
        const { count: activeCompanies, error: companiesError } = await supabase
          .from('associations')
          .select('*', { count: 'exact', head: true });

        if (companiesError) throw companiesError;

        // Fetch recent transactions count (last 24 hours)
        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
        
        const { count: dailyTransactions, error: transactionsError } = await supabase
          .from('transactions')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', twentyFourHoursAgo.toISOString());

        if (transactionsError) throw transactionsError;

        // Fetch active alerts from dairy notifications
        const { count: securityAlerts, error: alertsError } = await supabase
          .from('dairy_notifications')
          .select('*', { count: 'exact', head: true })
          .eq('is_read', false)
          .eq('priority', 'high');

        if (alertsError) throw alertsError;

        // Calculate storage usage from various tables (approximate)
        const tables = [
          'profiles', 'cattle_inventory', 'dairy_production', 
          'sales_orders', 'coffee_stock', 'equipment'
        ];
        
        let totalRecords = 0;
        for (const table of tables) {
          const { count } = await supabase
            .from(table)
            .select('*', { count: 'exact', head: true });
          totalRecords += count || 0;
        }

        // Rough estimate: 1KB per record
        const storageMB = (totalRecords * 1) / 1024;
        const storageGB = storageMB / 1024;
        
        return {
          totalUsers: totalUsers || 0,
          activeCompanies: activeCompanies || 0,
          systemUptime: '99.8%', // Could be calculated from system start time
          dataStorage: storageGB > 1 
            ? `${storageGB.toFixed(2)} GB` 
            : `${storageMB.toFixed(0)} MB`,
          dailyTransactions: dailyTransactions || 0,
          securityAlerts: securityAlerts || 0
        };
      } catch (error) {
        console.error('Error fetching system metrics:', error);
        throw error;
      }
    },
    refetchInterval: 30000 // Refetch every 30 seconds
  });
};
