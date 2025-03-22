
import React from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';

const CoffeeInventoryRecords = ({ onBack }) => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6">Coffee Inventory Records</h2>
      
      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>
          The coffee inventory functionality has been removed from the system.
        </AlertDescription>
      </Alert>
      
      <Button onClick={onBack}>
        Back
      </Button>
    </div>
  );
};

export default CoffeeInventoryRecords;
