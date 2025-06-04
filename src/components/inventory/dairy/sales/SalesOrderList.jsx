
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Download, FileSpreadsheet, FileText, Printer } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { useSalesOrders } from '@/integrations/supabase/hooks/useSalesOrders';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const SalesOrderList = ({ isOpen, onClose }) => {
  const { salesOrders, loading } = useSalesOrders();
  const { toast } = useToast();

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
      // Prepare CSV headers
      const headers = [
        'Order Date',
        'Customer Name', 
        'Product',
        'Product Type',
        'Quantity',
        'Unit Price',
        'Discount (%)',
        'Total Amount',
        'Payment Status',
        'Sales Rep',
        'Delivery Required',
        'Notes'
      ];

      // Prepare CSV rows
      const csvData = salesOrders.map(order => [
        order.order_date || '',
        order.customer_name || '',
        order.product || '',
        order.product_type || '',
        order.quantity || 0,
        order.unit_price || 0,
        order.discount || 0,
        order.total_amount || 0,
        order.payment_status || '',
        order.sales_rep || '',
        order.delivery_required || '',
        order.notes || ''
      ]);

      // Combine headers and data
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => 
          row.map(cell => 
            typeof cell === 'string' && cell.includes(',') ? `"${cell}"` : cell
          ).join(',')
        )
      ].join('\n');

      // Create and download CSV
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `sales_orders_${new Date().toISOString().slice(0, 10)}.csv`;
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
        description: "Could not export sales orders to CSV",
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
      // Prepare data for Excel
      const excelData = salesOrders.map(order => ({
        'Order Date': order.order_date || '',
        'Customer Name': order.customer_name || '',
        'Product': order.product || '',
        'Product Type': order.product_type || '',
        'Quantity': order.quantity || 0,
        'Unit Price': order.unit_price || 0,
        'Discount (%)': order.discount || 0,
        'Total Amount': order.total_amount || 0,
        'Payment Status': order.payment_status || '',
        'Sales Rep': order.sales_rep || '',
        'Delivery Required': order.delivery_required || '',
        'Notes': order.notes || ''
      }));

      // Create workbook and worksheet
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sales Orders');

      // Set column widths
      const columnWidths = [
        { wch: 12 }, // Order Date
        { wch: 20 }, // Customer Name
        { wch: 12 }, // Product
        { wch: 15 }, // Product Type
        { wch: 10 }, // Quantity
        { wch: 12 }, // Unit Price
        { wch: 12 }, // Discount
        { wch: 15 }, // Total Amount
        { wch: 15 }, // Payment Status
        { wch: 15 }, // Sales Rep
        { wch: 18 }, // Delivery Required
        { wch: 30 }  // Notes
      ];
      worksheet['!cols'] = columnWidths;

      // Generate Excel file and trigger download
      XLSX.writeFile(workbook, `sales_orders_${new Date().toISOString().slice(0, 10)}.xlsx`);

      toast({
        title: "Export Successful",
        description: "Sales orders exported to Excel successfully"
      });
    } catch (error) {
      console.error("Excel export error:", error);
      toast({
        title: "Export Failed",
        description: "Could not export sales orders to Excel",
        variant: "destructive"
      });
    }
  };

  // Export to PDF
  const exportToPDF = () => {
    if (!salesOrders || salesOrders.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no sales orders to export",
        variant: "destructive"
      });
      return;
    }

    try {
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(18);
      doc.text('Sales Orders Report', 14, 22);
      
      // Add date
      doc.setFontSize(11);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
      
      // Prepare table data
      const tableData = salesOrders.map(order => [
        order.order_date || '',
        order.customer_name || '',
        order.product || '',
        order.product_type || '',
        order.quantity || 0,
        `$${order.unit_price || 0}`,
        `${order.discount || 0}%`,
        `$${order.total_amount || 0}`,
        order.payment_status || '',
        order.delivery_required || ''
      ]);

      // Add table with auto-fit columns
      doc.autoTable({
        head: [['Date', 'Customer', 'Product', 'Type', 'Qty', 'Unit Price', 'Discount', 'Total', 'Status', 'Delivery']],
        body: tableData,
        startY: 40,
        theme: 'grid',
        styles: { 
          fontSize: 8,
          overflow: 'linebreak'
        },
        headStyles: { 
          fillColor: [71, 85, 119],
          textColor: 255
        },
        columnStyles: {
          0: { cellWidth: 18 },
          1: { cellWidth: 25 },
          2: { cellWidth: 15 },
          3: { cellWidth: 15 },
          4: { cellWidth: 12 },
          5: { cellWidth: 18 },
          6: { cellWidth: 15 },
          7: { cellWidth: 18 },
          8: { cellWidth: 18 },
          9: { cellWidth: 15 }
        }
      });

      // Save PDF
      doc.save(`sales_orders_${new Date().toISOString().slice(0, 10)}.pdf`);

      toast({
        title: "Export Successful",
        description: "Sales orders exported to PDF successfully"
      });
    } catch (error) {
      console.error("PDF export error:", error);
      toast({
        title: "Export Failed",
        description: "Could not export sales orders to PDF",
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
      // Create a new window with printable content
      const printWindow = window.open('', '_blank');
      
      const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Sales Orders Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; text-align: center; }
            .header { text-align: center; margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .footer { margin-top: 30px; text-align: center; color: #666; }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Sales Orders Report</h1>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Order Date</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Discount</th>
                <th>Total</th>
                <th>Status</th>
                <th>Delivery</th>
              </tr>
            </thead>
            <tbody>
              ${salesOrders.map(order => `
                <tr>
                  <td>${order.order_date || ''}</td>
                  <td>${order.customer_name || ''}</td>
                  <td>${order.product || ''}</td>
                  <td>${order.product_type || ''}</td>
                  <td>${order.quantity || 0}</td>
                  <td>$${order.unit_price || 0}</td>
                  <td>${order.discount || 0}%</td>
                  <td>$${order.total_amount || 0}</td>
                  <td>${order.payment_status || ''}</td>
                  <td>${order.delivery_required || ''}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="footer">
            <p>Total Orders: ${salesOrders.length}</p>
          </div>
          
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              }
            }
          </script>
        </body>
        </html>
      `;

      printWindow.document.write(printContent);
      printWindow.document.close();

      toast({
        title: "Print Initiated",
        description: "Print dialog opened successfully"
      });
    } catch (error) {
      console.error("Print error:", error);
      toast({
        title: "Print Failed",
        description: "Could not open print dialog",
        variant: "destructive"
      });
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'overdue':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Sales Orders</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center items-center h-64">
            <div className="text-lg">Loading sales orders...</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Sales Orders</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white border shadow-lg z-50">
                <DropdownMenuItem onClick={exportToCSV} className="cursor-pointer">
                  <FileText className="h-4 w-4 mr-2" />
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportToExcel} className="cursor-pointer">
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Export as Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportToPDF} className="cursor-pointer">
                  <FileText className="h-4 w-4 mr-2" />
                  Export as PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handlePrint} className="cursor-pointer">
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {!salesOrders || salesOrders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No sales orders found.</p>
            </div>
          ) : (
            salesOrders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{order.customer_name}</span>
                    <Badge variant={getStatusBadgeVariant(order.payment_status)}>
                      {order.payment_status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <strong>Order Date:</strong> {order.order_date}
                    </div>
                    <div>
                      <strong>Product:</strong> {order.product} ({order.product_type})
                    </div>
                    <div>
                      <strong>Quantity:</strong> {order.quantity}
                    </div>
                    <div>
                      <strong>Unit Price:</strong> ${order.unit_price}
                    </div>
                    <div>
                      <strong>Discount:</strong> {order.discount}%
                    </div>
                    <div>
                      <strong>Total Amount:</strong> ${order.total_amount}
                    </div>
                    <div>
                      <strong>Sales Rep:</strong> {order.sales_rep}
                    </div>
                    <div>
                      <strong>Delivery Required:</strong> {order.delivery_required}
                    </div>
                    {order.notes && (
                      <div className="col-span-full">
                        <strong>Notes:</strong> {order.notes}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SalesOrderList;
