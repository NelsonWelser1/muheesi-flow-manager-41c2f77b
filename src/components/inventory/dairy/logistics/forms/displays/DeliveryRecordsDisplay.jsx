
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Search, 
  MoreHorizontal,
  Trash2, 
  Edit, 
  Eye,
  Download,
  FileText,
  FileSpreadsheet,
  Filter,
  Share2,
  Mail,
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { useDeliveries } from '../hooks/useDeliveries';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const DeliveryRecordsDisplay = ({ onBack }) => {
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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <Badge variant="outline">Pending</Badge>;
      case 'In Transit':
        return <Badge variant="warning">In Transit</Badge>;
      case 'Delivered':
        return <Badge variant="success">Delivered</Badge>;
      case 'Delayed':
        return <Badge variant="destructive">Delayed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
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

  return (
    <div className="space-y-4">
      <Button 
        variant="outline" 
        onClick={onBack}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle>Delivery Records</CardTitle>
          <div className="w-full sm:w-auto flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search deliveries..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                  <span className="sr-only">Export</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={exportToPDF}>
                  <FileText className="mr-2 h-4 w-4" />
                  Export as PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportToExcel}>
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Export as Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportToCSV}>
                  <FileText className="mr-2 h-4 w-4" />
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={shareViaEmail}>
                  <Mail className="mr-2 h-4 w-4" />
                  Share via Email
                </DropdownMenuItem>
                <DropdownMenuItem onClick={shareViaWhatsApp}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share via WhatsApp
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-5 mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="in_transit">In Transit</TabsTrigger>
              <TabsTrigger value="delivered">Delivered</TabsTrigger>
              <TabsTrigger value="delayed">Delayed</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab}>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <p>Loading deliveries...</p>
                </div>
              ) : filteredDeliveries.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium">No deliveries found</h3>
                  <p className="text-sm text-gray-500">
                    {searchTerm 
                      ? "Try adjusting your search term" 
                      : activeTab !== 'all' 
                        ? `No ${activeTab.replace('_', ' ')} deliveries found` 
                        : "Create your first delivery to see it here"}
                  </p>
                </div>
              ) : (
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Delivery ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Pickup Time</TableHead>
                        <TableHead>Delivery Time</TableHead>
                        <TableHead>Pickup Location</TableHead>
                        <TableHead>Delivery Location</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDeliveries.map((delivery) => (
                        <TableRow key={delivery.id}>
                          <TableCell className="font-medium">{delivery.delivery_id}</TableCell>
                          <TableCell>{delivery.customer_name}</TableCell>
                          <TableCell>{getStatusBadge(delivery.status)}</TableCell>
                          <TableCell>{formatDate(delivery.scheduled_pickup_time)}</TableCell>
                          <TableCell>{formatDate(delivery.scheduled_delivery_time)}</TableCell>
                          <TableCell>{delivery.pickup_location}</TableCell>
                          <TableCell>{delivery.delivery_location}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="mr-2 h-4 w-4" />
                                  <span>View Details</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  <span>Edit</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDelete(delivery.id)}>
                                  <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                                  <span className="text-red-500">Delete</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeliveryRecordsDisplay;
