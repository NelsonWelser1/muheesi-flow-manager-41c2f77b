
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";

const AlertNotification = () => {
  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardContent className="pt-6 flex items-center gap-3">
        <AlertCircle className="h-5 w-5 text-orange-600" />
        <span className="text-orange-800">
          Shipment EQ-2453 requires urgent documentation - Due in 48 hours
        </span>
        <Button size="sm" variant="outline" className="ml-auto border-orange-300 text-orange-700 hover:bg-orange-100">
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default AlertNotification;
