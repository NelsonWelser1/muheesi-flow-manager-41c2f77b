
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Package, Clock, AlertTriangle, BarChart3, ClipboardList, TrendingUp } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase";

const LogisticsDashboard = () => {
  const navigate = useNavigate();

  // Fetch active deliveries
  const { data: activeDeliveries = 0 } = useQuery({
    queryKey: ['activeDeliveries'],
    queryFn: async () => {
      try {
        console.log('Fetching active deliveries count...');
        const { count, error } = await supabase
          .from('logistics_deliveries')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'In Transit');
        
        if (error) throw error;
        console.log('Active deliveries count:', count);
        return count || 0;
      } catch (error) {
        console.error('Error fetching active deliveries:', error);
        return 0;
      }
    }
  });

  // Fetch pending orders
  const { data: pendingOrders = 0 } = useQuery({
    queryKey: ['pendingOrders'],
    queryFn: async () => {
      try {
        console.log('Fetching pending orders count...');
        const { count, error } = await supabase
          .from('logistics_order_entries')
          .select('*', { count: 'exact', head: true })
          .eq('order_status', 'Pending');
        
        if (error) throw error;
        console.log('Pending orders count:', count);
        return count || 0;
      } catch (error) {
        console.error('Error fetching pending orders:', error);
        return 0;
      }
    }
  });

  // Fetch average delivery time
  const { data: avgDeliveryTime = '0' } = useQuery({
    queryKey: ['avgDeliveryTime'],
    queryFn: async () => {
      try {
        console.log('Fetching average delivery time...');
        const { data, error } = await supabase
          .from('logistics_delivery_performance')
          .select('delivery_time')
          .limit(100);
        
        if (error) throw error;
        if (!data?.length) return '0';
        const avg = data.reduce((acc, curr) => acc + curr.delivery_time, 0) / data.length;
        console.log('Average delivery time:', avg);
        return Math.round(avg).toString();
      } catch (error) {
        console.error('Error fetching average delivery time:', error);
        return '0';
      }
    }
  });

  // Fetch delayed deliveries
  const { data: delayedDeliveries = 0 } = useQuery({
    queryKey: ['delayedDeliveries'],
    queryFn: async () => {
      try {
        console.log('Fetching delayed deliveries count...');
        const { count, error } = await supabase
          .from('logistics_deliveries')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'Delayed');
        
        if (error) throw error;
        console.log('Delayed deliveries count:', count);
        return count || 0;
      } catch (error) {
        console.error('Error fetching delayed deliveries:', error);
        return 0;
      }
    }
  });

  // Navigation handlers for each module
  const navigateToModule = (module) => {
    navigate(`/manage-inventory/logistics/${module}`);
  };

  return (
    <div className="space-y-6">
      <Button 
        variant="outline" 
        onClick={() => navigate('/manage-inventory')}
        className="mb-4"
      >
        ← Back to Inventory
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Deliveries</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeDeliveries}</div>
            <p className="text-xs text-muted-foreground">{Math.round(activeDeliveries * 0.7)} in transit</p>
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
            <p className="text-xs text-muted-foreground">Based on last 100 deliveries</p>
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

      {/* Module Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigateToModule('overview')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Overview</CardTitle>
            <BarChart3 className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">View logistics performance summary and delivery trends.</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigateToModule('deliveries')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Deliveries</CardTitle>
            <Truck className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Manage active deliveries and delivery schedules.</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigateToModule('orders')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Orders</CardTitle>
            <ClipboardList className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Process and track customer orders and items.</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigateToModule('performance')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Performance</CardTitle>
            <TrendingUp className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Analyze delivery performance and efficiency metrics.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LogisticsDashboard;
