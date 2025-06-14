
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileText, Trash, Edit, Eye, Download, MoreHorizontal } from 'lucide-react';
import { useQuotes, useDeleteQuote } from '@/integrations/supabase/hooks/useQuotes';
import { useToast } from "@/components/ui/use-toast";
import { format } from 'date-fns';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const QuotationsList = ({ viewOnly = false }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { toast } = useToast();
  
  const { data: quotations, isLoading } = useQuotes();

  const deleteQuotation = useDeleteQuote();

  const handleDelete = async (id) => {
    if (viewOnly) {
      toast({
        title: "Access Restricted",
        description: "You don't have permission to delete quotations in view-only mode",
        variant: "destructive",
      });
      return;
    }

    try {
      await deleteQuotation.mutateAsync(id);
      toast({
        title: "Success",
        description: "Quotation deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete quotation",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading quotations...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quotations</CardTitle>
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
                <th className="text-left p-2">Revenue</th>
                <th className="text-left p-2">Costs</th>
                <th className="text-left p-2">Profit</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {quotations?.map((quote) => (
                <tr key={quote.id} className="border-b">
                  <td className="p-2">{quote.id.slice(0, 8)}</td>
                  <td className="p-2">{format(new Date(quote.created_at), 'yyyy-MM-dd')}</td>
                  <td className="p-2">{quote.customer_name || "N/A"}</td>
                  <td className="p-2">${quote.total_revenue?.toFixed(2) || "0.00"}</td>
                  <td className="p-2">${quote.total_costs?.toFixed(2) || "0.00"}</td>
                  <td className="p-2">${quote.net_profit?.toFixed(2) || "0.00"}</td>
                  <td className="p-2 space-x-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" /> View Details
                        </DropdownMenuItem>
                        {!viewOnly && (
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" /> Edit Quote
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" /> Export PDF
                        </DropdownMenuItem>
                        {!viewOnly && (
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDelete(quote.id)}
                            disabled={deleteQuotation.isPending}
                          >
                            <Trash className="h-4 w-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
              
              {(!quotations || quotations.length === 0) && (
                <tr>
                  <td colSpan={7} className="p-4 text-center">
                    No quotations found. {!viewOnly && "Create your first quotation to get started."}
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

export default QuotationsList;
