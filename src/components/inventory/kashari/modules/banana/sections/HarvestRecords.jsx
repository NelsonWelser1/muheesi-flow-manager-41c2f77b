
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const HarvestRecords = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Harvest Records</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Banana harvest records will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default HarvestRecords;
