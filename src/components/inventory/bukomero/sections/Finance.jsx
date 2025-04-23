
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBukomeroDairyData } from "@/hooks/useBukomeroDairyData";

const BukomeroFinance = () => {
  const { farmMetrics, isLoading, error } = useBukomeroDairyData();
  
  if (isLoading) {
    return <div className="p-6">Loading financial data...</div>;
  }
  
  if (error) {
    return <div className="p-6 text-red-500">Error loading financial data: {error.message}</div>;
  }
  
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Financial Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Revenue (Monthly)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">UGX 2,450,000</div>
            <p className="text-xs text-muted-foreground">+4.5% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Expenses (Monthly)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">UGX 1,280,000</div>
            <p className="text-xs text-muted-foreground">-2.1% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">UGX 1,170,000</div>
            <p className="text-xs text-muted-foreground">+8.2% from last month</p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium">Milk Sales - Kampala Distributor</p>
                <p className="text-sm text-muted-foreground">22 Apr, 2025</p>
              </div>
              <div className="text-green-600 font-medium">+UGX 840,000</div>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium">Cattle Feed Purchase</p>
                <p className="text-sm text-muted-foreground">20 Apr, 2025</p>
              </div>
              <div className="text-red-600 font-medium">-UGX 350,000</div>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium">Equipment Maintenance</p>
                <p className="text-sm text-muted-foreground">18 Apr, 2025</p>
              </div>
              <div className="text-red-600 font-medium">-UGX 120,000</div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Milk Sales - Local Market</p>
                <p className="text-sm text-muted-foreground">15 Apr, 2025</p>
              </div>
              <div className="text-green-600 font-medium">+UGX 560,000</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BukomeroFinance;
