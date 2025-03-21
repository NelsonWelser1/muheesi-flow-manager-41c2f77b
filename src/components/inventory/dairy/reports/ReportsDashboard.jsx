
import React, { useState } from 'react';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useDairyReportData } from './hooks/useDairyReportData';
import ReportFormDialog from './ReportFormDialog';

// Import refactored components
import ReportsHeader from './components/ReportsHeader';
import TabTriggers from './components/TabTriggers';
import OverviewContent from './components/OverviewContent';
import ProductionContent from './components/ProductionContent';
import QualityContent from './components/QualityContent';
import ReportExportCard from './ReportExportCard';
import { LoadingState, ErrorState } from './components/LoadingAndErrorStates';

const ReportsDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isReportFormOpen, setIsReportFormOpen] = useState(false);
  
  const { 
    productionData, 
    qualityMetrics, 
    salesData, 
    reportCounts, 
    isLoading, 
    error,
    refreshData
  } = useDairyReportData();
  
  const handleReportSubmitted = () => {
    refreshData();
    setIsReportFormOpen(false);
  };

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
    <div className="space-y-6">
      <ReportsHeader onOpenReportForm={() => setIsReportFormOpen(true)} />
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-10">
        <TabTriggers reportCounts={enhancedReportCounts} />
        
        <div className="mt-10 pt-6">
          <TabsContent value="overview" className="space-y-6">
            <OverviewContent 
              reportCounts={reportCounts}
              productionData={productionData}
              salesData={salesData}
            />
          </TabsContent>
          
          <TabsContent value="production" className="space-y-6">
            <ProductionContent 
              productionData={productionData} 
              onOpenReportForm={() => setIsReportFormOpen(true)}
            />
          </TabsContent>
          
          <TabsContent value="quality" className="space-y-6">
            <QualityContent 
              qualityMetrics={qualityMetrics}
              productionData={productionData}
              onOpenReportForm={() => setIsReportFormOpen(true)}
            />
          </TabsContent>
          
          <TabsContent value="generate" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
              <ReportExportCard 
                productionData={productionData}
                salesData={salesData}
              />
            </div>
          </TabsContent>
        </div>
      </Tabs>
      
      <ReportFormDialog 
        open={isReportFormOpen} 
        onOpenChange={setIsReportFormOpen}
        onReportSubmitted={handleReportSubmitted}
      />
    </div>
  );
};

export default ReportsDashboard;
