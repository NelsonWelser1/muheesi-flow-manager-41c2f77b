
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBukomeroDairyData } from "@/hooks/useBukomeroDairyData";

const BukomeroCattle = () => {
  const { farmMetrics, isLoading, error } = useBukomeroDairyData();
  
  if (isLoading) {
    return <div className="p-6">Loading cattle data...</div>;
  }
  
  if (error) {
    return <div className="p-6 text-red-500">Error loading cattle data: {error.message}</div>;
  }
  
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Cattle Management</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Cattle</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{farmMetrics?.totalCattle || 0}</div>
            <p className="text-xs text-muted-foreground">Active inventory</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Fattening Program</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{farmMetrics?.activeFattening || 0}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Health Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Good</div>
            <p className="text-xs text-muted-foreground">Overall herd health</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Cattle Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium">Vaccination Campaign</p>
                <p className="text-sm text-muted-foreground">21 Apr, 2025</p>
              </div>
              <div className="text-blue-600 font-medium">15 cattle</div>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium">New Bull Added</p>
                <p className="text-sm text-muted-foreground">18 Apr, 2025</p>
              </div>
              <div className="text-green-600 font-medium">Tag: BUK-7745</div>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium">Weight Measurement</p>
                <p className="text-sm text-muted-foreground">15 Apr, 2025</p>
              </div>
              <div className="text-blue-600 font-medium">12 cattle</div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Health Check</p>
                <p className="text-sm text-muted-foreground">12 Apr, 2025</p>
              </div>
              <div className="text-green-600 font-medium">All clear</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BukomeroCattle;
