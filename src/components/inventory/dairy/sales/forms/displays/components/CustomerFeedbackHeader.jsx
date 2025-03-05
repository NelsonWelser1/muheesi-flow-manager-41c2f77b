
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw } from "lucide-react";

const CustomerFeedbackHeader = ({ onBack, fetchCustomerFeedback }) => {
  return (
    <div className="flex justify-between items-center">
      <Button 
        variant="outline" 
        onClick={onBack}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>
      <Button 
        variant="outline" 
        onClick={fetchCustomerFeedback}
        className="flex items-center gap-2"
      >
        <RefreshCw className="h-4 w-4" /> Refresh Data
      </Button>
    </div>
  );
};

export default CustomerFeedbackHeader;
