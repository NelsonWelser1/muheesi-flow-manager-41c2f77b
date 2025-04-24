
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBukomeroDairyData } from '@/hooks/useBukomeroDairyData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Analytics = () => {
  const { farmMetrics, isLoading, error } = useBukomeroDairyData();

  // Example data for charts
  const milkData = [
    { month: 'Jan', production: 1450 },
    { month: 'Feb', production: 1380 },
    { month: 'Mar', production: 1520 },
    { month: 'Apr', production: 1400 },
    { month: 'May', production: 1350 },
    { month: 'Jun', production: 1250 },
    { month: 'Jul', production: 1150 },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Farm Analytics</h2>
      
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md">Milk Production</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{farmMetrics?.milkProduction || "N/A"}</div>
            <p className="text-xs text-muted-foreground">Average daily production</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md">Total Cattle</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{farmMetrics?.totalCattle || "0"}</div>
            <p className="text-xs text-muted-foreground">Across all categories</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md">Fattening Program</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{farmMetrics?.activeFattening || "0"}</div>
            <p className="text-xs text-muted-foreground">Cattle in active fattening</p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Milk Production Trends</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={milkData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="production" name="Milk (Liters)" fill="#4ade80" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
