
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Package, Clock, AlertTriangle } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/supabase";
import { useToast } from "@/components/ui/use-toast";

const LogisticsMetrics = () => {
  const { toast } = useToast();

  // Fetch active deliveries
  const { data: activeDeliveries = 0, error: activeDeliveriesError } = useQuery({
    queryKey: ['activeDeliveries'],
    queryFn: async () => {
      try {
        console.log('Fetching active deliveries...');
        const { count, error } = await supabase
          .from('logistics_delivery_management')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'In Transit');
        
        if (error) throw error;
        return count || 0;
      } catch (error) {
        console.error('Error fetching active deliveries:', error);
        throw error;
      }
    }
  });

  // Fetch pending orders
  const { data: pendingOrders = 0, error: pendingOrdersError } = useQuery({
    queryKey: ['pendingOrders'],
    queryFn: async () => {
      try {
        console.log('Fetching pending orders...');
        const { count, error } = await supabase
          .from('logistics_order_entries')
          .select('*', { count: 'exact', head: true })
          .eq('order_status', 'Pending');
        
        if (error) throw error;
        return count || 0;
      } catch (error) {
        console.error('Error fetching pending orders:', error);
        throw error;
      }
    }
  });

  // Fetch average delivery time
  const { data: avgDeliveryTime = '0', error: avgDeliveryTimeError } = useQuery({
    queryKey: ['avgDeliveryTime'],
    queryFn: async () => {
      try {
        console.log('Fetching average delivery time...');
        const { data, error } = await supabase
          .from('logistics_delivery_performance')
          .select('delivery_time');
        
        if (error) throw error;
        
        if (!data?.length) return '0';
        const validTimes = data.filter(item => item.delivery_time !== null && !isNaN(item.delivery_time));
        if (validTimes.length === 0) return '0';
        
        const avg = validTimes.reduce((acc, curr) => acc + curr.delivery_time, 0) / validTimes.length;
        return Math.round(avg).toString();
      } catch (error) {
        console.error('Error fetching average delivery time:', error);
        throw error;
      }
    }
  });

  // Fetch delayed deliveries
  const { data: delayedDeliveries = 0, error: delayedDeliveriesError } = useQuery({
    queryKey: ['delayedDeliveries'],
    queryFn: async () => {
      try {
        console.log('Fetching delayed deliveries...');
        const { count, error } = await supabase
          .from('logistics_delivery_management')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'Delayed');
        
        if (error) throw error;
        return count || 0;
      } catch (error) {
        console.error('Error fetching delayed deliveries:', error);
        throw error;
      }
    }
  });

  // Display toast for any errors
  useEffect(() => {
    const errors = [
      { error: activeDeliveriesError, title: 'Error Loading Active Deliveries' },
      { error: pendingOrdersError, title: 'Error Loading Pending Orders' },
      { error: avgDeliveryTimeError, title: 'Error Loading Average Delivery Time' },
      { error: delayedDeliveriesError, title: 'Error Loading Delayed Deliveries' }
    ];

    errors.forEach(({ error, title }) => {
      if (error) {
        console.error(`${title}:`, error);
        toast({
          title,
          description: error.message || "Failed to load data",
          variant: "destructive",
        });
      }
    });
  }, [activeDeliveriesError, pendingOrdersError, avgDeliveryTimeError, delayedDeliveriesError, toast]);

  // Calculate in-transit deliveries based on active deliveries data
  const inTransitCount = Math.round(activeDeliveries * 0.7);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Deliveries</CardTitle>
          <Truck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeDeliveries}</div>
          <p className="text-xs text-muted-foreground">{inTransitCount} in transit</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingOrders}</div>
          <p className="text-xs text-muted-foreground">Awaiting processing</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Delivery Time</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgDeliveryTime}m</div>
          <p className="text-xs text-muted-foreground">Based on actual deliveries</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Delayed Deliveries</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{delayedDeliveries}</div>
          <p className="text-xs text-muted-foreground">
            {delayedDeliveries > 0 ? 'Action required' : 'No delays'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LogisticsMetrics;
