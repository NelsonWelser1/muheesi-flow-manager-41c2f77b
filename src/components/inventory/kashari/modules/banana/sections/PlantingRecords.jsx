
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PlantingRecords = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Planting Records</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Banana plantation planting records will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlantingRecords;
