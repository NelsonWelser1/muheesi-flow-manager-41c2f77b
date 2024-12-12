import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import QuotationForm from './QuotationForm';
import QuotationsList from './QuotationsList';

const QuoteManagement = () => {
  console.log('Rendering QuoteManagement');
  
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