
import React from 'react';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const GrowthMetricsView = () => {
  const { toast } = useToast();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Growth Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Growth metrics view content will be implemented here.</p>
      </CardContent>
    </Card>
  );
};

export default GrowthMetricsView;
