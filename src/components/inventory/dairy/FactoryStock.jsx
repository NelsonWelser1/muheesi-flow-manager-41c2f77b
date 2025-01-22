import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, TrendingUp, AlertCircle, Factory } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const mockData = {
  inventory: [
    { name: 'Cheese', value: 120 },
    { name: 'Yogurt', value: 80 },
    { name: 'Processed Milk', value: 200 },
  ],
  productionLines: [
    { id: 1, name: 'Line A', product: 'Cheese', quantity: 50, manager: 'John Doe' },
    { id: 2, name: 'Line B', product: 'Yogurt', quantity: 30, manager: 'Jane Smith' },
  ],
  alerts: [
    { id: 1, message: 'Low stock alert: Cheese', severity: 'warning' },
    { id: 2, message: 'Line A maintenance due', severity: 'info' },
  ]
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const FactoryStock = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">400 units</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Production Output</CardTitle>
            <Factory className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">80 units</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilization</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">75%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">20 units</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Inventory Levels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockData.inventory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stock Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockData.inventory}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {mockData.inventory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Production Lines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">Line</th>
                  <th className="px-6 py-3">Product</th>
                  <th className="px-6 py-3">Quantity</th>
                  <th className="px-6 py-3">Manager</th>
                </tr>
              </thead>
              <tbody>
                {mockData.productionLines.map((line) => (
                  <tr key={line.id} className="bg-white border-b">
                    <td className="px-6 py-4">{line.name}</td>
                    <td className="px-6 py-4">{line.product}</td>
                    <td className="px-6 py-4">{line.quantity}</td>
                    <td className="px-6 py-4">{line.manager}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockData.alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg ${
                  alert.severity === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'
                }`}
              >
                {alert.message}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FactoryStock;