
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Receipt, Calculator, BarChart3, Percent } from "lucide-react";
import QuotationForm from './QuotationForm';
import QuotationsList from './QuotationsList';
import ProformaInvoiceManager from './ProformaInvoiceManager';
import CoffeePriceCalculator from './calculator/CoffeePriceCalculator';
import { useQuotations, useCreateQuotation, useDeleteQuotation } from '@/integrations/supabase/hooks/useQuotations';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const QuoteManagement = ({ viewOnly = false }) => {
  const { toast } = useToast();
  const { data: quotes, isLoading } = useQuotations();
  const createQuote = useCreateQuotation();
  const deleteQuote = useDeleteQuotation();
  const [view, setView] = useState('list');
  const [activeTab, setActiveTab] = useState('quotes');

  console.log('Rendering QuoteManagement', { quotes, isLoading, viewOnly });

  const handleCreateQuote = async (quoteData) => {
    if (viewOnly) {
      toast({
        title: "Access Restricted",
        description: "You don't have permission to create quotes in view-only mode",
        variant: "destructive",
      });
      return;
    }

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
    if (viewOnly) {
      toast({
        title: "Access Restricted",
        description: "You don't have permission to delete quotes in view-only mode",
        variant: "destructive",
      });
      return;
    }

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
      {viewOnly && (
        <Alert variant="warning" className="bg-amber-50 border-amber-200 mb-4">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            You are in view-only mode. Creating or modifying quotes is restricted.
          </AlertDescription>
        </Alert>
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="quotes" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Quotations</span>
          </TabsTrigger>
          <TabsTrigger value="proforma" className="flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            <span>Proforma</span>
          </TabsTrigger>
          <TabsTrigger value="calculator" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            <span>Price Calculator</span>
          </TabsTrigger>
          <TabsTrigger value="pricing" className="flex items-center gap-2">
            <Percent className="h-4 w-4" />
            <span>Pricing Strategy</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span>Pricing Analytics</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="quotes" className="mt-6">
          {view === 'list' ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Quotations</h2>
                {!viewOnly && (
                  <Button onClick={() => setView('form')}>Create New Quote</Button>
                )}
              </div>
              <QuotationsList 
                quotes={quotes} 
                isLoading={isLoading} 
                onDelete={handleDeleteQuote}
                viewOnly={viewOnly}
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
        </TabsContent>

        <TabsContent value="proforma" className="mt-6">
          <ProformaInvoiceManager viewOnly={viewOnly} />
        </TabsContent>

        <TabsContent value="calculator" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <CoffeePriceCalculator viewOnly={viewOnly} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">Pricing Strategy</h2>
              <p>Develop and manage pricing strategies based on market conditions, competition, and customer relationships.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold">Market-Based Pricing</h3>
                  <p className="text-gray-500">Align prices with current market trends and indices</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold">Relationship Pricing</h3>
                  <p className="text-gray-500">Special pricing for long-term or strategic customers</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold">Premium Quality Pricing</h3>
                  <p className="text-gray-500">Price strategies for specialty and certified coffees</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">Pricing Analytics</h2>
              <p>Analyze quotation performance, conversion rates, and pricing trends over time.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="h-64 border rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Quotation Conversion Rate Chart</p>
                </div>
                <div className="h-64 border rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Average Quote Value Trends</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="p-4 border rounded-lg text-center">
                  <h3 className="font-semibold">Quote Success Rate</h3>
                  <p className="text-2xl font-bold mt-2">68%</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <h3 className="font-semibold">Avg. Quote Value</h3>
                  <p className="text-2xl font-bold mt-2">$42,500</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <h3 className="font-semibold">Avg. Response Time</h3>
                  <p className="text-2xl font-bold mt-2">2.3 days</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QuoteManagement;
