import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, PieChart, Pie, ResponsiveContainer, Cell, XAxis, YAxis, Tooltip } from 'recharts';
import { AlertTriangle, Package, AlertCircle } from "lucide-react";

const mockData = {
  stockLevels: [
    { section: 'Milk Reception', value: 75 },
    { section: 'Processing', value: 45 },
    { section: 'Packaging', value: 60 },
    { section: 'Lab', value: 80 },
  ],
  inventoryValue: [
    { name: 'Milk Reception', value: 30000 },
    { name: 'Processing', value: 45000 },
    { name: 'Packaging', value: 25000 },
    { name: 'Lab', value: 15000 },
  ],
  alerts: [
    { type: 'low', item: 'Milk Cans', section: 'Milk Reception' },
    { type: 'critical', item: 'Packaging Materials', section: 'Packaging' },
    { type: 'expiring', item: 'Lab Reagents', section: 'Lab' },
  ]
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const InventoryDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stock Levels Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Stock Levels by Section</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockData.stockLevels}>
                  <XAxis dataKey="section" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Value Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory Value Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockData.inventoryValue}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {mockData.inventoryValue.map((entry, index) => (
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

      {/* Alerts Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Active Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockData.alerts.map((alert, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg flex items-center gap-3 ${
                  alert.type === 'critical' ? 'bg-red-100 text-red-800' :
                  alert.type === 'low' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-orange-100 text-orange-800'
                }`}
              >
                {alert.type === 'critical' ? (
                  <AlertCircle className="h-5 w-5" />
                ) : (
                  <Package className="h-5 w-5" />
                )}
                <div>
                  <p className="font-medium">{alert.item}</p>
                  <p className="text-sm">{alert.section}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryDashboard;