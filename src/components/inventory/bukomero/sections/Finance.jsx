
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BukomeroFinance = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Financial Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Financial information for Bukomero Dairy will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BukomeroFinance;
