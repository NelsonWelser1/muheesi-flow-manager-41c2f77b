
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBukomeroDairyData } from "@/hooks/useBukomeroDairyData";

const BukomeroOverview = () => {
  const { farmMetrics, isLoading, error, refreshMetrics } = useBukomeroDairyData();
  
  if (isLoading) {
    return <div className="p-6">Loading farm overview...</div>;
  }
  
  if (error) {
    return (
      <div className="p-6">
        <div className="text-red-500 mb-4">Error loading farm data: {error.message}</div>
        <button 
          onClick={refreshMetrics}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Bukomero Dairy Farm Overview</h2>
        <button 
          onClick={refreshMetrics}
          className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full hover:bg-green-200"
        >
          Refresh Data
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Cattle</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{farmMetrics?.totalCattle || 0}</div>
            <p className="text-xs text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Milk Production</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{farmMetrics?.milkProduction || '0 liters/day'}</div>
            <p className="text-xs text-muted-foreground">7-day average</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Farm Manager</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Manager Boaz</div>
            <p className="text-xs text-muted-foreground">+256 772 674060</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Farm Location</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-gray-100 rounded-md text-center">
            <p className="text-lg font-medium">Bukomero, Kyiboga District</p>
            <p className="text-sm text-muted-foreground">Central Uganda</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium">Milk Collection</p>
                <p className="text-sm text-muted-foreground">23 Apr, 2025</p>
              </div>
              <div className="text-blue-600 font-medium">350 liters</div>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium">Cattle Vaccination</p>
                <p className="text-sm text-muted-foreground">20 Apr, 2025</p>
              </div>
              <div className="text-green-600 font-medium">15 cattle</div>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium">Feed Purchase</p>
                <p className="text-sm text-muted-foreground">19 Apr, 2025</p>
              </div>
              <div className="text-red-600 font-medium">UGX 1,200,000</div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Staff Meeting</p>
                <p className="text-sm text-muted-foreground">18 Apr, 2025</p>
              </div>
              <div className="text-blue-600 font-medium">All staff</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BukomeroOverview;
