
import React from 'react';
import Shipments from './Shipments';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ShipmentTracking = ({ viewOnly = false }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Coffee Export Shipments</CardTitle>
      </CardHeader>
      <CardContent>
        <Shipments viewOnly={viewOnly} />
      </CardContent>
    </Card>
  );
};

export default ShipmentTracking;
