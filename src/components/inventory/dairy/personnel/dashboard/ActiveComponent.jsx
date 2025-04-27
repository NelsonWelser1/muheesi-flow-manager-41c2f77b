import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

// This is a placeholder component - you can replace it with actual functionality
const ActiveComponent = ({ activeComponent, onBack }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mr-2"
          onClick={onBack}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h2 className="text-2xl font-bold">{activeComponent}</h2>
      </div>
      
      <div className="border rounded-lg p-6">
        <p className="text-center text-muted-foreground">
          {activeComponent} component is under development
        </p>
      </div>
    </div>
  );
};

export default ActiveComponent;
