
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import jsPDF from "jspdf";
import 'jspdf-autotable';
import * as XLSX from "xlsx";
import { useDeliveries } from "../../../hooks/useDeliveries";

export const useDeliveryRecords = () => {
  const { deliveries, isLoading, deleteDelivery, fetchDeliveries } = useDeliveries();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();

  // Ensure deliveries are fetched when component mounts
  useEffect(() => {
    console.log('DeliveryRecordsDisplay mounted, fetching deliveries...');
    fetchDeliveries();
  }, [fetchDeliveries]);

  // Filter deliveries based on search term and active tab
  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesSearch = 
      delivery.delivery_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.order_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.customer_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && delivery.status.replace(' ', '_').toLowerCase() === activeTab;
  });

  // Log deliveries for debugging
  useEffect(() => {
    console.log('Current deliveries:', deliveries);
    console.log('Filtered deliveries:', filteredDeliveries);
  }, [deliveries, filteredDeliveries]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this delivery?')) {
      console.log('Deleting delivery:', id);
      const { success } = await deleteDelivery(id);
      if (success) {
        fetchDeliveries();
      }
    }
  };

  // Format date
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    } catch (error) {
      console.error('Invalid date:', dateString);
      return 'Invalid date';
    }
  };

  // Export to PDF
  const exportToPDF = () => {
    try {
      console.log('Exporting to PDF...');
      const doc = new jsPDF();
      doc.text('Delivery Records Report', 14, 16);
      doc.text(`Generated: ${format(new Date(), 'MMM dd, yyyy HH:mm')}`, 14, 24);
      
      // Extract the data we want to display
      const tableData = filteredDeliveries.map(delivery => [
        delivery.delivery_id,
        delivery.customer_name,
        delivery.status,
        formatDate(delivery.scheduled_pickup_time),
        formatDate(delivery.scheduled_delivery_time),
        delivery.pickup_location,
        delivery.delivery_location
      ]);
      
      doc.autoTable({
        head: [['ID', 'Customer', 'Status', 'Pickup Time', 'Delivery Time', 'Pickup Location', 'Delivery Location']],
        body: tableData,
        startY: 30,
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] }
      });
      
      doc.save('delivery_records.pdf');
      
      toast({
        title: "Success",
        description: "PDF exported successfully",
      });
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      toast({
        title: "Error",
        description: "Failed to export PDF",
        variant: "destructive"
      });
    }
  };

  // Export to Excel
  const exportToExcel = () => {
    try {
      console.log('Exporting to Excel...');
      const tableData = filteredDeliveries.map(delivery => ({
        'Delivery ID': delivery.delivery_id,
        'Order ID': delivery.order_id,
        'Customer': delivery.customer_name,
        'Status': delivery.status,
        'Pickup Location': delivery.pickup_location,
        'Delivery Location': delivery.delivery_location,
        'Scheduled Pickup': formatDate(delivery.scheduled_pickup_time),
        'Scheduled Delivery': formatDate(delivery.scheduled_delivery_time),
        'Comments': delivery.comments
      }));
      
      const worksheet = XLSX.utils.json_to_sheet(tableData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Deliveries");
      
      XLSX.writeFile(workbook, 'delivery_records.xlsx');
      
      toast({
        title: "Success",
        description: "Excel file exported successfully",
      });
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      toast({
        title: "Error",
        description: "Failed to export Excel file",
        variant: "destructive"
      });
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    try {
      console.log('Exporting to CSV...');
      const tableData = filteredDeliveries.map(delivery => ({
        'Delivery ID': delivery.delivery_id,
        'Order ID': delivery.order_id,
        'Customer': delivery.customer_name,
        'Status': delivery.status,
        'Pickup Location': delivery.pickup_location,
        'Delivery Location': delivery.delivery_location,
        'Scheduled Pickup': formatDate(delivery.scheduled_pickup_time),
        'Scheduled Delivery': formatDate(delivery.scheduled_delivery_time),
        'Comments': delivery.comments
      }));
      
      const worksheet = XLSX.utils.json_to_sheet(tableData);
      const csv = XLSX.utils.sheet_to_csv(worksheet);
      
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'delivery_records.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Success",
        description: "CSV file exported successfully",
      });
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      toast({
        title: "Error",
        description: "Failed to export CSV file",
        variant: "destructive"
      });
    }
  };

  // Share functions
  const shareViaEmail = () => {
    try {
      console.log('Sharing via email...');
      // In a real app, we would generate a PDF and send via email using a backend service
      toast({
        title: "Email Sharing",
        description: "This would email the PDF in a real application. Feature coming soon.",
      });
    } catch (error) {
      console.error('Error sharing via email:', error);
      toast({
        title: "Error",
        description: "Failed to share via email",
        variant: "destructive"
      });
    }
  };

  const shareViaWhatsApp = () => {
    try {
      console.log('Sharing via WhatsApp...');
      // In a real app, we would generate a shareable link
      toast({
        title: "WhatsApp Sharing",
        description: "This would share a link via WhatsApp in a real application. Feature coming soon.",
      });
    } catch (error) {
      console.error('Error sharing via WhatsApp:', error);
      toast({
        title: "Error",
        description: "Failed to share via WhatsApp",
        variant: "destructive"
      });
    }
  };

  return {
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
    shareViaEmail,
    shareViaWhatsApp,
  };
};
