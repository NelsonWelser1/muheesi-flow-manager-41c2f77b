
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Download, MoreHorizontal } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

// Sample data for demonstration
const sampleInvoices = [
  {
    id: '1',
    invoice_number: 'PI-2024-001',
    customer_name: 'Coffee Importers Ltd',
    invoice_date: '2024-01-15',
    total_amount: 25000,
    status: 'draft'
  },
  {
    id: '2',
    invoice_number: 'PI-2024-002',
    customer_name: 'European Coffee Co',
    invoice_date: '2024-01-18',
    total_amount: 35000,
    status: 'sent'
  }
];

const ProformaInvoiceList = ({ viewOnly = false, onView, onEdit }) => {
  const getStatusBadge = (status) => {
    const variants = {
      draft: 'secondary',
      sent: 'default',
      approved: 'default',
      cancelled: 'destructive'
    };
    
    return (
      <Badge variant={variants[status] || 'secondary'}>
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Proforma Invoices</CardTitle>
      </CardHeader>
      <CardContent>
        {sampleInvoices.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No proforma invoices found.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">
                    {invoice.invoice_number}
                  </TableCell>
                  <TableCell>{invoice.customer_name}</TableCell>
                  <TableCell>{invoice.invoice_date}</TableCell>
                  <TableCell>${invoice.total_amount?.toFixed(2)}</TableCell>
                  <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView?.(invoice)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {!viewOnly && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit?.(invoice)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            Send Email
                          </DropdownMenuItem>
                          {!viewOnly && (
                            <DropdownMenuItem className="text-red-600">
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default ProformaInvoiceList;
