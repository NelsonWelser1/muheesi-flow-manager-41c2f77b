
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Clock, Fuel, Package, Award } from 'lucide-react';

const PerformanceAnalytics = () => {
  const deliveryPerformanceData = [
    { month: 'Jan', onTime: 92, delayed: 8, efficiency: 88 },
    { month: 'Feb', onTime: 94, delayed: 6, efficiency: 91 },
    { month: 'Mar', onTime: 96, delayed: 4, efficiency: 94 },
    { month: 'Apr', onTime: 93, delayed: 7, efficiency: 89 },
    { month: 'May', onTime: 97, delayed: 3, efficiency: 96 },
    { month: 'Jun', onTime: 95, delayed: 5, efficiency: 93 }
  ];

  const costAnalysisData = [
    { category: 'Fuel', cost: 45000, percentage: 35 },
    { category: 'Maintenance', cost: 25000, percentage: 20 },
    { category: 'Labor', cost: 35000, percentage: 27 },
    { category: 'Insurance', cost: 15000, percentage: 12 },
    { category: 'Other', cost: 8000, percentage: 6 }
  ];

  const fleetUtilizationData = [
    { vehicle: 'VH001', utilization: 87, distance: 2340, revenue: 12500 },
    { vehicle: 'VH002', utilization: 92, distance: 2890, revenue: 15200 },
    { vehicle: 'VH003', utilization: 78, distance: 1980, revenue: 9800 },
    { vehicle: 'VH004', utilization: 85, distance: 2150, revenue: 11300 },
    { vehicle: 'VH005', utilization: 90, distance: 2650, revenue: 14100 }
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Performance Analytics</h3>
          <p className="text-sm text-muted-foreground">Comprehensive logistics performance insights</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivery Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">95.2%</div>
            <p className="text-xs text-muted-foreground">+2.3% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fleet Efficiency</CardTitle>
            <Fuel className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">86.4%</div>
            <p className="text-xs text-muted-foreground">+1.8% improvement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost per Mile</CardTitle>
            <TrendingDown className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">$2.34</div>
            <p className="text-xs text-muted-foreground">-8.2% reduction</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
            <Award className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">4.7/5</div>
            <p className="text-xs text-muted-foreground">Based on 1,247 reviews</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Delivery Performance Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={deliveryPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="onTime" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="On-Time (%)"
                />
                <Line 
                  type="monotone" 
                  dataKey="efficiency" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name="Efficiency (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cost Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={costAnalysisData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} ${percentage}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="cost"
                >
                  {costAnalysisData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Cost']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Fleet Utilization Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={fleetUtilizationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="vehicle" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="utilization" fill="#3B82F6" name="Utilization (%)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Performing Routes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Kampala - Mbarara</span>
              <span className="text-sm font-semibold text-green-600">98.5%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Kazo - Kiruhura</span>
              <span className="text-sm font-semibold text-green-600">97.2%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Entebbe - Jinja</span>
              <span className="text-sm font-semibold text-green-600">96.8%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Driver Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Sarah Namuli</span>
              <span className="text-sm font-semibold text-blue-600">4.9/5</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">John Mukasa</span>
              <span className="text-sm font-semibold text-blue-600">4.8/5</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Peter Okello</span>
              <span className="text-sm font-semibold text-blue-600">4.7/5</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Monthly Targets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">On-Time Delivery</span>
              <span className="text-sm font-semibold">95.2% / 95%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Cost Reduction</span>
              <span className="text-sm font-semibold">8.2% / 5%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Fleet Utilization</span>
              <span className="text-sm font-semibold">86.4% / 85%</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PerformanceAnalytics;
