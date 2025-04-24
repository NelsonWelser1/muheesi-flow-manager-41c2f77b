
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBukomeroDairyData } from '@/hooks/useBukomeroDairyData';

const BukomeroOverview = () => {
  const { farmMetrics, isLoading, error } = useBukomeroDairyData();
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Bukomero Dairy Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading farm data...</p>
          ) : error ? (
            <p>Error loading data: {error.message}</p>
          ) : farmMetrics ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-md shadow">
                <h3 className="text-lg font-medium">Total Cattle</h3>
                <p className="text-2xl font-bold">{farmMetrics.totalCattle}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-md shadow">
                <h3 className="text-lg font-medium">Milk Production</h3>
                <p className="text-2xl font-bold">{farmMetrics.milkProduction}</p>
              </div>
              <div className="bg-amber-50 p-4 rounded-md shadow">
                <h3 className="text-lg font-medium">Cattle in Fattening</h3>
                <p className="text-2xl font-bold">{farmMetrics.activeFattening}</p>
              </div>
            </div>
          ) : (
            <p>No data available.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BukomeroOverview;
