
import { useCallback } from 'react';
import { exportToCSV, exportToExcel, exportToPDF } from '../utils/exportUtils';
import { useToast } from '@/components/ui/use-toast';

const useDeliveriesExport = (deliveries) => {
  const { toast } = useToast();
  
  // Format the data for export
  const formatExportData = useCallback(() => {
    return deliveries.map(delivery => ({
      'Delivery ID': delivery.delivery_id,
      'Customer': delivery.customer_name,
      'Pickup Location': delivery.pickup_location,
      'Delivery Location': delivery.delivery_location,
      'Pickup Time': delivery.scheduled_pickup_time,
      'Delivery Time': delivery.scheduled_delivery_time,
      'Status': delivery.status,
      'Created Date': delivery.created_at,
      'Comments': delivery.comments
    }));
  }, [deliveries]);
  
  // Export to CSV
  const handleExportToCSV = useCallback(() => {
    try {
      const exportData = formatExportData();
      exportToCSV(exportData, 'delivery_records');
      
      toast({
        title: 'Export Successful',
        description: 'Delivery records exported to CSV successfully'
      });
    } catch (error) {
      console.error('CSV Export Error:', error);
      toast({
        title: 'Export Failed',
        description: 'Failed to export delivery records to CSV',
        variant: 'destructive'
      });
    }
  }, [formatExportData, toast]);
  
  // Export to Excel
  const handleExportToExcel = useCallback(() => {
    try {
      const exportData = formatExportData();
      exportToExcel(exportData, 'delivery_records');
      
      toast({
        title: 'Export Successful',
        description: 'Delivery records exported to Excel successfully'
      });
    } catch (error) {
      console.error('Excel Export Error:', error);
      toast({
        title: 'Export Failed',
        description: 'Failed to export delivery records to Excel',
        variant: 'destructive'
      });
    }
  }, [formatExportData, toast]);
  
  // Export to PDF
  const handleExportToPDF = useCallback(() => {
    try {
      const exportData = formatExportData();
      exportToPDF(exportData, 'Delivery Records');
      
      toast({
        title: 'Export Successful',
        description: 'Delivery records exported to PDF successfully'
      });
    } catch (error) {
      console.error('PDF Export Error:', error);
      toast({
        title: 'Export Failed',
        description: 'Failed to export delivery records to PDF',
        variant: 'destructive'
      });
    }
  }, [formatExportData, toast]);
  
  return {
    exportToCSV: handleExportToCSV,
    exportToExcel: handleExportToExcel,
    exportToPDF: handleExportToPDF
  };
};

export default useDeliveriesExport;
