
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBukomeroDairyData } from "@/hooks/useBukomeroDairyData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const BukomeroMilkProduction = () => {
  const { farmMetrics, isLoading, error } = useBukomeroDairyData();
  
  if (isLoading) {
    return <div className="p-6">Loading milk production data...</div>;
  }
  
  if (error) {
    return <div className="p-6 text-red-500">Error loading milk production data: {error.message}</div>;
  }
  
  // Sample data for the chart
  const productionData = [
    { name: '17 Apr', volume: 480 },
    { name: '18 Apr', volume: 520 },
    { name: '19 Apr', volume: 490 },
    { name: '20 Apr', volume: 510 },
    { name: '21 Apr', volume: 530 },
    { name: '22 Apr', volume: 525 },
    { name: '23 Apr', volume: 540 },
  ];
  
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Milk Production</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Daily Average</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{farmMetrics?.milkProduction || '0 liters'}</div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Quality Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Grade A</div>
            <p className="text-xs text-muted-foreground">Last testing: 22 Apr, 2025</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Productive Cows</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">Of milking herd</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Weekly Production (Liters)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="volume" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Milk Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium">Grand Berna Dairies Delivery</p>
                <p className="text-sm text-muted-foreground">23 Apr, 2025</p>
              </div>
              <div className="font-medium">280 liters</div>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium">Local Market Sales</p>
                <p className="text-sm text-muted-foreground">22 Apr, 2025</p>
              </div>
              <div className="font-medium">120 liters</div>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium">Processing for Yogurt</p>
                <p className="text-sm text-muted-foreground">22 Apr, 2025</p>
              </div>
              <div className="font-medium">90 liters</div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Internal Consumption</p>
                <p className="text-sm text-muted-foreground">22 Apr, 2025</p>
              </div>
              <div className="font-medium">50 liters</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BukomeroMilkProduction;
