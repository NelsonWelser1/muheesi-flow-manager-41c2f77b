import React from 'react';
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import SalesMarketingLayout from './sales/SalesMarketingLayout';
const SalesMarketing = ({
  onBackToDashboard
}) => {
  // This component now has a simpler structure that just renders the layout
  // We've removed duplicative layers that were causing re-renders

  return <div className="space-y-4">
      

      {/* Directly render the SalesMarketingLayout */}
      <SalesMarketingLayout onBack={onBackToDashboard} />
    </div>;
};
export default SalesMarketing;