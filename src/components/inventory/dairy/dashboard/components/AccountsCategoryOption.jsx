
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";

const AccountsCategoryOption = ({ onClick }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onClick}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Accounts</CardTitle>
        <Calculator className="h-8 w-8 text-red-600" />
      </CardHeader>
      <CardContent>
        <p className="text-md text-muted-foreground">
          Manage bills, payments, and payroll functions.
        </p>
        <Button 
          className="mt-4 w-full bg-red-600 hover:bg-red-700 text-lg py-6"
          onClick={onClick}
        >
          Access Accounts Management
        </Button>
      </CardContent>
    </Card>
  );
};

export default AccountsCategoryOption;
