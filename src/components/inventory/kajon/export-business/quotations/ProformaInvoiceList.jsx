
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useProformaInvoices, useDeleteProformaInvoice } from '@/integrations/supabase/hooks/useProformaInvoices';
import { useToast } from "@/components/ui/use-toast";
import { format } from 'date-fns';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { FileText, Trash, Edit, Eye, Download, MoreHorizontal, Receipt } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

const ProformaInvoiceList = ({ viewOnly = false, onEdit, onView }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { toast } = useToast();
  
  const { data: proformaInvoices, isLoading } = useProformaInvoices(
    startDate && endDate ? {
      dateRange: {
        start: startDate,
        end: endDate
      }
    } : {}
  );

  const deleteProformaInvoice = useDeleteProformaInvoice();

  const handleDelete = async (id) => {
    if (viewOnly) {
      toast({
        title: "Access Restricted",
        description: "You don't have permission to delete proforma invoices in view-only mode",
        variant: "destructive",
      });
      return;
    }

    try {
      await deleteProformaInvoice.mutateAsync(id);
      toast({
        title: "Success",
        description: "Proforma invoice deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete proforma invoice",
        variant: "destructive",
      });
    }
  };
  
  const getStatusBadge = (status) => {
    const statusStyles = {
      'draft': 'bg-gray-100 text-gray-800',
      'pending': 'bg-blue-100 text-blue-800',
      'sent': 'bg-purple-100 text-purple-800',
      'accepted': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800',
      'expired': 'bg-amber-100 text-amber-800',
    };
    
    return (
      <Badge className={statusStyles[status] || 'bg-gray-100 text-gray-800'}>
        {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Draft'}
      </Badge>
    );
  };

  if (isLoading) {
    return <div>Loading proforma invoices...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Proforma Invoices</CardTitle>
        <div className="flex gap-4">
          <Input 
            type="date" 
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Start Date" 
          />
          <Input 
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="End Date" 
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">ID</th>
                <th className="text-left p-2">Date</th>
                <th className="text-left p-2">Customer</th>
                <th className="text-left p-2">Quote #</th>
                <th className="text-left p-2">Amount</th>
                <th className="text-left p-2">Status</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {proformaInvoices?.map((invoice) => (
                <tr key={invoice.id} className="border-b">
                  <td className="p-2">{invoice.id.slice(0, 8)}</td>
                  <td className="p-2">{format(new Date(invoice.invoice_date || invoice.created_at), 'yyyy-MM-dd')}</td>
                  <td className="p-2">{invoice.customer_name || "N/A"}</td>
                  <td className="p-2">{invoice.quote_id?.slice(0, 8) || "N/A"}</td>
                  <td className="p-2">${invoice.total_amount?.toFixed(2) || "0.00"}</td>
                  <td className="p-2">{getStatusBadge(invoice.status)}</td>
                  <td className="p-2 space-x-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => onView && onView(invoice)}>
                          <Eye className="h-4 w-4 mr-2" /> View Details
                        </DropdownMenuItem>
                        {!viewOnly && (
                          <DropdownMenuItem onClick={() => onEdit && onEdit(invoice)}>
                            <Edit className="h-4 w-4 mr-2" /> Edit Invoice
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" /> Export PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Receipt className="h-4 w-4 mr-2" /> Convert to Order
                        </DropdownMenuItem>
                        {!viewOnly && (
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDelete(invoice.id)}
                            disabled={deleteProformaInvoice.isPending}
                          >
                            <Trash className="h-4 w-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
              
              {(!proformaInvoices || proformaInvoices.length === 0) && (
                <tr>
                  <td colSpan={7} className="p-4 text-center">
                    No proforma invoices found. {!viewOnly && "Generate a proforma invoice from a quotation to get started."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProformaInvoiceList;
