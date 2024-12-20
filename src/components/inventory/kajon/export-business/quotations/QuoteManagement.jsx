import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import QuotationForm from './QuotationForm';
import QuotationsList from './QuotationsList';
import { useToast } from "@/components/ui/use-toast";
import { useQuotes, useCreateQuote, useDeleteQuote } from '@/integrations/supabase/hooks/useQuotes';

const QuoteManagement = () => {
  const { toast } = useToast();
  const { data: quotes, isLoading } = useQuotes();
  const createQuote = useCreateQuote();
  const deleteQuote = useDeleteQuote();
  const [view, setView] = useState('list');

  console.log('Rendering QuoteManagement', { quotes, isLoading });

  const handleCreateQuote = async (quoteData) => {
    try {
      await createQuote.mutateAsync(quoteData);
      toast({
        title: "Success",
        description: "Quote created successfully",
      });
      setView('list');
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
      {view === 'list' ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Quotations</h2>
            <Button onClick={() => setView('form')}>Create New Quote</Button>
          </div>
          <QuotationsList 
            quotes={quotes} 
            isLoading={isLoading} 
            onDelete={handleDeleteQuote}
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Create New Quote</h2>
            <Button variant="outline" onClick={() => setView('list')}>Back to List</Button>
          </div>
          <Card>
            <CardContent className="pt-6">
              <QuotationForm onSubmit={handleCreateQuote} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default QuoteManagement;