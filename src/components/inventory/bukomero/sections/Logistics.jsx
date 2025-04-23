
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBukomeroDairyData } from "@/hooks/useBukomeroDairyData";

const BukomeroLogistics = () => {
  const { isLoading, error } = useBukomeroDairyData();
  
  if (isLoading) {
    return <div className="p-6">Loading logistics data...</div>;
  }
  
  if (error) {
    return <div className="p-6 text-red-500">Error loading logistics data: {error.message}</div>;
  }
  
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Farm Logistics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Milk Deliveries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Feed Deliveries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Vehicle Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Operational</div>
            <p className="text-xs text-muted-foreground">All 3 vehicles</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Transport Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium">Milk Transport to Processor</p>
                <p className="text-sm text-muted-foreground">23 Apr, 2025</p>
              </div>
              <div className="text-blue-600 font-medium">350 liters</div>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium">Feed Delivery from Supplier</p>
                <p className="text-sm text-muted-foreground">21 Apr, 2025</p>
              </div>
              <div className="text-green-600 font-medium">2 tons</div>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium">Cattle Transport to Market</p>
                <p className="text-sm text-muted-foreground">18 Apr, 2025</p>
              </div>
              <div className="text-blue-600 font-medium">5 bulls</div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Equipment Delivery</p>
                <p className="text-sm text-muted-foreground">15 Apr, 2025</p>
              </div>
              <div className="text-green-600 font-medium">Milking machine parts</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BukomeroLogistics;
