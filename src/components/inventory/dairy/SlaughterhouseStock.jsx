import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const mockData = [
  { date: '2024-01', processed: 150, inventory: 120 },
  { date: '2024-02', processed: 200, inventory: 160 },
  { date: '2024-03', processed: 180, inventory: 140 },
];

const SlaughterhouseStock = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Slaughterhouse Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="space-y-4">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="processed" 
                      stroke="#8884d8" 
                      name="Processed Animals"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="inventory" 
                      stroke="#82ca9d" 
                      name="Inventory Levels"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="processing">
            <div>
              <h3 className="text-lg font-semibold">Processing Overview</h3>
              <p>Animal processing data and controls will be implemented here.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="inventory">
            <div>
              <h3 className="text-lg font-semibold">Inventory Overview</h3>
              <p>Product inventory management will be implemented here.</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SlaughterhouseStock;