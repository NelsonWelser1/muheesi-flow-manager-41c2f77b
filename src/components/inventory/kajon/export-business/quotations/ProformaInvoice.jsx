import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuotations } from '@/integrations/supabase/hooks/useQuotations';

const ProformaInvoice = () => {
  const { data: quotations } = useQuotations();

  return (
    <div className="space-y-6">
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
                <Button>Generate Proforma</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProformaInvoice;