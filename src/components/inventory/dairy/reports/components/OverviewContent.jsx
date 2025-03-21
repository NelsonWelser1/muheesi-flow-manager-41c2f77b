
import React from 'react';
import ReportMetricCards from './ReportMetricCards';
import ProductionChart from './ProductionChart';
import { AlertCircle } from 'lucide-react';

const OverviewContent = ({ reportCounts, productionData, salesData }) => {
  const hasProductionData = productionData && productionData.length > 0;

  return (
    <>
      <ReportMetricCards reportCounts={reportCounts} />

      <div className="mt-8">
        {hasProductionData ? (
          <ProductionChart productionData={productionData} />
        ) : (
          <div className="bg-amber-50 p-6 rounded-lg border border-amber-200 flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            <p className="text-amber-800">No production data available. Please add production records to view the chart.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default OverviewContent;
