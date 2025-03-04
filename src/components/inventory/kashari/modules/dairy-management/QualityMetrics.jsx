
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

const QualityMetrics = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quality Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p>Average Fat Content: 3.8%</p>
          <p>Total Production Today: 250L</p>
          <p>Quality Grade: A</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default QualityMetrics;
