
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Truck, Package, Clock, AlertTriangle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/supabase";

const LogisticsDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

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
          <CardTitle>Logistics & Distribution Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="deliveries">Deliveries</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { date: '2024-03-01', deliveries: 24 },
                    { date: '2024-03-02', deliveries: 31 },
                    { date: '2024-03-03', deliveries: 28 },
                    { date: '2024-03-04', deliveries: 35 },
                    { date: '2024-03-05', deliveries: 29 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="deliveries" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="deliveries">
              <div className="text-center text-muted-foreground">
                Delivery management module coming soon...
              </div>
            </TabsContent>

            <TabsContent value="orders">
              <div className="text-center text-muted-foreground">
                Order management module coming soon...
              </div>
            </TabsContent>

            <TabsContent value="performance">
              <div className="text-center text-muted-foreground">
                Performance analytics module coming soon...
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LogisticsDashboard;
