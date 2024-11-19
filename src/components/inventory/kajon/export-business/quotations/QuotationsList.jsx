import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileText, Trash, Edit } from 'lucide-react';
import { useQuotations, useDeleteQuotation } from '@/integrations/supabase/hooks/useQuotations';
import { useToast } from "@/components/ui/use-toast";
import { format } from 'date-fns';

const QuotationsList = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { toast } = useToast();
  
  const { data: quotations, isLoading } = useQuotations(
    startDate && endDate ? {
      dateRange: {
        start: startDate,
        end: endDate
      }
    } : {}
  );

  const deleteQuotation = useDeleteQuotation();

  const handleDelete = async (id) => {
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
    return <div>Loading...</div>;
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
                  <td className="p-2">${quote.total_revenue.toFixed(2)}</td>
                  <td className="p-2">${quote.total_costs.toFixed(2)}</td>
                  <td className="p-2">${quote.net_profit.toFixed(2)}</td>
                  <td className="p-2 space-x-2">
                    <Button variant="ghost" size="icon">
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDelete(quote.id)}
                      disabled={deleteQuotation.isPending}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuotationsList;