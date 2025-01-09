import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Beef, Tools, AlertCircle, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = {
  dailyProduction: [
    { type: 'Beef', quantity: 250 },
    { type: 'Pork', quantity: 180 },
    { type: 'Goat', quantity: 120 },
  ],
  processingUnits: [
    { id: 1, name: 'Unit A', activity: 'Beef Processing', personnel: 'Team 1', status: 'active' },
    { id: 2, name: 'Unit B', activity: 'Pork Processing', personnel: 'Team 2', status: 'maintenance' },
  ],
  operationLogs: [
    { id: 1, time: '09:00 AM', type: 'Beef', quantity: 50, personnel: 'John Doe' },
    { id: 2, time: '10:30 AM', type: 'Pork', quantity: 30, personnel: 'Jane Smith' },
  ]
};

const SlaughterhouseStock = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processed Today</CardTitle>
            <Beef className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">80 animals</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meat Output</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">550 kg</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Units</CardTitle>
            <Tools className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2/3</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alerts</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daily Production</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockData.dailyProduction}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="quantity" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Processing Units Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">Unit</th>
                  <th className="px-6 py-3">Activity</th>
                  <th className="px-6 py-3">Personnel</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockData.processingUnits.map((unit) => (
                  <tr key={unit.id} className="bg-white border-b">
                    <td className="px-6 py-4">{unit.name}</td>
                    <td className="px-6 py-4">{unit.activity}</td>
                    <td className="px-6 py-4">{unit.personnel}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        unit.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {unit.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Operation Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">Time</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Quantity</th>
                  <th className="px-6 py-3">Personnel</th>
                </tr>
              </thead>
              <tbody>
                {mockData.operationLogs.map((log) => (
                  <tr key={log.id} className="bg-white border-b">
                    <td className="px-6 py-4">{log.time}</td>
                    <td className="px-6 py-4">{log.type}</td>
                    <td className="px-6 py-4">{log.quantity}</td>
                    <td className="px-6 py-4">{log.personnel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SlaughterhouseStock;