
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";

const SalesCategoryOption = ({ onClick }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onClick}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Sales</CardTitle>
        <DollarSign className="h-8 w-8 text-blue-600" />
      </CardHeader>
      <CardContent>
        <p className="text-md text-muted-foreground">
          Manage sales orders, deliveries, and customer invoices.
        </p>
        <Button 
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
          onClick={onClick}
        >
          Access Sales Management
        </Button>
      </CardContent>
    </Card>
  );
};

export default SalesCategoryOption;
