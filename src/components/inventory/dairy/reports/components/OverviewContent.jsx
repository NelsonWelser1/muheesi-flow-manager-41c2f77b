
import React from 'react';
import ReportMetricCards from './ReportMetricCards';
import ProductionChart from './ProductionChart';

const OverviewContent = ({ reportCounts, productionData, salesData }) => {
  return (
    <>
      <ReportMetricCards reportCounts={reportCounts} />

      <div className="mt-8">
        <ProductionChart productionData={productionData} />
      </div>
    </>
  );
};

export default OverviewContent;
