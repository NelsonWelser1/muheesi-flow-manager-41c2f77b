import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const ProductionBatchCard = ({ batch }) => {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg">Batch {batch.batch_number}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Status: {batch.status}</span>
            <span>Line: {batch.production_line?.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Temperature: {batch.temperature}°C</span>
            <span>pH Level: {batch.ph_level}</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{batch.progress}%</span>
            </div>
            <Progress value={batch.progress} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductionBatchCard;