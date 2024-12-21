import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuotes } from '@/integrations/supabase/hooks/useQuotes';
import ProformaInvoiceTemplate from './ProformaInvoiceTemplate';

const ProformaInvoice = () => {
  const { data: quotes, isLoading } = useQuotes();
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [importSource, setImportSource] = useState('quote');

  const handleImportSource = (value) => {
    setImportSource(value);
    setSelectedQuote(null);
  };

  const handleGenerateProforma = (source) => {
    console.log('Generating proforma from:', source);
    setSelectedQuote(source);
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">Loading data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {!selectedQuote ? (
        <Card>
          <CardHeader>
            <CardTitle>Generate Proforma Invoice</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <Select value={importSource} onValueChange={handleImportSource}>
                <SelectTrigger>
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quote">Import from Quote</SelectItem>
                  <SelectItem value="order">Import from Order</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {quotes && quotes.length > 0 ? (
              <div className="space-y-4">
                {quotes.map((quote) => (
                  <div key={quote.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">
                        {importSource === 'quote' ? `Quote #${quote.quote_number}` : `Order #${quote.order_number}`}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Customer: {quote.customer_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Total Amount: ${quote.total_amount}
                      </p>
                    </div>
                    <Button onClick={() => handleGenerateProforma(quote)}>
                      Generate Proforma
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No {importSource === 'quote' ? 'quotes' : 'orders'} available to generate proforma invoices.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={() => setSelectedQuote(null)}>
              Back to List
            </Button>
            <Button onClick={handlePrint}>Print Invoice</Button>
          </div>
          <div className="print-content">
            <ProformaInvoiceTemplate data={selectedQuote} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProformaInvoice;