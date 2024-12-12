import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import QuotationForm from './QuotationForm';
import QuotationsList from './QuotationsList';
import { useToast } from "@/components/ui/use-toast";
import { useQuotes, useCreateQuote, useDeleteQuote } from '@/integrations/supabase/hooks/useQuotes';

const QuoteManagement = () => {
  const { toast } = useToast();
  const { data: quotes, isLoading } = useQuotes();
  const createQuote = useCreateQuote();
  const deleteQuote = useDeleteQuote();

  console.log('Rendering QuoteManagement', { quotes, isLoading });

  const handleCreateQuote = async (quoteData) => {
    try {
      await createQuote.mutateAsync(quoteData);
      toast({
        title: "Success",
        description: "Quote created successfully",
      });
    } catch (error) {
      console.error('Error creating quote:', error);
      toast({
        title: "Error",
        description: "Failed to create quote",
        variant: "destructive",
      });
    }
  };

  const handleDeleteQuote = async (id) => {
    try {
      await deleteQuote.mutateAsync(id);
      toast({
        title: "Success",
        description: "Quote deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting quote:', error);
      toast({
        title: "Error",
        description: "Failed to delete quote",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Quote</CardTitle>
        </CardHeader>
        <CardContent>
          <QuotationForm onSubmit={handleCreateQuote} />
        </CardContent>
      </Card>
      <QuotationsList 
        quotes={quotes} 
        isLoading={isLoading} 
        onDelete={handleDeleteQuote}
      />
    </div>
  );
};

export default QuoteManagement;