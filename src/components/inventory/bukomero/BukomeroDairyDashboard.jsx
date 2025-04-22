import React, { useState } from 'react';
import HeaderSection from "./HeaderSection";
import TabsSection from "./TabsSection";
import MetricsSection from "./MetricsSection";
import ModuleSection from "./ModuleSection";

const BukomeroDairyDashboard = () => {
  const [activeTab, setActiveTab] = useState('inventory');

  // Dummy data for metrics
  const [metrics, setMetrics] = useState([
    { label: 'Total Milk Production', value: '5,000 Liters' },
    { label: 'Average Daily Yield', value: '500 Liters' },
    { label: 'Cattle Health Index', value: '95%' },
  ]);

  // Dummy data for tabs
  const TABS = [
    { id: "inventory", label: "Inventory", module: "InventoryModule" },
    { id: "sales", label: "Sales", module: "SalesModule" },
    { id: "ledger", label: "Financial Ledger", module: "LedgerModule" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "inventory":
        return (
          <ModuleSection>
            <div>Inventory Content</div>
          </ModuleSection>
        );
      case "sales":
        return (
          <ModuleSection>
            <div>Sales Content</div>
          </ModuleSection>
        );
      case "ledger":
        return (
          <ModuleSection>
            <div>Ledger Content</div>
          </ModuleSection>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <HeaderSection title="Bukomero Dairy Dashboard" />
      <TabsSection
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <MetricsSection metrics={metrics} />
      {renderTabContent()}
    </div>
  );
};

export default BukomeroDairyDashboard;
