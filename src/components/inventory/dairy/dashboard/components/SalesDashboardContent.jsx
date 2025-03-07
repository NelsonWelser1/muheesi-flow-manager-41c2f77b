
import React from 'react';
import SalesCard from './SalesCard';
import SalesChart from './SalesChart';
import SalesTable from './SalesTable';
import SalesDistributionForm from '../../sales/SalesDistributionForm';

const SalesDashboardContent = ({ salesData }) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SalesCard title="Recent Sales">
          <SalesChart salesData={salesData} />
        </SalesCard>

        <SalesCard title="Sales Records">
          <SalesTable salesData={salesData} />
        </SalesCard>
      </div>
      
      <SalesDistributionForm />
    </>
  );
};

export default SalesDashboardContent;
