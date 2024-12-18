import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuotes } from '@/integrations/supabase/hooks/useQuotes';
import ProformaInvoiceTemplate from './ProformaInvoiceTemplate';

const ProformaInvoice = () => {
  const { data: quotes, isLoading } = useQuotes();
  const [selectedQuote, setSelectedQuote] = React.useState(null);

  console.log('Rendering ProformaInvoice component', { quotes, isLoading });

  const handleGenerateProforma = (quote) => {
    console.log('Generating proforma for quote:', quote);
    setSelectedQuote(quote);
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">Loading quotes...</p>
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
            {quotes && quotes.length > 0 ? (
              <div className="space-y-4">
                {quotes.map((quote) => (
                  <div key={quote.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">Quote #{quote.quote_number}</h3>
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
                <p className="text-muted-foreground">No quotes available to generate proforma invoices.</p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={() => setSelectedQuote(null)}>
              Back to Quotes
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