
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Receipt, FileText } from "lucide-react";

const SalesTiles = ({ onSelectForm }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onSelectForm('sales')}>
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
            onClick={() => onSelectForm('sales')}
          >
            Create Sales Order
          </Button>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onSelectForm('delivery')}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-medium">Delivery Notes</CardTitle>
          <Receipt className="h-5 w-5 text-green-600" />
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Generate delivery notes for product shipments.
          </p>
          <Button 
            className="mt-4 w-full bg-green-600 hover:bg-green-700"
            onClick={() => onSelectForm('delivery')}
          >
            Create Delivery Note
          </Button>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onSelectForm('invoice')}>
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
            onClick={() => onSelectForm('invoice')}
          >
            Create Invoice
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesTiles;
