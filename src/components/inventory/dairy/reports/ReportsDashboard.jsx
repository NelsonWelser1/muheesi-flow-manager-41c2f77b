
import React, { useState } from 'react';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useDairyReportData } from './hooks/useDairyReportData';

// Import refactored components
import ReportsHeader from './components/ReportsHeader';
import TabTriggers from './components/TabTriggers';
import OverviewContent from './components/OverviewContent';
import ProductionContent from './components/ProductionContent';
import QualityContent from './components/QualityContent';
import { LoadingState, ErrorState } from './components/LoadingAndErrorStates';

const ReportsDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  
  const { 
    productionData, 
    qualityMetrics, 
    salesData, 
    reportCounts, 
    isLoading, 
    error,
    refreshData
  } = useDairyReportData();

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} refreshData={refreshData} />;
  }

  // Calculate the number of product types for the production tab
  const enhancedReportCounts = {
    ...reportCounts,
    productTypes: productionData.length
  };

  return (
    <div className="space-y-6 bg-gray-50 p-4 rounded-lg">
      <ReportsHeader />
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <div className="w-full">
          <TabTriggers reportCounts={enhancedReportCounts} />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm mt-6">
          <TabsContent value="overview" className="space-y-6 mt-0">
            <OverviewContent 
              reportCounts={reportCounts}
              productionData={productionData}
              salesData={salesData}
            />
          </TabsContent>
          
          <TabsContent value="production" className="space-y-6 mt-0">
            <ProductionContent 
              productionData={productionData}
            />
          </TabsContent>
          
          <TabsContent value="quality" className="space-y-6 mt-0">
            <QualityContent 
              qualityMetrics={qualityMetrics}
              productionData={productionData}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default ReportsDashboard;
