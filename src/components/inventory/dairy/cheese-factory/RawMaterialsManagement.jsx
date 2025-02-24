
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDairyCoolerData } from '@/hooks/useDairyCoolerData';
import InventoryDashboard from './dashboard/InventoryDashboard';
import ItemManagementPanel from './item-management/ItemManagementPanel';

const RawMaterialsManagement = () => {
  const [timeRange, setTimeRange] = useState('daily');
  const [selectedMilkType, setSelectedMilkType] = useState('all');
  const [filteredData, setFilteredData] = useState([]);
  const { data: coolerData, isLoading } = useDairyCoolerData();

  useEffect(() => {
    let data = historicalMilkData[timeRange];
    
    if (coolerData) {
      console.log('Merging cooler data:', coolerData);
      data = [...data, ...coolerData];
    }

    if (selectedMilkType !== 'all') {
      data = data.filter(item => item.type === selectedMilkType);
    }
    
    setFilteredData(data);
  }, [timeRange, selectedMilkType, coolerData]);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="management">Item Management</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
              <CardTitle>Milk Quality Parameters</CardTitle>
              <div className="flex gap-4">
                <Select value={selectedMilkType} onValueChange={e => setSelectedMilkType(e)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select milk type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Cow">Cow Milk</SelectItem>
                    <SelectItem value="Goat">Goat Milk</SelectItem>
                    <SelectItem value="Sheep">Sheep Milk</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={timeRange} onValueChange={e => setTimeRange(e)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select time range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filteredData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="protein" fill="#8884d8" name="Protein %" />
                    <Bar dataKey="fat" fill="#82ca9d" name="Fat %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Date</th>
                      <th className="text-left py-2">Type</th>
                      <th className="text-left py-2">Quantity (L)</th>
                      <th className="text-left py-2">Protein %</th>
                      <th className="text-left py-2">Fat %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2">{item.date}</td>
                        <td className="py-2">{item.type}</td>
                        <td className="py-2">{item.quantity}</td>
                        <td className="py-2">{item.protein}</td>
                        <td className="py-2">{item.fat}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          <InventoryDashboard />
        </TabsContent>

        <TabsContent value="management">
          <ItemManagementPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RawMaterialsManagement;
