
import React from 'react';
import { useDairyContext } from '../context/DairyContext';
import AnalyticsView from './AnalyticsView';

const DairyAnalytics = () => {
  const { activeTab } = useDairyContext();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4">Dairy Analytics</h2>
      <AnalyticsView />
    </div>
  );
};

export default DairyAnalytics;
