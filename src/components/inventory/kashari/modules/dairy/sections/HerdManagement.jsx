
import React from 'react';
import { useDairyContext } from '../context/DairyContext';
import CattleInventoryView from './CattleInventoryView';
import HealthRecordsView from './HealthRecordsView';
import GrowthMetricsView from './GrowthMetricsView';

const HerdManagement = () => {
  const { activeTab } = useDairyContext();

  const renderContent = () => {
    switch (activeTab) {
      case 'inventory':
        return <CattleInventoryView />;
      case 'health':
        return <HealthRecordsView />;
      case 'growth':
        return <GrowthMetricsView />;
      default:
        return <CattleInventoryView />;
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4">Herd Management</h2>
      {renderContent()}
    </div>
  );
};

export default HerdManagement;
