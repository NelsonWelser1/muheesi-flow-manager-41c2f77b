
import React from 'react';
import RecentHealthRecords from '../cattle/health/RecentHealthRecords';
import HerdSummary from './HerdSummary';
import AddCattleDialog from './AddCattleDialog';
import CattleTable from './CattleTable';

const HerdManagement = () => {
  return (
    <div className="space-y-6">
      <RecentHealthRecords />
      <HerdSummary />
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Cattle Inventory</h2>
        <AddCattleDialog />
      </div>
      <CattleTable />
    </div>
  );
};

export default HerdManagement;
