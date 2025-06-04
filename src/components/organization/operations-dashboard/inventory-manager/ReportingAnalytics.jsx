
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Button } from "@/components/ui/button";
import { BarChart3, FileText, Download, TrendingUp, Clock, Package } from 'lucide-react';

const ReportingAnalytics = () => {
  const inventoryTurnoverData = [
    { month: 'Jan', turnover: 5.8 },
    { month: 'Feb', turnover: 5.9 },
    { month: 'Mar', turnover: 6.1 },
    { month: 'Apr', turnover: 6.3 },
    { month: 'May', turnover: 6.2 },
    { month: 'Jun', turnover: 6.4 }
  ];

  const stockValueData = [
    { category: 'Raw Materials', value: 120000 },
    { category: 'Packaging', value: 45000 },
    { category: 'Finished Goods', value: 85000 },
    { category: 'Supplies', value: 25000 },
    { category: 'Equipment', value: 15000 }
  ];

  const stockMovementData = [
    { month: 'Jan', incoming: 18500, outgoing: 17200 },
    { month: 'Feb', incoming: 19200, outgoing: 18100 },
    { month: 'Mar', incoming: 21000, outgoing: 19800 },
    { month: 'Apr', incoming: 20500, outgoing: 19500 },
    { month: 'May', incoming: 22000, outgoing: 20800 },
    { month: 'Jun', incoming: 23000, outgoing: 21500 }
  ];

  const warehouseUtilizationData = [
    { warehouse: 'WH001', utilization: 85, capacity: 50000 },
    { warehouse: 'WH002', utilization: 67, capacity: 15000 },
    { warehouse: 'WH003', utilization: 92, capacity: 30000 }
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Inventory Analytics</h3>
          <p className="text-sm text-muted-foreground">In-depth inventory performance metrics and trends</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Generate Report
          </Button>
          <Button className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Turnover</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">6.2x</div>
            <p className="text-xs text-muted-foreground">+0.4 from last quarter</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Days</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">58</div>
            <p className="text-xs text-muted-foreground">-5 days improvement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Value</CardTitle>
            <Package className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">$2.8M</div>
            <p className="text-xs text-muted-foreground">+8.3% vs last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Inventory Turnover Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={inventoryTurnoverData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="turnover" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="Turnover Rate"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stock Value by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stockValueData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stockValueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Value']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Stock Movement</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stockMovementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="incoming" fill="#3B82F6" name="Incoming" />
                <Bar dataKey="outgoing" fill="#10B981" name="Outgoing" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Warehouse Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={warehouseUtilizationData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis type="category" dataKey="warehouse" />
                <Tooltip />
                <Bar 
                  dataKey="utilization" 
                  fill="#3B82F6" 
                  name="Utilization (%)" 
                  label={{
                    position: 'right',
                    formatter: (value) => `${value}%` 
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Performance Indicators</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Stock Accuracy</span>
                <span className="text-sm font-medium">98.7%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '98.7%' }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Fill Rate</span>
                <span className="text-sm font-medium">95.2%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '95.2%' }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Perfect Order Rate</span>
                <span className="text-sm font-medium">92.8%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '92.8%' }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Carrying Cost</span>
                <span className="text-sm font-medium">18.5%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '18.5%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Moving Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Arabica Coffee - Bugisu</span>
              <span className="text-sm font-semibold text-green-600">425 units/day</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Pasteurized Milk</span>
              <span className="text-sm font-semibold text-green-600">312 units/day</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Premium Cheese</span>
              <span className="text-sm font-semibold text-green-600">287 units/day</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Slow Moving Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Specialty Equipment Parts</span>
              <span className="text-sm font-semibold text-red-600">3 units/month</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Premium Gift Boxes</span>
              <span className="text-sm font-semibold text-red-600">8 units/month</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Rare Spice Blends</span>
              <span className="text-sm font-semibold text-red-600">12 units/month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm">
              <span className="font-semibold text-blue-600">Optimize:</span> Reduce WH003 stock levels
            </div>
            <div className="text-sm">
              <span className="font-semibold text-green-600">Increase:</span> Arabica Coffee buffer stock
            </div>
            <div className="text-sm">
              <span className="font-semibold text-red-600">Review:</span> Slow-moving specialty items
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportingAnalytics;
