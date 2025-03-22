
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const StockMap = ({ locationData }) => {
  const getUtilizationColor = (current, max) => {
    const ratio = current / max;
    if (ratio < 0.3) return 'bg-red-200';
    if (ratio < 0.6) return 'bg-amber-200';
    return 'bg-green-200';
  };
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {locationData.map((location, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <h3 className="font-medium mb-2">{location.name}</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center text-sm mb-1">
                    <span>Stock Utilization:</span>
                    <span className="font-medium">
                      {Math.round((location.stockLevel / location.maxCapacity) * 100)}%
                    </span>
                  </div>
                  <Progress 
                    value={(location.stockLevel / location.maxCapacity) * 100} 
                    className={`h-2 ${getUtilizationColor(location.stockLevel, location.maxCapacity)}`}
                  />
                </div>
                
                <div className="text-sm">
                  <div className="flex justify-between">
                    <span>Current Stock:</span>
                    <span className="font-medium">{location.stockLevel} units</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Maximum Capacity:</span>
                    <span className="font-medium">{location.maxCapacity} units</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Available Space:</span>
                    <span className="font-medium">{location.maxCapacity - location.stockLevel} units</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-4 p-4 bg-gray-50 rounded-lg text-center">
        <p className="text-sm text-muted-foreground">
          Interactive geographical map visualization coming soon. This feature will show stock distribution across all locations with real-time updates.
        </p>
      </div>
    </div>
  );
};

export default StockMap;
