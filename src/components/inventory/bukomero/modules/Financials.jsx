
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Financials = () => {
  return (
    <Card className="bg-gray-50 border border-gray-200 shadow">
      <CardHeader>
        <CardTitle>Financial Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="py-4">
          <p className="text-gray-600 mb-4">
            Manage financial records, expenses, and revenue for Bukomero Dairy Farm.
          </p>
          <Card className="bg-white p-4 mb-4">
            <p className="font-semibold">Financials module under development</p>
            <p className="text-sm text-gray-500">This feature will be implemented soon.</p>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default Financials;
