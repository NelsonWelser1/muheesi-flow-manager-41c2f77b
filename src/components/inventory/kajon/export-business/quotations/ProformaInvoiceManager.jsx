
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Receipt, FileText, Eye } from 'lucide-react';
import { useQuotations } from '@/integrations/supabase/hooks/useQuotations';
import { useCreateProformaInvoice } from '@/integrations/supabase/hooks/useProformaInvoices';
import ProformaInvoiceList from './ProformaInvoiceList';
import ProformaInvoiceTemplate from './ProformaInvoiceTemplate';

const ProformaInvoiceManager = ({ viewOnly = false }) => {
  const [activeTab, setActiveTab] = useState('list');
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const { toast } = useToast();
  const { data: quotations, isLoading } = useQuotations();
  const createProformaInvoice = useCreateProformaInvoice();

  const handleQuoteSelection = (quote) => {
    setSelectedQuote(quote);
    setActiveTab('generate');
  };

  const handleView = (invoice) => {
    setSelectedInvoice(invoice);
    setActiveTab('view');
  };

  const handleEdit = (invoice) => {
    setSelectedInvoice(invoice);
    setActiveTab('edit');
  };

  const handleGenerateProforma = async () => {
    if (viewOnly) {
      toast({
        title: "Access Restricted",
        description: "You don't have permission to create proforma invoices in view-only mode",
        variant: "destructive",
      });
      return;
    }

    if (!selectedQuote) return;

    try {
      // Create proforma invoice from quote
      const proformaData = {
        quote_id: selectedQuote.id,
        customer_name: selectedQuote.customer_name || 'Customer',
        invoice_date: new Date().toISOString(),
        total_amount: selectedQuote.total_revenue || 0,
        status: 'draft'
      };

      await createProformaInvoice.mutateAsync(proformaData);
      
      toast({
        title: "Success",
        description: "Proforma invoice generated successfully",
      });
      
      // Reset and go back to list
      setSelectedQuote(null);
      setActiveTab('list');
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate proforma invoice",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setSelectedQuote(null);
    setSelectedInvoice(null);
    setActiveTab('list');
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list">Proforma Invoices</TabsTrigger>
          <TabsTrigger value="quotes">Select Quotation</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-4">
          <ProformaInvoiceList 
            viewOnly={viewOnly}
            onView={handleView}
            onEdit={handleEdit}
          />
        </TabsContent>

        <TabsContent value="quotes" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Select Quotation for Proforma Invoice</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div>Loading quotations...</div>
              ) : (
                <div className="space-y-4">
                  {quotations?.map((quote) => (
                    <div key={quote.id} className="flex items-center justify-between border rounded-lg p-4">
                      <div>
                        <h3 className="font-medium">Quote #{quote.id.slice(0, 8)}</h3>
                        <p className="text-sm text-muted-foreground">
                          Customer: {quote.customer_name || 'N/A'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Total: ${quote.total_revenue?.toFixed(2) || '0.00'}
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={() => handleQuoteSelection(quote)}
                        disabled={viewOnly}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Select
                      </Button>
                    </div>
                  ))}
                  
                  {(!quotations || quotations.length === 0) && (
                    <div className="text-center py-8">
                      <p>No quotations available. Create a quotation first.</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="generate" className="mt-4">
          {selectedQuote && (
            <Card>
              <CardHeader>
                <CardTitle>Generate Proforma Invoice</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium">Quote #{selectedQuote.id.slice(0, 8)}</h3>
                  <p>Customer: {selectedQuote.customer_name || 'N/A'}</p>
                  <p>Total Value: ${selectedQuote.total_revenue?.toFixed(2) || '0.00'}</p>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleGenerateProforma}
                    disabled={createProformaInvoice.isPending || viewOnly}
                  >
                    <Receipt className="h-4 w-4 mr-2" />
                    Generate Proforma Invoice
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="view" className="mt-4">
          {selectedInvoice && (
            <div className="space-y-4">
              <div className="flex justify-between">
                <Button variant="outline" onClick={handleCancel}>
                  <Eye className="h-4 w-4 mr-2" />
                  Back to List
                </Button>
                <Button onClick={() => window.print()}>
                  Download PDF
                </Button>
              </div>
              <div className="print-content">
                <ProformaInvoiceTemplate data={selectedInvoice} isEditing={false} />
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="edit" className="mt-4">
          {selectedInvoice && !viewOnly && (
            <div className="space-y-4">
              <div className="flex justify-between">
                <Button variant="outline" onClick={handleCancel}>
                  Back to List
                </Button>
                <Button>Save Changes</Button>
              </div>
              <div>
                <ProformaInvoiceTemplate data={selectedInvoice} isEditing={true} />
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProformaInvoiceManager;
