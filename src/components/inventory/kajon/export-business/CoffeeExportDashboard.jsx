import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, TrendingUp, Ship, DollarSign, ClipboardList, Globe } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const mockData = {
  sourcing: [
    { month: 'Jan', arabica: 4000, robusta: 2400 },
    { month: 'Feb', arabica: 3000, robusta: 1398 },
    { month: 'Mar', arabica: 2000, robusta: 9800 },
    { month: 'Apr', arabica: 2780, robusta: 3908 },
  ],
  financial: [
    { month: 'Jan', revenue: 4000, expenses: 2400 },
    { month: 'Feb', revenue: 3000, expenses: 1398 },
    { month: 'Mar', revenue: 2000, expenses: 9800 },
    { month: 'Apr', revenue: 2780, expenses: 3908 },
  ]
};

const CoffeeExportDashboard = () => {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['exportDashboard'],
    queryFn: () => Promise.resolve(mockData), // Replace with actual API call
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Sourcing Metrics */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Coffee Sourced
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245.8 MT</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>

        {/* Revenue Metrics */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1.2M</div>
            <p className="text-xs text-muted-foreground">
              +15% from last month
            </p>
          </CardContent>
        </Card>

        {/* Shipping Metrics */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Shipments
            </CardTitle>
            <Ship className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              4 departing this week
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Sourcing Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Sourcing Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dashboardData?.sourcing}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="arabica" stroke="#8884d8" />
                <Line type="monotone" dataKey="robusta" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Financial Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Financial Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardData?.financial}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#8884d8" />
                <Bar dataKey="expenses" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Detailed Metrics Tabs */}
        <Card>
          <CardContent className="pt-6">
            <Tabs defaultValue="sourcing">
              <TabsList className="w-full justify-start overflow-x-auto">
                <TabsTrigger value="sourcing">Sourcing Details</TabsTrigger>
                <TabsTrigger value="processing">Processing Status</TabsTrigger>
                <TabsTrigger value="logistics">Logistics</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="financial">Financial Details</TabsTrigger>
              </TabsList>

              <TabsContent value="sourcing" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Arabica Total</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">125.3 MT</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Robusta Total</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">120.5 MT</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Average Quality Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">85/100</div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="processing" className="space-y-4">
                {/* Processing metrics content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Hulled Coffee</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">98.5 MT</div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="logistics" className="space-y-4">
                {/* Logistics metrics content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">In Transit</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">45.2 MT</div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="orders" className="space-y-4">
                {/* Orders metrics content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Pending Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">8</div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="financial" className="space-y-4">
                {/* Financial metrics content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Monthly Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$320,450</div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CoffeeExportDashboard;