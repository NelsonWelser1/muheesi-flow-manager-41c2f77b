
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SalesOrderForm from '../components/inventory/dairy/sales/forms/SalesOrderForm';
import DeliveryNotesForm from '../components/inventory/dairy/sales/forms/DeliveryNotesForm';
import CustomerInvoiceForm from '../components/inventory/dairy/sales/forms/CustomerInvoiceForm';
import { FileText, Truck, FileInvoice } from 'lucide-react';

const Sales = () => {
  const [activeForm, setActiveForm] = useState(null);

  const renderForm = () => {
    if (activeForm === 'sales_order') {
      return <SalesOrderForm onBack={() => setActiveForm(null)} />;
    } else if (activeForm === 'delivery_notes') {
      return <DeliveryNotesForm onBack={() => setActiveForm(null)} />;
    } else if (activeForm === 'customer_invoice') {
      return <CustomerInvoiceForm onBack={() => setActiveForm(null)} />;
    }
    return null;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Sales & Accounts</h1>
      
      {!activeForm ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveForm('sales_order')}>
            <CardHeader className="bg-blue-50">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Sales Order
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-gray-600">Create and manage sales orders for customers</p>
              <Button className="mt-4 w-full" onClick={() => setActiveForm('sales_order')}>Create Sales Order</Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveForm('delivery_notes')}>
            <CardHeader className="bg-green-50">
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-green-600" />
                Delivery Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-gray-600">Generate delivery notes for order fulfillment</p>
              <Button className="mt-4 w-full" onClick={() => setActiveForm('delivery_notes')}>Create Delivery Note</Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveForm('customer_invoice')}>
            <CardHeader className="bg-purple-50">
              <CardTitle className="flex items-center gap-2">
                <FileInvoice className="h-5 w-5 text-purple-600" />
                Customer Invoices
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-gray-600">Generate and manage customer invoices</p>
              <Button className="mt-4 w-full" onClick={() => setActiveForm('customer_invoice')}>Create Invoice</Button>
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
