import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuotations } from '@/integrations/supabase/hooks/useQuotations';
import ProformaInvoiceTemplate from './ProformaInvoiceTemplate';

const ProformaInvoice = () => {
  const { data: quotations } = useQuotations();
  const [selectedQuote, setSelectedQuote] = React.useState(null);

  console.log('Rendering ProformaInvoice with quotations:', quotations);

  const handleGenerateProforma = (quote) => {
    console.log('Generating proforma for quote:', quote);
    setSelectedQuote(quote);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {!selectedQuote ? (
        <Card>
          <CardHeader>
            <CardTitle>Generate Proforma Invoice</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {quotations?.map((quote) => (
                <div key={quote.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">Quote #{quote.id.slice(0, 8)}</h3>
                    <p className="text-sm text-muted-foreground">
                      Total Amount: ${quote.total_revenue}
                    </p>
                  </div>
                  <Button onClick={() => handleGenerateProforma(quote)}>
                    Generate Proforma
                  </Button>
                </div>
              ))}
            </div>
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
          <ProformaInvoiceTemplate data={selectedQuote} />
        </div>
      )}
    </div>
  );
};

export default ProformaInvoice;