
import React from 'react';
import CattleHealth from '../../health/HealthRecordsView';

const HealthRecordsView = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4">Health Records</h2>
      <CattleHealth />
    </div>
  );
};

export default HealthRecordsView;
