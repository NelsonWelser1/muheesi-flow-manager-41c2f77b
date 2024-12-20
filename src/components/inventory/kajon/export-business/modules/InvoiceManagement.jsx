import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import InvoiceForm from './invoice/InvoiceForm';
import InvoiceList from './invoice/InvoiceList';

const InvoiceManagement = () => {
  const [view, setView] = useState('list');
  
  return (
    <div className="space-y-6">
      {view === 'list' ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Invoices</h2>
            <Button onClick={() => setView('form')}>Generate New Invoice</Button>
          </div>
          <InvoiceList />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Generate Invoice</h2>
            <Button variant="outline" onClick={() => setView('list')}>Back to List</Button>
          </div>
          <Card>
            <CardContent className="pt-6">
              <InvoiceForm onBack={() => setView('list')} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default InvoiceManagement;