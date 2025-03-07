
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { useDeliveryRecords } from "./hooks/useDeliveryRecords";

// Import refactored components
import BackButton from './components/BackButton';
import SearchToolbar from './components/SearchToolbar';
import ExportDropdown from './components/ExportDropdown';
import DeliveryStatusTabs from './components/DeliveryStatusTabs';
import DeliveryTable from './components/DeliveryTable';
import NoDeliveriesFound from './components/NoDeliveriesFound';
import DeliveryPagination from './components/DeliveryPagination';

const DeliveryRecordsDisplay = ({ onBack }) => {
  const {
    filteredDeliveries,
    isLoading,
    searchTerm,
    setSearchTerm,
    activeTab,
    setActiveTab,
    handleDelete,
    formatDate,
    exportToPDF,
    exportToExcel,
    exportToCSV,
    shareViaEmail,
    shareViaWhatsApp,
    // Pagination states
    currentPage,
    pageSize,
    totalPages,
    setCurrentPage,
    paginatedDeliveries,
  } = useDeliveryRecords();

  return (
    <div className="space-y-4">
      <BackButton onBack={onBack} />

      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle>Delivery Records</CardTitle>
          <div className="w-full sm:w-auto flex items-center gap-2">
            <SearchToolbar 
              searchTerm={searchTerm} 
              setSearchTerm={setSearchTerm} 
            />
            
            <ExportDropdown 
              exportToPDF={exportToPDF}
              exportToExcel={exportToExcel}
              exportToCSV={exportToCSV}
              shareViaEmail={shareViaEmail}
              shareViaWhatsApp={shareViaWhatsApp}
            />
          </div>
        </CardHeader>
        <CardContent>
          <DeliveryStatusTabs 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
          />
          
          <TabsContent value={activeTab}>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <p>Loading deliveries...</p>
              </div>
            ) : filteredDeliveries.length === 0 ? (
              <NoDeliveriesFound 
                searchTerm={searchTerm} 
                activeTab={activeTab} 
              />
            ) : (
              <>
                <DeliveryTable 
                  filteredDeliveries={paginatedDeliveries}
                  handleDelete={handleDelete}
                  formatDate={formatDate}
                />
                
                {totalPages > 1 && (
                  <div className="mt-4">
                    <DeliveryPagination 
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeliveryRecordsDisplay;
