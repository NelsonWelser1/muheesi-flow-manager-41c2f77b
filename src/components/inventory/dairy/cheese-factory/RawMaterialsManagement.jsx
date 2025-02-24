
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDairyCoolerData } from '@/hooks/useDairyCoolerData';
import InventoryDashboard from './dashboard/InventoryDashboard';
import ItemManagementPanel from './item-management/ItemManagementPanel';

// Mock data structure for different time ranges
const generateTimeRangeData = (data) => {
  if (!data || data.length === 0) return { daily: [], monthly: [], yearly: [] };

  const daily = data.map(item => ({
    ...item,
    date: new Date(item.created_at).toLocaleDateString()
  }));

  // Group by month
  const monthly = Object.values(daily.reduce((acc, item) => {
    const month = new Date(item.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    if (!acc[month]) {
      acc[month] = {
        date: month,
        type: item.type,
        quantity: 0,
        protein: 0,
        fat: 0,
        count: 0
      };
    }
    acc[month].quantity += Number(item.quantity) || 0;
    acc[month].protein += Number(item.protein) || 0;
    acc[month].fat += Number(item.fat) || 0;
    acc[month].count += 1;
    return acc;
  }, {})).map(item => ({
    ...item,
    protein: (item.protein / item.count).toFixed(2),
    fat: (item.fat / item.count).toFixed(2)
  }));

  // Group by year
  const yearly = Object.values(daily.reduce((acc, item) => {
    const year = new Date(item.created_at).getFullYear().toString();
    if (!acc[year]) {
      acc[year] = {
        date: year,
        type: item.type,
        quantity: 0,
        protein: 0,
        fat: 0,
        count: 0
      };
    }
    acc[year].quantity += Number(item.quantity) || 0;
    acc[year].protein += Number(item.protein) || 0;
    acc[year].fat += Number(item.fat) || 0;
    acc[year].count += 1;
    return acc;
  }, {})).map(item => ({
    ...item,
    protein: (item.protein / item.count).toFixed(2),
    fat: (item.fat / item.count).toFixed(2)
  }));

  return { daily, monthly, yearly };
};

const RawMaterialsManagement = () => {
  const [timeRange, setTimeRange] = useState('daily');
  const [selectedMilkType, setSelectedMilkType] = useState('all');
  const [filteredData, setFilteredData] = useState([]);
  const { data: coolerData, isLoading } = useDairyCoolerData();

  useEffect(() => {
    if (coolerData) {
      console.log('Processing cooler data:', coolerData);
      const timeRangeData = generateTimeRangeData(coolerData);
      console.log('Generated time range data:', timeRangeData);
      
      let data = timeRangeData[timeRange] || [];
      
      if (selectedMilkType !== 'all') {
        data = data.filter(item => item.type === selectedMilkType);
      }
      
      setFilteredData(data);
    }
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
              {isLoading ? (
                <div>Loading...</div>
              ) : (
                <>
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
                </>
              )}
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
