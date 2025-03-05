
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DailyProduction from './DailyProduction';
import QualityMetrics from './QualityMetrics';
import SalesOverview from './SalesOverview';
import ProductionTable from './components/ProductionTable';
import { useDairyProductionData } from './hooks/useDairyProductionData';

const DairyManagement = () => {
  const { productions, isLoading } = useDairyProductionData();
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Dairy Products Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DailyProduction />
            <QualityMetrics />
            <SalesOverview />
          </div>
          
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Recent Production Records</h3>
            <ProductionTable productions={productions} isLoading={isLoading} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DairyManagement;
