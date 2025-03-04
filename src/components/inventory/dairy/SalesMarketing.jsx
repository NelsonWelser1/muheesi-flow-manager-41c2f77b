
import React from 'react';
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import SalesMarketingLayout from './sales/SalesMarketingLayout';

const SalesMarketing = ({ onBackToDashboard }) => {
  // This component now has a simpler structure that just renders the layout
  // We've removed duplicative layers that were causing re-renders
  
  return (
    <div className="space-y-4">
      <Button 
        variant="outline" 
        onClick={onBackToDashboard}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Button>

      {/* Directly render the SalesMarketingLayout */}
      <SalesMarketingLayout onBack={onBackToDashboard} />
    </div>
  );
};

export default SalesMarketing;
