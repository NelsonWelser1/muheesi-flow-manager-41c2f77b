
import React, { createContext, useContext, useState } from 'react';

const DairyContext = createContext(null);

export const DairyProvider = ({ children }) => {
  const [activeSection, setActiveSection] = useState('herdManagement');
  const [activeTab, setActiveTab] = useState('inventory');

  const value = {
    activeSection,
    setActiveSection,
    activeTab,
    setActiveTab
  };

  return (
    <DairyContext.Provider value={value}>
      {children}
    </DairyContext.Provider>
  );
};

export const useDairyContext = () => {
  const context = useContext(DairyContext);
  if (!context) {
    throw new Error('useDairyContext must be used within a DairyProvider');
  }
  return context;
};
