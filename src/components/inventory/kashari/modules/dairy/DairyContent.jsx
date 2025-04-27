
import React from 'react';
import { useDairyContext } from './context/DairyContext';
import HerdManagement from './sections/HerdManagement';
import MilkProductionView from './sections/MilkProductionView';
import DairyAnalytics from './sections/DairyAnalytics';

const DairyContent = () => {
  const { activeSection } = useDairyContext();

  const renderContent = () => {
    switch (activeSection) {
      case 'herdManagement':
        return <HerdManagement />;
      case 'milkProduction':
        return <MilkProductionView />;
      case 'analytics':
        return <DairyAnalytics />;
      default:
        return <HerdManagement />;
    }
  };

  return (
    <DairyLayout>
      {renderContent()}
    </DairyLayout>
  );
};

export default DairyContent;
