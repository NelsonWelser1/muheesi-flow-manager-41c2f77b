
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DeliveriesRecords from '../DeliveriesRecords';

const DeliveriesRecordsView = ({ onBack }) => {
  return (
    <div className="space-y-6">
      <Button 
        variant="outline" 
        onClick={onBack}
        className="mb-4"
      >
        ← Back to Delivery Management
      </Button>
      
      <DeliveriesRecords />
    </div>
  );
};

export default DeliveriesRecordsView;
