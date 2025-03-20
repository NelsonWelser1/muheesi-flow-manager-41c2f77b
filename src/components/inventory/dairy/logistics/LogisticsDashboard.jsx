
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Package, Clock, AlertTriangle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/supabase";

// Import form components
import DeliveryManagementForm from './forms/DeliveryManagementForm';
import OrderEntryForm from './forms/OrderEntryForm';
import PerformanceAnalyticsForm from './forms/PerformanceAnalyticsForm';

// Import records view component
import LogisticsRecordsView from './records/LogisticsRecordsView';
import DeliveriesRecordsView from './records/views/DeliveriesRecordsView';

const LogisticsDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeComponent, setActiveComponent] = useState(null);

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

  // Return to main dashboard
  const handleBack = () => {
    setActiveComponent(null);
  };

  // Render active component or selection tiles
  const renderContent = () => {
    if (activeComponent === 'deliveries') {
      return (
        <>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Delivery Management</h3>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setActiveComponent('view-deliveries')}
              className="flex items-center gap-2"
            >
              View Delivery Records
            </Button>
          </div>
          <DeliveryManagementForm />
        </>
      );
    } else if (activeComponent === 'view-deliveries') {
      return <DeliveriesRecordsView onBack={() => setActiveComponent('deliveries')} />;
    } else if (activeComponent === 'orders') {
      return (
        <>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Order Entry</h3>
          </div>
          <OrderEntryForm />
        </>
      );
    } else if (activeComponent === 'performance') {
      return (
        <>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Performance Analytics</h3>
          </div>
          <PerformanceAnalyticsForm />
        </>
      );
    } else if (activeComponent === 'records') {
      return <LogisticsRecordsView />;
    }

    // Display component selection tiles
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card 
          className="hover:shadow-lg transition-shadow cursor-pointer" 
          onClick={() => setActiveComponent('deliveries')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-medium">Deliveries</CardTitle>
            <Truck className="h-6 w-6 text-blue-600" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Manage delivery schedules, vehicle assignments, and tracking
            </p>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="bg-blue-50 p-2 rounded-md">
                <div className="text-lg font-semibold">{activeDeliveries}</div>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
              <div className="bg-red-50 p-2 rounded-md">
                <div className="text-lg font-semibold">{delayedDeliveries}</div>
                <p className="text-xs text-muted-foreground">Delayed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="hover:shadow-lg transition-shadow cursor-pointer" 
          onClick={() => setActiveComponent('orders')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-medium">Orders</CardTitle>
            <Package className="h-6 w-6 text-green-600" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Process customer orders, manage allocations and fulfillment
            </p>
            <div className="bg-green-50 p-2 rounded-md">
              <div className="text-lg font-semibold">{pendingOrders}</div>
              <p className="text-xs text-muted-foreground">Pending Orders</p>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="hover:shadow-lg transition-shadow cursor-pointer" 
          onClick={() => setActiveComponent('performance')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-medium">Performance</CardTitle>
            <Clock className="h-6 w-6 text-purple-600" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Track delivery time, efficiency metrics, and logistics analytics
            </p>
            <div className="bg-purple-50 p-2 rounded-md">
              <div className="text-lg font-semibold">{avgDeliveryTime}m</div>
              <p className="text-xs text-muted-foreground">Avg. Delivery Time</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
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

      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Logistics & Distribution Management</span>
            {!activeComponent && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setActiveComponent('records')}
                className="flex items-center gap-2"
              >
                View All Records
              </Button>
            )}
            {activeComponent && activeComponent !== 'records' && activeComponent !== 'view-deliveries' && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleBack}
                className="flex items-center gap-2"
              >
                ← Back to All Options
              </Button>
            )}
            {activeComponent === 'records' && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleBack}
                className="flex items-center gap-2"
              >
                ← Back to Management
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
};

export default LogisticsDashboard;
