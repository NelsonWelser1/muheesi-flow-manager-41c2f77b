
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { useDeliveryRecords } from "./hooks/useDeliveryRecords";

// Import refactored components
import BackButton from './components/BackButton';
import SearchToolbar from './components/SearchToolbar';
import DeliveryTabs from './components/DeliveryTabs';
import DeliveryTable from './components/DeliveryTable';
import DeliveryPagination from './components/DeliveryPagination';
import ExportActions from './components/ExportActions';

const DeliveryRecordsDisplay = ({ onBack }) => {
  const {
    deliveries,
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
    // Pagination
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    paginatedDeliveries,
  } = useDeliveryRecords();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <BackButton onBack={onBack} />
        <ExportActions 
          exportToPDF={exportToPDF}
          exportToExcel={exportToExcel}
          exportToCSV={exportToCSV}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Delivery Records</CardTitle>
        </CardHeader>
        <CardContent>
          <SearchToolbar 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
          />
          
          <DeliveryTabs 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            deliveries={deliveries}
          />

          {activeTab && (
            <TabsContent value={activeTab} className="mt-4">
              {isLoading ? (
                <div className="text-center py-4">Loading delivery records...</div>
              ) : paginatedDeliveries.length === 0 ? (
                <div className="text-center py-4">No delivery records found</div>
              ) : (
                <>
                  <DeliveryTable 
                    deliveries={paginatedDeliveries} 
                    handleDelete={handleDelete} 
                    formatDate={formatDate}
                  />
                  
                  <DeliveryPagination 
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    pageSize={pageSize}
                    setPageSize={setPageSize}
                    totalPages={totalPages}
                  />
                </>
              )}
            </TabsContent>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DeliveryRecordsDisplay;
