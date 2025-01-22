import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, Thermometer, Timer, AlertCircle } from 'lucide-react';

const BatchList = ({ activeBatches }) => {
  return (
    <div className="space-y-4">
      {activeBatches.map((batch) => (
        <Card key={batch.id}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-semibold">Batch #{batch.batch_number}</h4>
                <p className="text-sm text-muted-foreground">
                  {batch.production_line?.name}
                </p>
              </div>
              <Badge variant={
                batch.status === 'completed' ? 'default' :
                batch.status === 'in_progress' ? 'secondary' : 'outline'
              }>
                {batch.status}
              </Badge>
            </div>
            <Progress value={batch.progress} className="mb-2" />
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="flex items-center gap-2">
                <Thermometer className="h-4 w-4" />
                <span>{batch.temperature}°C</span>
              </div>
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4" />
                <span>{batch.duration} hrs</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span>{batch.ph_level} pH</span>
              </div>
            </div>
            {batch.production_line && (
              <div className="mt-2 text-sm text-gray-600">
                Manager: {batch.production_line.manager}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
      {activeBatches.length === 0 && (
        <p className="text-center text-gray-500">No active batches at the moment</p>
      )}
    </div>
  );
};

export default BatchList;