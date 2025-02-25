
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Truck, Package, Clock, AlertCircle } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/supabase";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const LogisticsDashboard = () => {
  const { data: deliveryStats = {} } = useQuery({
    queryKey: ['deliveryStats'],
    queryFn: async () => {
      const { data } = await supabase
        .from('logistics_delivery_management')
        .select('*');
      
      return {
        active: data?.filter(d => d.status === 'Active').length || 0,
        completed: data?.filter(d => d.status === 'Completed').length || 0,
        pending: data?.filter(d => d.status === 'Pending').length || 0,
        delayed: data?.filter(d => d.status === 'Delayed').length || 0
      };
    }
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Deliveries</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deliveryStats.active}</div>
            <p className="text-xs text-muted-foreground">In transit</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deliveryStats.completed}</div>
            <p className="text-xs text-muted-foreground">Successfully delivered</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deliveryStats.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting dispatch</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Delayed</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deliveryStats.delayed}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Delivery Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={[
                  { date: 'Mon', deliveries: 12 },
                  { date: 'Tue', deliveries: 15 },
                  { date: 'Wed', deliveries: 18 },
                  { date: 'Thu', deliveries: 14 },
                  { date: 'Fri', deliveries: 20 },
                  { date: 'Sat', deliveries: 16 },
                  { date: 'Sun', deliveries: 10 },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="deliveries" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="active" className="space-y-4">
            <TabsList>
              <TabsTrigger value="active">Active Deliveries</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="active">
              <div className="text-center text-gray-500 py-4">
                Active deliveries will be displayed here
              </div>
            </TabsContent>

            <TabsContent value="scheduled">
              <div className="text-center text-gray-500 py-4">
                Scheduled deliveries will be displayed here
              </div>
            </TabsContent>

            <TabsContent value="history">
              <div className="text-center text-gray-500 py-4">
                Delivery history will be displayed here
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LogisticsDashboard;
