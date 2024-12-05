import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import QuotationForm from '../quotations/QuotationForm';
import QuotationsList from '../quotations/QuotationsList';

const QuoteManagement = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Quote</CardTitle>
        </CardHeader>
        <CardContent>
          <QuotationForm />
        </CardContent>
      </Card>
      <QuotationsList />
    </div>
  );
};

export default QuoteManagement;