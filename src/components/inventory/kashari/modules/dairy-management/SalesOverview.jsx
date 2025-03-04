
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

const SalesOverview = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p>Sold Today: 200L</p>
          <p>Revenue: UGX 600,000</p>
          <p>Stock Remaining: 50L</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesOverview;
