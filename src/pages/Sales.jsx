
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Truck, FileText } from "lucide-react";
import SalesOrderForm from '../components/inventory/dairy/sales/forms/SalesOrderForm';
import DeliveryNotesForm from '../components/inventory/dairy/sales/forms/DeliveryNotesForm';
import CustomerInvoiceForm from '../components/inventory/dairy/sales/forms/CustomerInvoiceForm';

const Sales = () => {
  const [activeForm, setActiveForm] = useState(null);

  const renderForm = () => {
    switch (activeForm) {
      case 'sales-order':
        return <SalesOrderForm onBack={() => setActiveForm(null)} />;
      case 'delivery-notes':
        return <DeliveryNotesForm onBack={() => setActiveForm(null)} />;
      case 'customer-invoice':
        return <CustomerInvoiceForm onBack={() => setActiveForm(null)} />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Sales & Accounts</h1>
      
      {!activeForm ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveForm('sales-order')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-medium">Sales Orders</CardTitle>
              <DollarSign className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Create and manage sales orders for customers.
              </p>
              <Button 
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => setActiveForm('sales-order')}
              >
                Create Sales Order
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveForm('delivery-notes')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-medium">Delivery Notes</CardTitle>
              <Truck className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Generate delivery notes for product shipments.
              </p>
              <Button 
                className="mt-4 w-full bg-green-600 hover:bg-green-700"
                onClick={() => setActiveForm('delivery-notes')}
              >
                Create Delivery Note
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveForm('customer-invoice')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-medium">Customer Invoices</CardTitle>
              <FileText className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Generate and manage customer invoices.
              </p>
              <Button 
                className="mt-4 w-full bg-purple-600 hover:bg-purple-700"
                onClick={() => setActiveForm('customer-invoice')}
              >
                Create Invoice
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        renderForm()
      )}
    </div>
  );
};

export default Sales;
