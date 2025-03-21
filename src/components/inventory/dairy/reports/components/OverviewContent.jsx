
import React from 'react';
import ReportMetricCards from './ReportMetricCards';
import ProductionChart from './ProductionChart';
import ReportExportCard from '../ReportExportCard';

const OverviewContent = ({ reportCounts, productionData, salesData }) => {
  return (
    <>
      <ReportMetricCards reportCounts={reportCounts} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-8">
        <div className="lg:col-span-2">
          <ProductionChart productionData={productionData} />
        </div>
        <div>
          <ReportExportCard 
            productionData={productionData}
            salesData={salesData}
          />
        </div>
      </div>
    </>
  );
};

export default OverviewContent;
