
import React from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const CoffeeInventoryRecords = ({ onBack }) => {
  return (
    <Card className="border-amber-200 bg-amber-50">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">Coffee Inventory Records</CardTitle>
      </CardHeader>
      
      <CardContent>
        <Alert className="mb-6 border-amber-300 bg-amber-100">
          <AlertCircle className="h-4 w-4 text-amber-700" />
          <AlertTitle className="text-amber-800">Information</AlertTitle>
          <AlertDescription className="text-amber-700">
            The coffee inventory functionality has been removed from the system.
          </AlertDescription>
        </Alert>
        
        <Button 
          onClick={onBack}
          className="bg-amber-600 hover:bg-amber-700 text-white"
        >
          Back
        </Button>
      </CardContent>
    </Card>
  );
};

export default CoffeeInventoryRecords;
