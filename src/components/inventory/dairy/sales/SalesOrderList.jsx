import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { X, Download, FileSpreadsheet, FileText, Printer } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const SalesOrderList = ({ isOpen, onClose, salesOrders = [] }) => {
  const { toast } = useToast();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-UG');
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'paid': return 'default';
      case 'pending': return 'secondary';
      case 'overdue': return 'destructive';
      default: return 'outline';
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    if (!salesOrders || salesOrders.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no sales orders to export",
        variant: "destructive"
      });
      return;
    }

    try {
      // Format data for CSV
      const csvData = salesOrders.map(order => ({
        'Order Date': formatDate(order.order_date),
        'Customer Name': order.customer_name,
        'Product': order.product,
        'Product Type': order.product_type || '',
        'Quantity': order.quantity,
        'Unit Price': order.unit_price,
        'Discount': order.discount || 0,
        'Total Amount': order.total_amount,
        'Payment Status': order.payment_status,
        'Sales Rep': order.sales_rep || '',
        'Delivery Required': order.delivery_required,
        'Notes': order.notes || ''
      }));

      // Convert to CSV string
      const headers = Object.keys(csvData[0]);
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => headers.map(header => 
          typeof row[header] === 'string' && row[header].includes(',') 
            ? `"${row[header]}"` 
            : row[header]
        ).join(','))
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = `sales-orders-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export Successful",
        description: "Sales orders exported to CSV successfully"
      });
    } catch (error) {
      console.error("CSV export error:", error);
      toast({
        title: "Export Failed",
        description: "Could not export data to CSV",
        variant: "destructive"
      });
    }
  };

  // Export to Excel
  const exportToExcel = () => {
    if (!salesOrders || salesOrders.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no sales orders to export",
        variant: "destructive"
      });
      return;
    }

    try {
      // Format data for Excel
      const excelData = salesOrders.map(order => ({
        'Order Date': formatDate(order.order_date),
        'Customer Name': order.customer_name,
        'Product': order.product,
        'Product Type': order.product_type || '',
        'Quantity': order.quantity,
        'Unit Price': order.unit_price,
        'Discount': order.discount || 0,
        'Total Amount': order.total_amount,
        'Payment Status': order.payment_status,
        'Sales Rep': order.sales_rep || '',
        'Delivery Required': order.delivery_required,
        'Notes': order.notes || ''
      }));

      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sales Orders');
      
      // Generate Excel file and trigger download
      XLSX.writeFile(workbook, `sales-orders-${new Date().toISOString().slice(0, 10)}.xlsx`);
      
      toast({
        title: "Export Successful",
        description: "Sales orders exported to Excel successfully"
      });
    } catch (error) {
      console.error("Excel export error:", error);
      toast({
        title: "Export Failed",
        description: "Could not export data to Excel",
        variant: "destructive"
      });
    }
  };

  // Print functionality
  const handlePrint = () => {
    if (!salesOrders || salesOrders.length === 0) {
      toast({
        title: "No data to print",
        description: "There are no sales orders to print",
        variant: "destructive"
      });
      return;
    }

    try {
      const doc = new jsPDF();
      
      // Set title
      doc.setFontSize(18);
      doc.text('Sales Orders Report', 14, 22);
      
      // Add date
      doc.setFontSize(11);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
      
      // Prepare table data
      const tableData = salesOrders.map(order => [
        formatDate(order.order_date),
        order.customer_name,
        order.product,
        order.quantity,
        formatCurrency(order.unit_price),
        formatCurrency(order.total_amount),
        order.payment_status
      ]);
      
      // Add table
      doc.autoTable({
        head: [['Date', 'Customer', 'Product', 'Qty', 'Unit Price', 'Total', 'Status']],
        body: tableData,
        startY: 40,
        theme: 'grid',
        styles: { fontSize: 8 },
        headStyles: { fillColor: [41, 128, 185] }
      });
      
      // Save PDF
      doc.save(`sales-orders-${new Date().toISOString().slice(0, 10)}.pdf`);
      
      toast({
        title: "Print Successful",
        description: "Sales orders exported to PDF successfully"
      });
    } catch (error) {
      console.error("Print error:", error);
      toast({
        title: "Print Failed",
        description: "Could not generate PDF",
        variant: "destructive"
      });
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>Sales Orders List</DialogTitle>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={exportToCSV}>
                    <FileText className="h-4 w-4 mr-2" />
                    Export as CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={exportToExcel}>
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Export as Excel
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handlePrint}>
                    <Printer className="h-4 w-4 mr-2" />
                    Export as PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {salesOrders && salesOrders.length > 0 ? (
            <div className="grid gap-4">
              {salesOrders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">Order #{order.id.slice(0, 8)}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(order.order_date)} • {order.customer_name}
                        </p>
                      </div>
                      <Badge variant={getStatusBadgeVariant(order.payment_status)}>
                        {order.payment_status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm font-medium">Product</p>
                        <p className="text-sm text-muted-foreground">
                          {order.product} {order.product_type && `(${order.product_type})`}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Quantity</p>
                        <p className="text-sm text-muted-foreground">{order.quantity}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Unit Price</p>
                        <p className="text-sm text-muted-foreground">{formatCurrency(order.unit_price)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Total Amount</p>
                        <p className="text-sm font-semibold">{formatCurrency(order.total_amount)}</p>
                      </div>
                    </div>
                    {order.notes && (
                      <div className="mt-3">
                        <p className="text-sm font-medium">Notes</p>
                        <p className="text-sm text-muted-foreground">{order.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No sales orders found</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SalesOrderList;
