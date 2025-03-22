
import React from 'react';
import ReportMetricCards from './ReportMetricCards';
import ProductionChart from './ProductionChart';
import { AlertCircle } from 'lucide-react';
import { Card } from "@/components/ui/card";
import ProductionMetrics from '../../cheese-factory/monitor/ProductionMetrics';

const OverviewContent = ({ reportCounts, productionData, salesData }) => {
  const hasProductionData = productionData && productionData.length > 0;
  
  // Calculate metrics for ProductionMetrics component
  const calculateMetrics = () => {
    if (!hasProductionData) return { activeBatches: [], totalProduction: 0, averageQuality: 0 };
    
    // Get unique batches (assuming each item in productionData represents a batch)
    const activeBatches = productionData.map(item => ({
      id: item.product,
      type: item.product,
      quantity: item.quantity,
      efficiency: item.efficiency || 0
    }));
    
    // Calculate total production
    const totalProduction = productionData.reduce((sum, item) => sum + (item.quantity || 0), 0).toFixed(2);
    
    // Calculate average quality score based on efficiency
    const averageQuality = Math.round(
      productionData.reduce((sum, item) => sum + (item.efficiency || 0), 0) / 
      (productionData.length || 1)
    );
    
    return { activeBatches, totalProduction, averageQuality };
  };
  
  const metrics = calculateMetrics();

  return (
    <>
      <ReportMetricCards reportCounts={reportCounts} />

      <div className="mt-8">
        {hasProductionData ? (
          <>
            <ProductionChart productionData={productionData} />
            <div className="mt-6">
              <ProductionMetrics 
                activeBatches={metrics.activeBatches} 
                totalProduction={metrics.totalProduction} 
                averageQuality={metrics.averageQuality} 
              />
            </div>
          </>
        ) : (
          <Card className="p-6 bg-amber-50 border-amber-200">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              <p className="text-amber-800">No production data available. Please add production records to view the chart.</p>
            </div>
          </Card>
        )}
      </div>
    </>
  );
};

export default OverviewContent;
