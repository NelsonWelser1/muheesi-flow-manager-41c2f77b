
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const AdvertisingPromotionForm = ({ onBack }) => {
  return (
    <div className="space-y-4">
      <Button 
        variant="outline" 
        onClick={onBack}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle>Advertising & Promotional Materials</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This form will allow you to manage assets such as digital flyers, social media calendars, 
            press releases, and promotional material details.
          </p>
          <p className="mt-4 text-muted-foreground">
            Coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvertisingPromotionForm;
