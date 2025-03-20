
import { useToast } from "@/components/ui/use-toast";
import { format } from 'date-fns';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const useDeliveryExports = (deliveries) => {
  const { toast } = useToast();

  // Format date for export
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'yyyy-MM-dd HH:mm');
    } catch (error) {
      return dateString;
    }
  };

  // Prepare data for export
  const prepareExportData = () => {
    return deliveries.map(delivery => ({
      'Delivery ID': delivery.delivery_id,
      'Customer': delivery.customer_name,
      'Pickup Location': delivery.pickup_location,
      'Delivery Location': delivery.delivery_location,
      'Scheduled Pickup': formatDate(delivery.scheduled_pickup_time),
      'Scheduled Delivery': formatDate(delivery.scheduled_delivery_time),
      'Actual Pickup': formatDate(delivery.actual_pickup_time),
      'Actual Delivery': formatDate(delivery.actual_delivery_time),
      'Status': delivery.status,
      'Comments': delivery.comments,
      'Created': formatDate(delivery.created_at)
    }));
  };

  // Export to CSV
  const handleExportToCSV = () => {
    try {
      const exportData = prepareExportData();
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const csv = XLSX.utils.sheet_to_csv(worksheet);
      
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm');
      
      link.href = url;
      link.setAttribute('download', `delivery_records_${timestamp}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export Successful",
        description: "Delivery records exported to CSV",
      });
    } catch (error) {
      console.error("CSV Export Error:", error);
      toast({
        title: "Export Failed",
        description: "Failed to export to CSV",
        variant: "destructive",
      });
    }
  };

  // Export to Excel
  const handleExportToExcel = () => {
    try {
      const exportData = prepareExportData();
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Delivery Records');
      
      const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm');
      XLSX.writeFile(workbook, `delivery_records_${timestamp}.xlsx`);
      
      toast({
        title: "Export Successful",
        description: "Delivery records exported to Excel",
      });
    } catch (error) {
      console.error("Excel Export Error:", error);
      toast({
        title: "Export Failed",
        description: "Failed to export to Excel",
        variant: "destructive",
      });
    }
  };

  // Export to PDF
  const handleExportToPDF = () => {
    try {
      const doc = new jsPDF('landscape');
      const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm');
      
      // Add title
      doc.setFontSize(18);
      doc.text('Delivery Records', 14, 22);
      
      // Add timestamp
      doc.setFontSize(11);
      doc.text(`Generated: ${timestamp}`, 14, 30);
      
      // Create table
      doc.autoTable({
        head: [['Delivery ID', 'Customer', 'Pickup Location', 'Delivery Location', 'Status', 'Scheduled Delivery', 'Created']],
        body: deliveries.map(delivery => [
          delivery.delivery_id,
          delivery.customer_name,
          delivery.pickup_location,
          delivery.delivery_location,
          delivery.status,
          formatDate(delivery.scheduled_delivery_time),
          formatDate(delivery.created_at)
        ]),
        startY: 35,
        theme: 'grid',
        styles: {
          fontSize: 8,
          cellPadding: 3
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [240, 245, 255]
        }
      });
      
      // Save PDF
      const pdfTimestamp = format(new Date(), 'yyyy-MM-dd_HH-mm');
      doc.save(`delivery_records_${pdfTimestamp}.pdf`);
      
      toast({
        title: "Export Successful",
        description: "Delivery records exported to PDF",
      });
    } catch (error) {
      console.error("PDF Export Error:", error);
      toast({
        title: "Export Failed",
        description: "Failed to export to PDF",
        variant: "destructive",
      });
    }
  };

  return {
    exportToCSV: handleExportToCSV,
    exportToExcel: handleExportToExcel,
    exportToPDF: handleExportToPDF
  };
};

export default useDeliveryExports;
