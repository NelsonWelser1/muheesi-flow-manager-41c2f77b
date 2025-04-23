
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBukomeroDairyData } from "@/hooks/useBukomeroDairyData";

const BukomeroAnalytics = () => {
  const { farmMetrics, isLoading, error } = useBukomeroDairyData();
  
  if (isLoading) {
    return <div className="p-6">Loading analytics data...</div>;
  }
  
  if (error) {
    return <div className="p-6 text-red-500">Error loading analytics data: {error.message}</div>;
  }
  
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Farm Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Efficiency Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">+2.5% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Feed Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">+1.2% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Production Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">UGX 850/L</div>
            <p className="text-xs text-muted-foreground">-3.5% from last month</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium">Milk Yield per Cow</p>
                <p className="text-sm text-muted-foreground">April 2025</p>
              </div>
              <div className="text-blue-600 font-medium">14.2 liters/day</div>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium">Cattle Growth Rate</p>
                <p className="text-sm text-muted-foreground">Q2 2025</p>
              </div>
              <div className="text-green-600 font-medium">0.8 kg/day</div>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium">Calving Rate</p>
                <p className="text-sm text-muted-foreground">Last 12 months</p>
              </div>
              <div className="text-blue-600 font-medium">82%</div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Water Consumption</p>
                <p className="text-sm text-muted-foreground">Daily Average</p>
              </div>
              <div className="text-blue-600 font-medium">45 liters/cow</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BukomeroAnalytics;
