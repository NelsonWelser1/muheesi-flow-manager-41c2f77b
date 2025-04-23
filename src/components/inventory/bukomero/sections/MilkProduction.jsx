
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBukomeroDairyData } from "@/hooks/useBukomeroDairyData";

const BukomeroMilkProduction = () => {
  const { farmMetrics, isLoading, error } = useBukomeroDairyData();
  
  if (isLoading) {
    return <div className="p-6">Loading milk production data...</div>;
  }
  
  if (error) {
    return <div className="p-6 text-red-500">Error loading milk production data: {error.message}</div>;
  }
  
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Milk Production</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Daily Average</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{farmMetrics?.milkProduction || "0 liters/day"}</div>
            <p className="text-xs text-muted-foreground">Past 7 days</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Quality Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">A+</div>
            <p className="text-xs text-muted-foreground">Latest test results</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Milking Cows</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">Currently in rotation</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Milk Collection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium">Morning Collection</p>
                <p className="text-sm text-muted-foreground">23 Apr, 2025</p>
              </div>
              <div className="text-blue-600 font-medium">185 liters</div>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium">Evening Collection</p>
                <p className="text-sm text-muted-foreground">22 Apr, 2025</p>
              </div>
              <div className="text-blue-600 font-medium">168 liters</div>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium">Morning Collection</p>
                <p className="text-sm text-muted-foreground">22 Apr, 2025</p>
              </div>
              <div className="text-blue-600 font-medium">172 liters</div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Evening Collection</p>
                <p className="text-sm text-muted-foreground">21 Apr, 2025</p>
              </div>
              <div className="text-blue-600 font-medium">160 liters</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BukomeroMilkProduction;
