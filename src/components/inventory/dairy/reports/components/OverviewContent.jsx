
import React from 'react';
import ReportMetricCards from './ReportMetricCards';
import ProductionChart from './ProductionChart';
import ReportExportCard from '../ReportExportCard';

const OverviewContent = ({ reportCounts, productionData, salesData }) => {
  return (
    <>
      <ReportMetricCards reportCounts={reportCounts} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ProductionChart productionData={productionData} />
        <ReportExportCard 
          productionData={productionData}
          salesData={salesData}
        />
      </div>
    </>
  );
};

export default OverviewContent;
