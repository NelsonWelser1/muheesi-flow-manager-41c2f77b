
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/supabase";

export const useLogisticsData = () => {
  // Fetch active deliveries
  const { data: activeDeliveries = 0 } = useQuery({
    queryKey: ['activeDeliveries'],
    queryFn: async () => {
      const { count } = await supabase
        .from('logistics_delivery_management')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'In Transit');
      return count || 0;
    }
  });

  // Fetch pending orders
  const { data: pendingOrders = 0 } = useQuery({
    queryKey: ['pendingOrders'],
    queryFn: async () => {
      const { count } = await supabase
        .from('logistics_order_entries')
        .select('*', { count: 'exact', head: true })
        .eq('order_status', 'Pending');
      return count || 0;
    }
  });

  // Fetch average delivery time
  const { data: avgDeliveryTime = '0' } = useQuery({
    queryKey: ['avgDeliveryTime'],
    queryFn: async () => {
      const { data } = await supabase
        .from('logistics_delivery_performance')
        .select('delivery_time')
        .limit(100);
      if (!data?.length) return '0';
      const avg = data.reduce((acc, curr) => acc + curr.delivery_time, 0) / data.length;
      return Math.round(avg).toString();
    }
  });

  // Fetch delayed deliveries
  const { data: delayedDeliveries = 0 } = useQuery({
    queryKey: ['delayedDeliveries'],
    queryFn: async () => {
      const { count } = await supabase
        .from('logistics_delivery_management')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Delayed');
      return count || 0;
    }
  });

  return {
    activeDeliveries,
    pendingOrders,
    avgDeliveryTime,
    delayedDeliveries
  };
};
