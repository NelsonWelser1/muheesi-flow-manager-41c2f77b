
import React from 'react';
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import SalesMarketingLayout from './sales/SalesMarketingLayout';

const SalesMarketing = ({ onBackToDashboard }) => {
  return (
    <div className="space-y-4">
      <Button 
        variant="outline" 
        onClick={onBackToDashboard}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Button>

      {/* Directly render the SalesMarketingLayout without any intermediate step */}
      <SalesMarketingLayout onBack={onBackToDashboard} />
    </div>
  );
};

export default SalesMarketing;
