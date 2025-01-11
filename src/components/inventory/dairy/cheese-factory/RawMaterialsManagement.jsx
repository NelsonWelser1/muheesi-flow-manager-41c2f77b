import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Droplet, Beaker, AlertTriangle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDairyCoolerData } from '@/hooks/useDairyCoolerData';

const mockData = {
  milkInventory: [
    { type: 'Cow', quantity: 1000, protein: 3.5, fat: 4.0 },
    { type: 'Goat', quantity: 500, protein: 3.2, fat: 3.8 },
    { type: 'Sheep', quantity: 300, protein: 5.5, fat: 6.0 },
  ],
  starterCultures: [
    { type: 'Mesophilic', quantity: 50, expiryDate: '2024-05-01' },
    { type: 'Thermophilic', quantity: 30, expiryDate: '2024-04-15' },
  ],
  rennet: [
    { type: 'Animal-based', form: 'Liquid', quantity: 20 },
    { type: 'Microbial', form: 'Powder', quantity: 15 },
  ],
  additives: [
    { name: 'Non-iodized Salt', quantity: 500 },
    { name: 'Calcium Chloride', quantity: 100 },
    { name: 'Herbs Mix', quantity: 50 },
  ]
};

// Enhanced historical data structure to include all milk types
const historicalMilkData = {
  daily: [
    { date: '2024-04-01', type: 'Cow', quantity: 1000, protein: 3.5, fat: 4.0 },
    { date: '2024-04-01', type: 'Goat', quantity: 500, protein: 3.2, fat: 3.8 },
    { date: '2024-04-01', type: 'Sheep', quantity: 300, protein: 5.5, fat: 6.0 },
    // Add more daily entries...
  ],
  monthly: [
    { date: '2024-03', type: 'Cow', quantity: 30000, protein: 3.5, fat: 4.0 },
    { date: '2024-03', type: 'Goat', quantity: 15000, protein: 3.2, fat: 3.8 },
    { date: '2024-03', type: 'Sheep', quantity: 9000, protein: 5.5, fat: 6.0 },
    // Add more monthly entries...
  ],
  yearly: [
    { date: '2024', type: 'Cow', quantity: 360000, protein: 3.5, fat: 4.0 },
    { date: '2024', type: 'Goat', quantity: 180000, protein: 3.2, fat: 3.8 },
    { date: '2024', type: 'Sheep', quantity: 108000, protein: 5.5, fat: 6.0 },
    // Add more yearly entries...
  ],
};

const RawMaterialsManagement = () => {
  const [timeRange, setTimeRange] = useState('daily');
  const [selectedMilkType, setSelectedMilkType] = useState('all');
  const [filteredData, setFilteredData] = useState([]);
  const { data: coolerData, isLoading } = useDairyCoolerData();

  useEffect(() => {
    // Filter data based on selected time range and milk type
    let data = historicalMilkData[timeRange];
    
    // If we have cooler data, merge it with historical data
    if (coolerData) {
      console.log('Merging cooler data:', coolerData);
      // Merge logic here - this would combine the historical data with new entries
      data = [...data, ...coolerData];
    }

    if (selectedMilkType !== 'all') {
      data = data.filter(item => item.type === selectedMilkType);
    }
    
    setFilteredData(data);
  }, [timeRange, selectedMilkType, coolerData]);

  const handleTimeRangeChange = (value) => {
    setTimeRange(value);
  };

  const handleMilkTypeChange = (value) => {
    setSelectedMilkType(value);
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Milk Storage</CardTitle>
            <Droplet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,800 L</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cultures</CardTitle>
            <Beaker className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">80 units</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Additives</CardTitle>
            <Beaker className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">650 kg</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3 items</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="milk" className="space-y-4">
        <TabsList>
          <TabsTrigger value="milk">Milk Inventory</TabsTrigger>
          <TabsTrigger value="cultures">Starter Cultures</TabsTrigger>
          <TabsTrigger value="rennet">Rennet</TabsTrigger>
          <TabsTrigger value="additives">Additives</TabsTrigger>
        </TabsList>

        <TabsContent value="milk">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
              <CardTitle>Milk Quality Parameters</CardTitle>
              <div className="flex gap-4">
                <Select value={selectedMilkType} onValueChange={handleMilkTypeChange}>
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
                <Select value={timeRange} onValueChange={handleTimeRangeChange}>
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
        </TabsContent>

        <TabsContent value="cultures">
          <Card>
            <CardHeader>
              <CardTitle>Starter Cultures Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Type</th>
                    <th className="text-left py-2">Quantity</th>
                    <th className="text-left py-2">Expiry Date</th>
                  </tr>
                </thead>
                <tbody>
                  {mockData.starterCultures.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2">{item.type}</td>
                      <td className="py-2">{item.quantity}</td>
                      <td className="py-2">{item.expiryDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rennet">
          <Card>
            <CardHeader>
              <CardTitle>Rennet Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Type</th>
                    <th className="text-left py-2">Form</th>
                    <th className="text-left py-2">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {mockData.rennet.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2">{item.type}</td>
                      <td className="py-2">{item.form}</td>
                      <td className="py-2">{item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="additives">
          <Card>
            <CardHeader>
              <CardTitle>Additives Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Name</th>
                    <th className="text-left py-2">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {mockData.additives.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2">{item.name}</td>
                      <td className="py-2">{item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RawMaterialsManagement;
