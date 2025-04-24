
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBukomeroDairyData } from '@/hooks/useBukomeroDairyData';

const BukomeroOverview = () => {
  const { farmMetrics, isLoading, error, refreshMetrics } = useBukomeroDairyData();

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Bukomero Dairy Farm Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-red-500">
              <p>Error loading farm data.</p>
              <button 
                onClick={refreshMetrics} 
                className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Retry
              </button>
            </div>
          ) : isLoading ? (
            <p>Loading farm metrics...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium text-lg">Total Cattle</h3>
                <p className="text-2xl font-bold">{farmMetrics?.totalCattle || "N/A"}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium text-lg">Milk Production</h3>
                <p className="text-2xl font-bold">{farmMetrics?.milkProduction || "N/A"}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium text-lg">Fattening Program</h3>
                <p className="text-2xl font-bold">{farmMetrics?.activeFattening || "N/A"} active</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BukomeroOverview;
